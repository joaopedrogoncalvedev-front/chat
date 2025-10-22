import { useState, type FormEvent } from "react";
import "./index.css";
import axios from "axios";


export function NovoUser({ isOpenNovoUser, setOpenNovoUser }) {
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [setor, setSetor] = useState("");
  const [tipo, setTipo] = useState<Number>();
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const [erroChamado, setErroChamado] = useState<null | boolean>(null); 


  function handleRegister(e : FormEvent){
    e.preventDefault();
     async function sendNewUser(){
            await axios.post(
                    "http://192.168.11.149:8000/users",
                {
                    username: username,
                    senha: senha,
                    type : tipo,
                    cargo : cargo,
                    setor: setor,                          
                    nome_completo:nome
                })
                .then(() =>{
                    console.log("sucesso")
                    setErroChamado(false);

                })
                .catch((error) =>{
                    console.log(error)
                    setErroChamado(true);
                }
                )
    }
    sendNewUser();
  }

  if (isOpenNovoUser) {
    return (
      <div className="w-full bg-black background">
        <div className="flex flex-col modal w-[70vw] h-[70vh] bg-white rounded-2xl modal">
          <div className="flex justify-between m-2.5">
            <div>
              <h2 className="text-black">Novo Usuário</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setOpenNovoUser(!isOpenNovoUser);
                }}
                className="text-white bg-red-500 p-1 rounded"
              >
                Fechar
              </button>
            </div>
          </div>
          <div>
            <form onSubmit={handleRegister}>
              <div className="flex flex-col max-w-full px-2">
                <label htmlFor="" className="text-black">
                  Nome:
                </label>
                <input
                  type="text"
                  value={nome}
                  required
                  onChange={(e) => setNome(e.target.value)}
                  className="text-black border-2 rounded p-1"
                  placeholder="nome"
                />
              </div>
              <div className="flex flex-col max-w-full px-2">
                <label htmlFor="" className="text-black">
                  Username:
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="text-black border-2 rounded p-1"
                  placeholder="username"
                />
              </div>
              <div className="flex flex-col max-w-full px-2">
                <label
                  htmlFor="Tipo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tipo
                </label>
                <select
                    value={tipo}
                    required
                  onChange={(e) => setTipo(e.target.value)}
                className="text-black mt-1 block w-full rounded-md border-2 shadow-sm focus:ring-green-500 focus:border-green-500">
                   <option value={1}>Usuário</option>
                  <option value={2}>Atendente T.I</option>
                  <option value={3}>Atendente Assistência</option>
                  <option value={4}>Atendente Facilites</option>
                </select>
              </div>
              <div className="flex flex-col max-w-full px-2">
                <label htmlFor="" className="text-black">
                  Função:
                </label>
                <input
                  type="text"
                  value={cargo}
                  required
                  onChange={(e) => setCargo(e.target.value)}
                  className="text-black border-2 rounded p-1"
                  placeholder="função"
                />
              </div>
              <div className="flex flex-col max-w-full px-2">
                <label htmlFor="" className="text-black">
                  Setor:
                </label>
                <input
                  type="text"
                  value={setor}
                  required
                  onChange={(e) => setSetor(e.target.value)}
                  className="text-black border-2 rounded p-1"
                  placeholder="setor"
                />
              </div>
              <div className="flex flex-col max-w-full px-2">
                <label htmlFor="" className="text-black">
                  Senha:
                </label>
                <input
                  type="password"
                  value={senha}
                  required
                  onChange={(e) => setSenha(e.target.value)}
                  className="text-black border-2 rounded p-1"
                  placeholder="********"
                />
              </div>
              <div className="pt-4 px-2">
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
                >
                  Cadastrar novo usuário
                </button>
              </div>
               {erroChamado !== null && (
                                <p
                                    className={`text-sm mt-2 text-center ${
                                    erroChamado ? 'text-red-500' : 'text-green-600'
                                    }`}
                                >
                                    {erroChamado
                                    ? 'Falta preencher algum campo, verifique o formulário!'
                                    : 'Usuário salvo com sucesso!'}
                                </p>
                                )}
            </form>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
