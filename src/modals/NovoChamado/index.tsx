import { useEffect, useState, type FormEvent } from "react";
import "./index.css";
import axios from "axios";

export function NovoChamado({
  tipo,
  isOpenDetalhes,
  setOpenDetalhes,
  chamadoParaEditar,
  setChamadoParaEditar,
  somenteVisualizar,
  setSomenteVisualizar,
  onSaveSuccess,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(1);
  const [location, setLocation] = useState("Selecione");
  const [status, setStatus] = useState("Aberto");
  const [erroChamado, setErroChamado] = useState<null | boolean>(null);
  const [atendentes, setAtendentes] = useState([]);
  const [atendenteSelecionado, setAtendenteSelecionado] = useState();
  const [abertoPor, setAbertoPor ] = useState();

  var tipoAtendentes;
  if (tipo === 1) {
    tipoAtendentes = 2;
  }

  useEffect(() => {
    if (chamadoParaEditar) {
      console.log(chamadoParaEditar)
      setTitle(chamadoParaEditar.title);
      setDescription(chamadoParaEditar.description);
      setPriority(chamadoParaEditar.priority);
      setLocation(chamadoParaEditar.location);
      setStatus(chamadoParaEditar.status);
      setAtendenteSelecionado(chamadoParaEditar.usuario_atendente?.id);
      setAbertoPor(chamadoParaEditar.usuario_abriu?.nome_completo);
      console.log(chamadoParaEditar)

      // ... etc
    } else {
      // se for novo chamado, limpa o form
      setTitle("");
      setDescription("");
      setPriority(1);
      setLocation("");
      setStatus("Aberto");
      setAtendenteSelecionado("");
      setAbertoPor("");
    }
  }, [chamadoParaEditar]);

  useEffect(() => {
    axios
      .get(`http://192.168.11.149:8000/users/${tipoAtendentes}`)
      .then((response) => {
        setAtendentes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const userId = localStorage.getItem("user_id_help");
  const typeUser = Number(localStorage.getItem("tipo_user"));

  const podeVerStatus = () => {
    return (
      (typeUser === 2 && tipo === 1) || // Atendente TI → chamados de TI
      (typeUser === 3 && tipo === 2) || // Atendente Assistência → chamados de Assistência
      (typeUser === 4 && tipo === 3) // Atendente Facilities → chamados de Facilities
    );
  };

  function handleNovoChamado(e: FormEvent) {
    e.preventDefault();

    const chamado = {
      aberto_por: userId,
      atendente : atendenteSelecionado !== "" ? Number(atendenteSelecionado) : null,
      title,
      description,
      priority,
      location,
      tipo,
      status,
    };

    let url = "http://192.168.11.149:8000/chamados";

    const request = chamadoParaEditar
      ? axios.put(`${url}/${chamadoParaEditar.id}`, chamado) // EDIÇÃO
      : axios.post(url, chamado); // CRIAÇÃO

    request
      .then(() => {
        setTitle("");
        setDescription("");
        setPriority(1);
        setLocation("");
        setErroChamado(false);
        setTimeout(() => setErroChamado(null), 3000);

        // Fecha modal e limpa edição (se aplicável)
        //setOpenDetalhes(false);
        setChamadoParaEditar(null);
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      })
      .catch((error) => {
        console.error("Erro:", error.response?.data || error.message);
        setErroChamado(true);
        setTimeout(() => setErroChamado(null), 5000);
      });
  }

  if (isOpenDetalhes) {
    return (
      <div className="w-full bg-black background">
        <div className="flex flex-col modal w-[70vw] h-[90vh] bg-white rounded-2xl modal">
          <div className="flex justify-between m-2.5">
            <div>
              <h2 className="text-black">Novo Chamado/Detalhes</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setOpenDetalhes(!isOpenDetalhes);
                  setChamadoParaEditar(null);
                  setSomenteVisualizar(false);
                }}
                className="text-white bg-red-500 p-1 rounded"
              >
                Fechar
              </button>
            </div>
          </div>
          <div className="flex h-full w-full bg-gray-500">
            <form
              onSubmit={handleNovoChamado}
              className="w-full mx-auto bg-white shadow-md rounded p-6 space-y-4"
            >
              {/* Título */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Título
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  disabled={somenteVisualizar}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descrição
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={description}
                  disabled={somenteVisualizar}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                ></textarea>
              </div>

              {/* Prioridade */}
              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700"
                >
                  Prioridade
                </label>
                <select
                  name="priority"
                  id="priority"
                  value={priority}
                  disabled={somenteVisualizar}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value={0}>Baixa</option>
                  <option value={1}>Média</option>
                  <option value={2}>Alta</option>
                </select>
              </div>
              <div>
                <label htmlFor=""  className="block text-sm font-medium text-gray-700">Aberto por </label>
                  <p  className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500">{abertoPor}</p>
              
              </div>

              <div>
                <label
                 
                  className="block text-sm font-medium text-gray-700"
                >
                 Atendente
                </label>
                <select
                  value={atendenteSelecionado}
                  onChange={(e)=> {setAtendenteSelecionado(e.target.value); console.log(e.target.value)}}
                  disabled={somenteVisualizar}
                  className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Selecione um atendente</option>
                  {atendentes.map((atendente) => (
                    <option key={atendente.id} value={atendente.id}>
                      {atendente.nome_completo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              {podeVerStatus() && (
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={status}
                    disabled={somenteVisualizar}
                    onChange={(e) => setStatus(e.target.value)}
                    className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="Aberto">Aberto</option>
                    <option value="Em Atendimento">Em Atendimento</option>
                    <option value="Fechado">Fechado</option>
                  </select>
                </div>
              )}

              {/* location */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Setor
                </label>
                <select
                  name="location"
                  id="status"
                  value={location}
                  disabled={somenteVisualizar}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Selecione</option>{" "}
                  <option value="ASSESSORIA">ASSESSORIA</option>
                  <option value="ASSISTENCIA">ASSISTÊNCIA</option>
                  <option value="COMERCIAL">COMERCIAL</option>
                  <option value="COMEX">COMEX</option>
                  <option value="COMPLIANCE">COMPLIANCE</option>
                  <option value="COMPRAS">COMPRAS</option>
                  <option value="CONTROLADORIA">CONTROLADORIA</option>
                  <option value="DIRETORIA">DIRETORIA</option>
                  <option value="ECOMMERCE">ECOMMERCE</option>
                  <option value="EKAZZA">EKAZZA</option>
                  <option value="ENGENHARIA">ENGENHARIA</option>
                  <option value="EXPEDIÇÃO">EXPEDIÇÃO</option>
                  <option value="FACILITIES">FACILITIES</option>
                  <option value="FATURAMENTO">FATURAMENTO</option>
                  <option value="FINANCEIRO">FINANCEIRO</option>
                  <option value="FISCAL">FISCAL</option>
                  <option value="ITAJAI - MATRIZ">ITAJAI - MATRIZ</option>
                  <option value="JUNDIAI - GR">JUNDIAI - GR</option>
                  <option value="LOGISTICA">LOGÍSTICA</option>
                  <option value="MARKETING">MARKETING</option>
                  <option value="MAXIME">MAXIME</option>
                  <option value="MGL">MGL</option>
                  <option value="NEGOCIOS DIGITAIS">NEGÓCIOS DIGITAIS</option>
                  <option value="PMSO">PMSO</option>
                  <option value="QUALIDADE">QUALIDADE</option>
                  <option value="R.H">R.H</option>
                  <option value="RECEPCAO">RECEPÇÃO</option>
                  <option value="REPRESENTANTES">REPRESENTANTES</option>
                  <option value="RH">RH</option>
                  <option value="T.I">T.I</option>
                </select>
              </div>

              {/* Botão */}
              {!somenteVisualizar && (
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
                  >
                    Enviar Chamado
                  </button>
                </div>
              )}
              {/* Mostrar mensagem de erro se login falhar */}
              {erroChamado !== null && (
                <p
                  className={`text-sm mt-2 text-center ${
                    erroChamado ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {erroChamado
                    ? "Falta preencher algum campo, verifique o formulário!"
                    : "Chamado salvo com sucesso!"}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  } else {
    return;
  }
}
