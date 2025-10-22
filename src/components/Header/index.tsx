import { BiExit } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { Chamados } from '../../modals/Chamados';
import { useState } from 'react';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';
import { Users } from '../../modals/users';
import { usePrincipal } from '../../context/principal';

import { useNotification } from '../../context/websocket';

export function Header() {
    const [open,setOpen] = useState<boolean>(false);
    const [tipo, setTipo] = useState<number>(0);
    const [openUser,setOpenUser] = useState<boolean>(false);
    

    const user = localStorage.getItem("user_name_help");
    const navigate = useNavigate();
    const {disconnect} = useNotification();
    const { principalAbertoFechado, setPrincipalAbertoFechado } = usePrincipal();

    async function  hendleLogout(){
    
      const response = await axios.post('http://192.168.11.149:8000/login/', {
        username: user,
        status : 'N'
    });
       
  

      localStorage.removeItem("user_id_help");
      localStorage.removeItem("user_name_help");
      localStorage.removeItem("tipo_user");
      disconnect();

      navigate('/');

    }


  return (
    <header className="fixed flex justify-between  w-full  text-white shadow-md  " style={{backgroundColor: '#11151C'}}>
    
      <p className="ml-4 my-2.5">Usuário atual: {user}</p>
      <nav className="max-w-6xl px-4">
        <ul className="flex gap-6 justify-center text-sm sm:text-base font-semibold my-2.5">
        
          <li className="cursor-pointer hover:text-yellow-300 hover:scale-110 transition-colors" onClick={()=>{setOpen(!open); setTipo(1); setPrincipalAbertoFechado(true)}}>
            Chamados T.I
          </li>
          <li className="cursor-pointer hover:text-yellow-300 hover:scale-110 transition-colors" onClick={()=>{setOpen(!open); setTipo(2); setPrincipalAbertoFechado(true)}}>
            Chamados Assistência
          </li>
          <li className="cursor-pointer hover:text-yellow-300 hover:scale-110 transition-colors" onClick={()=>{setOpen(!open); setTipo(3); setPrincipalAbertoFechado(true)}}>
            Chamados Facilites
          </li>
          <li className="cursor-pointer hover:text-yellow-300 hover:scale-110 transition-colors"  onClick={()=>{setOpenUser(!openUser); setPrincipalAbertoFechado(true)}}>
           <FaUser size={25} />
          </li>
          <li className="cursor-pointer hover:text-yellow-300 hover:scale-110 transition-colors" onClick={hendleLogout}>
           <BiExit size={25} />
          </li>
        </ul>
      </nav>
      <Chamados isOpen={open}  tipo={tipo} setOpen={setOpen} setTipo={setTipo}/>
      <Users isOpen={openUser} setOpen={setOpenUser} />
    </header>
  );
}
