import { useEffect, useState } from 'react';
import './index.css';
import axios from 'axios';
import { NovoChamado } from '../NovoChamado';
import { usePrincipal } from '../../context/principal';
import { TbMessageCircle } from "react-icons/tb";
import { useContato } from '../../context/contatoSelecionado';

interface chamadosprops{
    isOpen : boolean;
    tipo : number;
}

export function Chamados({isOpen, tipo, setOpen, setTipo} : chamadosprops){
    const [open_detalhes,setOpenDetalhes] = useState<boolean>(false);
    const {principalAbertoFechado, setPrincipalAbertoFechado} = usePrincipal();

    const {contatoSelecionado,  setContatoSelecionado } = useContato();


    const userId = localStorage.getItem("user_id_help");
    const tipo_user = Number(localStorage.getItem("tipo_user"));
    const [chamados , setChamados] = useState([]);
    const [chamadoParaEditar, setChamadoParaEditar] = useState<any | null>(null);
    const [ somenteVisualizar, setSomenteVisualizar] = useState<boolean>(false);
    const [busca, setBusca] = useState("");

      const handleDeleteClick = (chamado: any) => {
            if (window.confirm('Tem certeza que deseja deletar este chamado?')) {
            axios
                .delete(`http://192.168.11.149:8000/chamados/${chamado.id}`)
                .then(() => {
                alert('Chamado deletado com sucesso!');
               
                 fetchChamados(); // Pode atualizar a lista pai
                })
                .catch((error) => {
                alert('Erro ao deletar o chamado: ' + (error.response?.data?.detail || error.message));
                });
            }
        }

    const fetchChamados = () => {
            let url = '';

            switch(tipo_user){
                case 1:
                    url = `http://192.168.11.149:8000/chamados?userId=${userId}&type=${tipo}`;
                    break;
                case 2:
                    if(tipo == 1){
                        url = `http://192.168.11.149:8000/chamados/type?type=${tipo}`;
                    } else {
                        url = `http://192.168.11.149:8000/chamados?userId=${userId}&type=${tipo}`;
                    };
                    break;
                case 3:
                    if(tipo == 2){
                        url = `http://192.168.11.149:8000/chamados/type?type=${tipo}`;
                    } else {
                        url = `http://192.168.11.149:8000/chamados?userId=${userId}&type=${tipo}`;
                    };
                    break;
                case 4:
                    if(tipo == 3){
                        url = `http://192.168.11.149:8000/chamados/type?type=${tipo}`;
                    } else {
                        url = `http://192.168.11.149:8000/chamados?userId=${userId}&type=${tipo}`;
                    };
                    break;
                default:
                    url = `http://192.168.11.149:8000/chamados/type?type=${tipo}`;
            }
            axios
            .get(url)
            .then((response) => {
                setChamados(response.data);
            })
            .catch((error) => {
                console.error("Erro:", error.response?.data || error.message);
            });
}


    

    useEffect(() => {
        fetchChamados();
    }, [userId, tipo]);
    
    if (isOpen){
        const getTitulo = ()=>{
        switch (tipo){
            case 1:
                return 'Chamados T.I';
            case 2:
                return 'Chamados Assistência'
            case 3:
                return 'Chamados Facilites'
            default: 
                return 'nada';
        }
    }

            const chamadosFiltrados = chamados.filter((chamado) => {
                    const texto = busca.toLowerCase();
                    return (
                        chamado.title?.toLowerCase().includes(texto) ||
                        chamado.timestamp?.toLowerCase().includes(texto) ||
                        chamado.description?.toLowerCase().includes(texto) ||
                        chamado.priority?.toString().includes(texto) ||
                        chamado.status?.toLowerCase().includes(texto) ||
                        chamado.location?.toLowerCase().includes(texto) 
                        
                    );
        });


        return(
        <div className='background'>
           <div className='flex flex-col modal w-[70vw] h-[70vh] bg-white rounded-2xl p-1.5'>
                <div className='flex justify-between m-2.5'>
                    <div>
                    <h2 className='text-black'>{getTitulo()}</h2>
                    </div>
                    <div className='flex gap-2'>
                        <button onClick={()=>{
                                setChamadoParaEditar(null);       // Limpa dados de edição
                                setSomenteVisualizar(false);      // Garante que o formulário fique habilitado
                                setOpenDetalhes(true);  
                                }} className='text-white bg-green-500 p-1 rounded'>Novo Chamado</button>
                        <button onClick={()=>{setOpen(!isOpen); setTipo(0); setPrincipalAbertoFechado(false)}} className='text-white bg-red-500 p-1 rounded'>Fechar</button>
                        
                    </div>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Buscar chamados..."
                        className="mb-4 w-full px-3 py-2 rounded-2xl border border-black-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-black"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>
                <div className='overflow-y-auto'>
                    <table className="min-w-full border border-gray-300 mt-4">
                        <thead>
                            <tr>
                                <th className="text-white bg-black px-2 py-2 border-b">ID</th>                                
                                <th className="text-white bg-black px-2 py-2 border-b">Abertura</th>
                                <th className="text-white bg-black px-2 py-2 border-b">Fechamento</th>
                                <th className="text-white bg-black px-2 py-2 border-b">Título</th>
                                <th className="text-white bg-black px-2 py-2 border-b">Status</th>
                                <th className="text-white bg-black px-2 py-2 border-b">Técnico</th>
                                <th className="text-white bg-black px-2 py-2 border-b">Enviar MSG</th>
                                <th className="text-white bg-black px-2 py-2 border-b">Editar</th>
                                <th className="text-white bg-black px-2 py-2 border-b">Visualizar</th>
                                <th className="text-white bg-black px-2 py-2 border-b">Excluir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chamadosFiltrados.map((chamado: any) => (
                                <tr key={chamado.id} 
                                className={
                                            chamado.status === "Aberto"
                                            ? "bg-blue-200 hover:bg-blue-300"
                                            : chamado.status === "Em Atendimento"
                                            ? "bg-green-200 hover:bg-green-300"
                                            : "bg-gray-200 hover:bg-gray-300"
                                        }
                                
                                >
                                    <td className="text-black px-2 py-2 border-b text-center">{chamado.id}</td>
                                    <td className="text-black px-2 py-2 border-b text-center">{chamado.timestamp.split('.')[0].replace('T', ' ')}</td>
                                    <td className="text-black px-2 py-2 border-b text-center">{chamado.timestamp_close ? chamado.timestamp_close.split('.')[0].replace('T', ' ') : '—'}</td>
                                    <td className="text-black px-2 py-2 border-b text-center">{chamado.title.length > 20 ? chamado.title.slice(0, 10) + '...' : chamado.title}</td>
                                    <td className="text-black px-2 py-2 border-b text-center">{chamado.status}</td>
                                    <td className="text-black px-2 py-2 border-b text-center">-</td>
                                    <td className="text-black px-2 py-2 border-b text-center flex items-center justify-center"><TbMessageCircle size={35} className='text-green-500 ' onClick={()=>{setOpen(!isOpen); setContatoSelecionado({"id": chamado.aberto_por, "username": chamado.usuario_abriu.username, "nome_completo": chamado.usuario_abriu.nome_completo})}}/></td>
                                    <td className="text-black px-2 py-2 border-b text-center"><button  onClick={() => {
                                                                                                                    setChamadoParaEditar(chamado); // 👈 define os dados
                                                                                                                    setOpenDetalhes(true);         // abre modal
                                                                                                                }} className='bg-orange-500 p-1 rounded text-white'>Editar</button></td>
                                    <td className="text-black px-2 py-2 border-b text-center"><button onClick={() => { 
                                                                                                                            setChamadoParaEditar(chamado);          // 👈 Adicionado
                                                                                                                            setSomenteVisualizar(true);             // ativa modo visualização
                                                                                                                            setOpenDetalhes(true);
                                     } }className='bg-yellow-300 p-1 rounded text-white'>Visualizar</button></td>
                                    <td className="text-black px-2 py-2 border-b text-center"><button onClick={() => handleDeleteClick(chamado)} className='bg-red-600 p-1 rounded text-white'>Excluir</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
           </div>
            <NovoChamado 
                 tipo={tipo}
                 isOpenDetalhes={open_detalhes} 
                 setOpenDetalhes={setOpenDetalhes}
                 chamadoParaEditar={chamadoParaEditar}
                 setChamadoParaEditar={setChamadoParaEditar}
                 somenteVisualizar = {somenteVisualizar}
                 setSomenteVisualizar = {setSomenteVisualizar}
                 onSaveSuccess={fetchChamados}
                 ></NovoChamado>
        </div>
       
    );
    } else {
        return;
    }
}