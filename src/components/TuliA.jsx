import React from 'react';
import './TuliA.css'; // <-- Importamos los estilos de TuliA

export default function TuliA({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="tulia-wrapper">
      
      {/* Cabecera */}
      <div className="tulia-header">
        <div className="tulia-header-info">
          <div className="tulia-avatar">
            T
          </div>
          <div>
            <h3 className="tulia-title">TuliA</h3>
            <p className="tulia-subtitle">Asistente Virtual</p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="tulia-close-btn"
        >
          ✕
        </button>
      </div>

      {/* Cuerpo del Chat */}
      <div className="tulia-chat-body">
        
        {/* Mensaje de TuliA (Bot) */}
        <div className="tulia-msg-wrapper tulia-msg-bot-wrapper">
          <div className="tulia-msg-bubble tulia-msg-bot">
            ¡Hola! Soy TuliA 🌴. ¿En qué puedo ayudarte a descubrir la magia de Colima hoy?
          </div>
          <span className="tulia-timestamp tulia-timestamp-bot">12:00 PM</span>
        </div>

        {/* Mensaje del Usuario */}
        <div className="tulia-msg-wrapper tulia-msg-user-wrapper">
          <div className="tulia-msg-bubble tulia-msg-user">
            ¿Donde puedo encontrar la seccion de restaurantes?
          </div>
          <span className="tulia-timestamp tulia-timestamp-user">12:01 PM</span>
        </div>

      </div>

      {/* Área de Input */}
      <div className="tulia-input-area">
        <input 
          type="text" 
          placeholder="Escribe tu duda aquí..." 
          className="tulia-input"
        />
        <button className="tulia-send-btn">
          ➤
        </button>
      </div>

    </div>
  );
}