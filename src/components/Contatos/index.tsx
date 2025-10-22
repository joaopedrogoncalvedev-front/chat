import { useEffect, useState } from "react";
import axios from "axios";
import { useContato } from "../../context/contatoSelecionado";
import { FaUser } from "react-icons/fa";
import "./index.css";
import { useAbreContatos } from "../../context/abrirContatos";

export function Contatos() {
  const [contatos, setContatos] = useState([]);
  const [busca, setBusca] = useState("");
  const { contatoSelecionado, setContatoSelecionado } = useContato();
  const { AbreContatosAbertoFechado, setAbreContatosAbertoFechado } =
    useAbreContatos();

  useEffect(() => {
    axios
      .get("http://192.168.11.149:8000/users/")
      .then((response) => {
        setContatos(response.data);
      })
      .catch((error) => {
        console.error("Erro:", error.response?.data || error.message);
      });
  }, []);

  const contatosFiltrados = contatos
    .filter(
      (item) =>
        item.username?.toLowerCase().includes(busca.toLowerCase()) ||
        item.nome_completo?.toLowerCase().includes(busca.toLowerCase())
    )
    .sort((a, b) => {
      if (a.unread_messages && !b.unread_messages) return -1;
      if (!a.unread_messages && b.unread_messages) return 1;
      return 0;
    });

  if (AbreContatosAbertoFechado) {
    return (
      <div
        className={`bg-amber-50  rounded-2xl p-4 shadow-md flex flex-col transition-all duration-300 background z-[9999]`}
      >
        <div className="modal bg-white p-8 rounded-2xl shadow-2xl shadow-blue-600">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Contatos</h2>

            <button
              onClick={() => setAbreContatosAbertoFechado(false)}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors duration-200"
              aria-label="Fechar lista de contatos"
            >
              ✕
            </button>
          </div>

          <input
            type="text"
            placeholder="Buscar contato..."
            className="mb-4 px-3 py-2 rounded-2xl border w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-black"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          {/* Lista de contatos */}
          <ul className="overflow-y-auto space-y-2 flex-1 ">
            {contatosFiltrados.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-white hover:bg-amber-100 transition-all duration-200 shadow-sm rounded-xl p-3 cursor-pointer"
                onClick={() => {setContatoSelecionado(item); setAbreContatosAbertoFechado(false)}}
              >
                {/* Avatar + status */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <FaUser size={35} className="rounded-full text-gray-700" />
                    <span
                      className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full ring-2 ring-white ${
                        item.status === "S" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>

                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-800">
                      {item.nome_completo}
                    </p>
                    <div className="text-xs text-gray-600 flex flex-wrap gap-x-2">
                      <span>Função: {item.cargo}</span>
                      <span>Setor: {item.setor}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}

            {contatosFiltrados.length === 0 && (
              <li className="text-gray-500 text-center py-4">
                Nenhum contato encontrado
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
