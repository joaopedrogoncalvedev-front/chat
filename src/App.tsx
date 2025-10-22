import { createBrowserRouter } from "react-router-dom";
import { Login } from './pages/login';
import { Chat } from "./pages/chat";

import { Header } from "./components/Header";
import ProtectedRoute from "./components/protected";
import { Contatos } from "./components/Contatos";


const userId = localStorage.getItem("user_id_help");

const router = createBrowserRouter(
  [
    {
      path:'/',
      element: <Login/>
    },
    {
      path:'/chat/',
      element: <ProtectedRoute>
       
        <Chat/>
        
        </ProtectedRoute>
    },
      {
      path:'/header',
      element: <Header/>
    },{
    path:'/contatos',
    element: <Contatos/>
    }
  ]
)



export { router };
