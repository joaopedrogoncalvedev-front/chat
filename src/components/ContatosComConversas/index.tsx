import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useContato } from "../../context/contatoSelecionado";
import { useLogado } from "../../context/userLogado";
import { RiChatNewFill } from "react-icons/ri";
import { useAbreContatos } from "../../context/abrirContatos";
import { Contatos } from "../Contatos";
import { useNotification } from "../../context/websocket";

export function ContatosComConversas() {
  const [contatos, setContatos] = useState([]);
  const [busca, setBusca] = useState("");
  const [colapsado, setColapsado] = useState(false);
  const { contatoSelecionado, setContatoSelecionado } = useContato();
  const { userLogado } = useLogado();
  const { AbreContatosAbertoFechado , setAbreContatosAbertoFechado } = useAbreContatos();
  const { lastNotification} = useNotification();

  console.log("Última notificação recebida:", lastNotification);



  useEffect(() => {
    axios
      .get("http://192.168.11.149:8000/users/list/" + userLogado?.id)
      .then((response) => {
        setContatos(response.data);
      })
      .catch((error) => {
        console.error("Erro:", error.response?.data || error.message);
      });
  },[contatoSelecionado, lastNotification]);

  const contatosFiltrados = contatos.filter(
    (item) =>
      item.username?.toLowerCase().includes(busca.toLowerCase()) ||
      item.nome_completo?.toLowerCase().includes(busca.toLowerCase())
  ).sort((a, b) => {
    if (a.unread_messages && !b.unread_messages) return -1;
    if (!a.unread_messages && b.unread_messages) return 1;
    return 0;
  });

  return (
    <nav
      className={`bg-amber-50 h-[90vh] rounded-2xl p-4 shadow-md flex flex-col transition-all duration-300
        ${colapsado ? "w-20" : "w-80"} 
        mt-15 mx-4`}
      
    >
      <div className="flex  items-center justify-between border-b-amber-600 border-b pb-1 mb-2">
        <button
        className=" self-start"
        onClick={() =>setAbreContatosAbertoFechado(true)}
        >
                <RiChatNewFill size={25} color="" className="text-gray-600  hover:text-black transition" />
        </button>

     
      <button
        onClick={() => setColapsado(!colapsado)}
        className="mb-4 self-end text-gray-600 hover:text-black transition"
      >
        {colapsado ? <FaChevronRight size={25} /> : <FaChevronLeft size={25} />}
      </button>
      </div>

      

      {/* Campo de busca */}
      {!colapsado && (
        <input
          type="text"
          placeholder="Buscar contato..."
          className="mb-4 px-3 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-black"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      )}

      {/* Lista de contatos */}
      <ul className="overflow-y-auto space-y-2 flex-1 ">
  {contatosFiltrados.map((item, index) => (
    <li
      key={index}
      className="flex items-center justify-between bg-white hover:bg-amber-100 transition-all duration-200 shadow-sm rounded-xl p-3 cursor-pointer"
      onClick={() => setContatoSelecionado(item)}
    >
      {/* Avatar + status */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <FaUser
            size={35}
            className="rounded-full text-gray-700"
          />
          <span
            className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full ring-2 ring-white ${
              item.status === "S" ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>
        {!colapsado && (
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-gray-800">{item.nome_completo}</p>
            <div className="text-xs text-gray-600 flex flex-wrap gap-x-2">
              <span>Função: {item.cargo}</span>
              <span>Setor: {item.setor}</span>
            </div>
          </div>
        )}
      </div>

      {/* Contador de mensagens não lidas */}
      {!colapsado && item.unread_messages > 0 && (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-semibold">
          {item.unread_messages}
        </div>
      )}
    </li>
  ))}

  {!colapsado && contatosFiltrados.length === 0 && (
    <li className="text-gray-500 text-center py-4">
      Nenhum contato encontrado
    </li>
  )}
</ul>
    <Contatos/>
    </nav>
   
  );
}
