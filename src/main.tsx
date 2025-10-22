import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './App';
import { RouterProvider } from 'react-router-dom';
import { NotificationProvider } from "./context/websocket";
import { PrincipalProvider } from './context/principal';
import { ContatoSelecionadoProvider } from './context/contatoSelecionado';
import { UserLogadoProvider } from './context/userLogado';
import { AbreContatosProvider } from './context/abrirContatos';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserLogadoProvider>
      <AbreContatosProvider>
    <ContatoSelecionadoProvider>
      <PrincipalProvider>
      <NotificationProvider>
         <RouterProvider router={router} ></RouterProvider>
      </NotificationProvider>
      </PrincipalProvider>
    </ContatoSelecionadoProvider>
    </AbreContatosProvider>
    </UserLogadoProvider>
  </StrictMode>,
)
