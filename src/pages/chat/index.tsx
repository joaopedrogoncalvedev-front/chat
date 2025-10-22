import { useState } from 'react';
import { Messages } from '../../components/Messages';
import { ContatosComConversas } from '../../components/ContatosComConversas';
import { Header } from '../../components/Header';

export function Chat() {
  const [contatoSelecionado, setContatoSelecionado] = useState(null);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="shadow-md ">
        <Header />
      </div>

      {/* Container principal do chat */}
      <div className="flex flex-row flex-1 overflow-hidden">
        {/* Menu lateral de contatos */}
     
        <ContatosComConversas/>
        
        
        {/* Área de mensagens */}
        <div className="flex-1 overflow-y-auto ">
          <Messages />
        </div>
        
      </div>
    </div>
  );
}
