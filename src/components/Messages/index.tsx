import { useEffect, useState, useRef, type FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPaperclip } from "react-icons/fa";
import "./index.css";
import { usePrincipal } from "../../context/principal";
import { useContato } from "../../context/contatoSelecionado";
import { useLogado } from "../../context/userLogado";

export function Messages() {
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [novaMessage, setNovaMensagem] = useState("");
  const usuarioAtualId = Number(localStorage.getItem("user_id_help"));
  const socket = useRef<WebSocket | null>(null);
  const mensagensEndRef = useRef<HTMLDivElement | null>(null);
  const { principalAbertoFechado, setPrincipalAbertoFechado } = usePrincipal();
  const { contatoSelecionado, setContatoSelecionado } = useContato();
  const { userLogado } = useLogado();
  const [arquivo, setArquivo] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Marcar mensagens como lidas
  async function marcarMensagensComoLidas(userId: number, contactId: number) {
    try {
      await axios.put(
        `http://192.168.11.149:8000/message/mark-as-read/${userId}/${contactId}/`
      );
    } catch (error) {
      console.error("Erro ao marcar mensagens como lidas:", error);
    }
  }

  useEffect(() => {
    if (contatoSelecionado) {
      marcarMensagensComoLidas(userLogado.id, contatoSelecionado.id);
    }
  }, [contatoSelecionado]);

  // Scroll automático
  const scrollToBottom = () => {
    mensagensEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const handleClickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArquivo(e.target.files[0]);
    }
  };

  // Buscar mensagens do histórico
  const fetchMensagens = async () => {
    if (!contatoSelecionado) return;
    try {
      const response = await axios.get(
        `http://192.168.11.149:8000/message/?sender_id=${usuarioAtualId}&receiver_id=${contatoSelecionado.id}`
      );
      setMensagens(response.data);
    } catch (err) {
      console.error("Erro ao buscar mensagens:", err);
    }
  };

  // WebSocket
  useEffect(() => {
    if (!contatoSelecionado) return;

    fetchMensagens();

    const url = `ws://192.168.11.149:8000/ws/chat/${Math.min(
      usuarioAtualId,
      contatoSelecionado.id
    )}/${Math.max(usuarioAtualId, contatoSelecionado.id)}`;
    socket.current = new WebSocket(url);

    socket.current.onopen = () => console.log("Conectado ao WebSocket");

    socket.current.onmessage = (event) => {
      const mensagemRecebida = JSON.parse(event.data);

      // Evita duplicar mensagens enviadas pelo próprio usuário
      if (mensagemRecebida.sender_id !== usuarioAtualId) {
        setMensagens((prev) => [...prev, mensagemRecebida]);

        toast.info(
          `Nova mensagem de ${contatoSelecionado.username}: ${mensagemRecebida.message}`,
          {
            position: "bottom-left",
            autoClose: 10000,
          }
        );

        const audio = new Audio("/sound/notification.mp3");
        audio.play().catch((e) => console.log("Erro ao tocar som:", e));
      }
    };

    socket.current.onerror = (event) => console.error("Erro no WebSocket:", event);

    socket.current.onclose = () => console.log("Conexão WebSocket fechada");

    return () => {
      socket.current?.close();
      socket.current = null;
    };
  }, [contatoSelecionado]);

  // Envio de mensagem
  async function handleEnviaMessage(e: FormEvent) {
    e.preventDefault();
    if (!novaMessage.trim() && !arquivo) return;

    const formData = new FormData();
    formData.append("sender_id", String(usuarioAtualId));
    formData.append("receiver_id", String(contatoSelecionado?.id));
    formData.append("message", novaMessage);
    if (arquivo) formData.append("file", arquivo);

    try {
      const response = await axios.post(
        "http://192.168.11.149:8000/message/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const mensagemSalva = response.data;
      setMensagens((prev) => [...prev, mensagemSalva]); // adiciona na lista
      setNovaMensagem("");
      setArquivo(null);

      // Opcional: enviar via WebSocket apenas o aviso, sem duplicar na lista
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.send(
          JSON.stringify({
            sender_id: usuarioAtualId,
            receiver_id: contatoSelecionado?.id,
            message: novaMessage,
            timestamp: mensagemSalva.timestamp,
            file_name: mensagemSalva.file_name,
          })
        );
      }
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  }

  // Render
  if (!contatoSelecionado) {
    return (
      <main
        className={`flex flex-col h-[90vh] items-center justify-center text-black  rounded-2xl w-full mt-15 bg-transparent ${
          principalAbertoFechado ? "hidden" : ""
        }`}
      >
        <h1 className="flex flex-col text-7xl font-bold text-center text-white w-full h-screen led-outline transparent pt-10">
          Bem vindo ao Hive Systems
        </h1>
      </main>
    );
  }

  return (
    <main
      className="flex flex-col h-[90vh]  text-black p-4 rounded-2xl w-full mt-15"
      style={{ backgroundColor: "#BFDBF7" }}
    >
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <p className="text-lg font-bold">Conversando com: {contatoSelecionado.username}</p>
        <button
          className="bg-red-500 p-2 rounded-2xl text-white font-bold"
          onClick={() => {
            setContatoSelecionado(null);
            setPrincipalAbertoFechado(false);
          }}
        >
          Fechar
        </button>
      </div>

      <ul className="flex-1 overflow-y-auto space-y-2 mb-4">
        {mensagens.map((msg, i) => (
          <li key={i} className={`flex ${msg.sender_id === usuarioAtualId ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-4 py-2 rounded-lg max-w-xl ${
                msg.sender_id === usuarioAtualId
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              <p>{msg.message}</p>
              {msg.file_name && (
                <a
                  href={`http://192.168.11.149:8000/files/${msg.file_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-black underline mt-1"
                >
                  {msg.file_name}
                </a>
              )}
              <span className="float-right" style={{ fontSize: "0.60rem" }}>
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </li>
        ))}
        <div ref={mensagensEndRef} />
      </ul>

      <form onSubmit={handleEnviaMessage} className="flex gap-4">
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleClickFile}
            className="text-gray-600 hover:text-blue-600 p-2 rounded-full transition duration-200"
            title="Anexar arquivo"
          >
            <FaPaperclip className="w-5 h-5" />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>

        <input
          type="text"
          className="bg-gray-300 flex-grow h-10 rounded-2xl px-3 border-2"
          value={novaMessage}
          onChange={(e) => setNovaMensagem(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 rounded-2xl h-10 hover:bg-blue-600 transition"
        >
          Enviar
        </button>
      </form>
    </main>
  );
}
