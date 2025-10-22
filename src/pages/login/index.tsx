import { useState, type FormEvent } from 'react';
import './index.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/bee-hive.png';
import { useNotification } from '../../context/websocket';
import { useLogado } from '../../context/userLogado';

export function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erroLogin, setErroLogin] = useState(false);
  const navigate = useNavigate();
  const { connect } = useNotification();
  const { setUserLogado } = useLogado();


  async function handleLogar(e: FormEvent) {
    e.preventDefault();

    try {
      const response = await axios.post('http://192.168.11.149:8000/login/', {
        username: login,
        senha: senha,
        status: 'S',
      });

      const userId = response.data.id;
      const username = response.data.username;
      const userType = response.data.type;

      
      setUserLogado({ id: userId });

      // Armazena os dados do usuário localmente
      localStorage.setItem('user_id_help', userId);
      localStorage.setItem('user_name_help', username);
      localStorage.setItem('tipo_user', userType);

      // ✅ Agora o WebSocket será conectado automaticamente no `main.tsx` com NotificationProvider
      navigate('/chat');
      connect(userId);
      
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setErroLogin(true);
      } else {
        console.error('Erro inesperado:', error);
      }
    }
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-900">
      <img src={logo} alt="Hive Systems" className="w-40" />
      <h1 className="text-white text-2xl mb-8">Hive Systems - Help Desk</h1>

      <form onSubmit={handleLogar} className="flex flex-col gap-4 w-64">
        <div className="flex flex-col">
          <label htmlFor="user" className="text-white mb-1">Login</label>
          <input
            type="text"
            id="user"
            placeholder="Usuário"
            className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="text-white mb-1">Senha</label>
          <input
            type="password"
            id="password"
            placeholder="*******"
            className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Entrar
        </button>

        {erroLogin && (
          <p className="text-red-500 text-sm mt-2 text-center">
            Usuário ou Senha incorretos
          </p>
        )}
      </form>
    </div>
  );
}
