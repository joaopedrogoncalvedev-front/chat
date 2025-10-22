import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Importa os estilos do toast

type NotificationContextType = {
  connect: (userId: string | number) => void;
  disconnect: () => void;
  lastNotification: string | null;
};

export const NotificationContext = createContext<NotificationContextType>({
  connect: () => {},
  disconnect: () => {},
  lastNotification: null,
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null);
  const [lastNotification, setLastNotification] = useState<string | null>(null);
  

  const connect = (userId: string | number) => {
    if (wsRef.current || !userId) return;

    const ws = new WebSocket(`ws://192.168.11.149:8000/ws/notifications/${userId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket de notificações conectado");
    };

    ws.onmessage = (event) => {
      const payload = typeof event.data === "string" ? JSON.parse(event.data) : event.data;

// Atualiza estado
      setLastNotification(payload);
      
      // Exibe toast
      toast.info(payload.message, {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Som opcional
      const audio = new Audio("/sound/notification.mp3");
      audio.play().catch((err) => console.warn("Erro ao tocar som:", err));
     
    };

    ws.onclose = () => {
      console.warn("🔌 WebSocket de notificações foi fechado");
      wsRef.current = null;
    };

    ws.onerror = (err) => {
      console.error("❌ Erro no WebSocket:", err);
    };
  };

  const disconnect = () => {
    wsRef.current?.close();
    wsRef.current = null;
  };

  return (
    <NotificationContext.Provider value={{ connect, disconnect, lastNotification }}>
      {children}
      <ToastContainer /> {/* Renderiza o container dos toasts */}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
