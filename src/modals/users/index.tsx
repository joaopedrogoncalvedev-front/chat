import { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";
import { NovoUser } from "../NovoUser";

export function Users({ isOpen, setOpen }) {
  const [busca, setBusca] = useState("");
  const [users, setUsers] = useState([]);
  const [isOpenNovoUser, setOpenNovoUser] = useState<boolean>(false);

  const getUsers = () => {
    axios
      .get("http://192.168.11.149:8000/users")
      .then((response) => {
        setUsers(response.data);
        
      })
      .catch((error) => {
        console.error("Erro:", error.response?.data || error.message);
      });
  };

  function handleDeleteUsers (id ){
          if (window.confirm('Tem certeza que deseja deletar este chamado?')) {
              axios.delete(
                `http://192.168.11.149:8000/users/${id}`
              )
              .then(()=>{
                alert("Usuário deletado com sucesso!!!");
              })
              .catch((error) =>{
                  alert("Iformation error:" + error.response);
              }
              )
          }
    

  }

  useEffect(() => {
    getUsers();
  }, []);

  const usersFiltrados = users.filter((user) => {
    const texto = busca.toLowerCase();
    return (
      user.username?.toLowerCase().includes(texto) ||
      user.status?.toLowerCase().includes(texto) ||
      user.nome?.toLowerCase().includes(texto)
    );
  });

  if (isOpen) {
    return (
      <div className="background">
        <div className="flex flex-col modal w-[70vw] h-[70vh] bg-white rounded-2xl p-1.5">
          <div className="flex justify-between m-2.5">
            <div>
              <h2 className="text-black">Usuários</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={()=> setOpenNovoUser(!isOpenNovoUser)} className="text-white bg-green-500 p-1 rounded">
                Novo user
              </button>
              <button
                onClick={() => {
                  setOpen(!isOpen);
                }}
                className="text-white bg-red-500 p-1 rounded"
              >
                Fechar
              </button>
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="Buscar usuários..."
              className="mb-4 w-full px-3 py-2 rounded-2xl border border-black-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-black"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="overflow-y-auto "></div>
          <table className="max-w-full border border-gray-300 mt-4">
            <thead>
              <tr>
                <th className="text-white bg-black px-2 py-2 border-b">ID</th>
                <th className="text-white bg-black px-2 py-2 border-b">
                  Username
                </th>
                <th className="text-white bg-black px-2 py-2 border-b">Nome</th>
                <th className="text-white bg-black px-2 py-2 border-b">
                  Status
                </th>
                <th className="text-white bg-black px-2 py-2 border-b">
                  Editar
                </th>
                <th className="text-white bg-black px-2 py-2 border-b">
                  Visualizar
                </th>
                <th className="text-white bg-black px-2 py-2 border-b">
                  Excluir
                </th>
              </tr>
            </thead>
            <tbody>
              {usersFiltrados.map((user: any) => (
                <tr
                  key={user.id}
                  className={
                    user.status === "Aberto"
                      ? "bg-blue-200 hover:bg-blue-300"
                      : user.status === "Em Atendimento"
                      ? "bg-green-200 hover:bg-green-300"
                      : "bg-gray-200 hover:bg-gray-300"
                  }
                >
                  <td className="text-black px-2 py-2 border-b text-center">
                    {user.id}
                  </td>
                  <td className="text-black px-2 py-2 border-b text-center">
                    {user.username}
                  </td>
                  <td className="text-black px-2 py-2 border-b text-center">
                    {user.nome_completo}
                  </td>
                  <td className="text-black px-2 py-2 border-b text-center">
                    {user.status}
                  </td>

                  <td className="text-black px-2 py-2 border-b text-center">
                    <button className="bg-orange-500 p-1 rounded text-white">
                      Editar
                    </button>
                  </td>
                  <td className="text-black px-2 py-2 border-b text-center">
                    <button className="bg-yellow-300 p-1 rounded text-white">
                      Visualizar
                    </button>
                  </td>
                  <td className="text-black px-2 py-2 border-b text-center">
                    <button
                      
                      className="bg-red-600 p-1 rounded text-white">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <NovoUser isOpenNovoUser={isOpenNovoUser} setOpenNovoUser={setOpenNovoUser} />
      </div>
    );
  }
  return null;
}
