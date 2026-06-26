import React, { useState } from 'react';
import './Ayuda.css';

const secciones = [
  {
    id: 'que-es',
    titulo: '¿Qué es Tulima?',
    contenido: `Tulima es tu guía turística digital del estado de Colima, México. Te permite explorar destinos, restaurantes, hoteles, tours y eventos de los diferentes municipios de Colima, todo desde un solo lugar. Puedes descubrir lugares, guardar tus favoritos y planear tu viaje de manera fácil y rápida.`
  },
  {
    id: 'navegacion',
    titulo: 'Cómo navegar por el sitio',
    contenido: null,
    lista: [
      { titulo: 'Inicio', desc: 'La página principal donde encontrarás los destinos más destacados, un mapa interactivo de municipios y una introducción a Colima.' },
      { titulo: 'Municipios', desc: 'Accede al mapa interactivo para explorar los diferentes municipios del estado de Colima y sus atractivos.' },
      { titulo: 'Destinos', desc: 'Consulta los destinos turísticos disponibles en Colima con información de horarios y ubicación.' },
      { titulo: 'Restaurantes', desc: 'Encuentra restaurantes locales con tipo de cocina, horarios, teléfono y dirección.' },
      { titulo: 'Hoteles', desc: 'Explora opciones de hospedaje con disponibilidad, descripción y datos de contacto.' },
      { titulo: 'Tours', desc: 'Descubre proveedores de tours y experiencias con información de tipo de servicio y contacto.' },
      { titulo: 'Eventos', desc: 'Consulta los eventos disponibles con fechas de inicio y fin, tipo de evento y ubicación.' },
      { titulo: 'Sobre Colima', desc: 'Conoce más sobre el estado de Colima, su historia, cultura y datos de interés.' },
      { titulo: 'Contacto', desc: 'Información para ponerte en contacto con el equipo de Tulima.' },
    ]
  },
  {
    id: 'cuenta',
    titulo: 'Crear una cuenta',
    contenido: null,
    lista: [
      { titulo: 'Registro normal', desc: 'Haz clic en "Iniciar Sesión" en la parte superior derecha, luego en "Registrarse". Llena el formulario con tu nombre, correo y contraseña.' },
      { titulo: 'Registro con Google', desc: 'En la pantalla de inicio de sesión también puedes entrar directamente con tu cuenta de Google con un solo clic.' },
      { titulo: '¿Para qué necesito cuenta?', desc: 'Con una cuenta puedes guardar tus lugares favoritos (restaurantes, hoteles, tours y destinos) para consultarlos cuando quieras.' },
    ]
  },
  {
    id: 'favoritos',
    titulo: 'Guardar favoritos',
    contenido: `Para guardar un lugar como favorito debes tener sesión iniciada. En las páginas de Restaurantes, Hoteles, Tours y Destinos verás un ícono de corazón (♡) en cada tarjeta. Haz clic en él para agregarlo o quitarlo de tus favoritos. Los favoritos quedan guardados en tu cuenta para que puedas consultarlos cuando regreses.`
  },
  {
    id: 'tarjetas',
    titulo: 'Cómo ver el detalle de un lugar',
    contenido: `En cualquier sección (Restaurantes, Hoteles, Tours, Eventos, etc.) haz clic sobre la tarjeta del lugar que te interese. Se abrirá una ventana emergente (modal) con toda la información detallada: nombre, ubicación, horarios, teléfono, descripción y más. Para cerrarla haz clic en la "✕" o fuera del recuadro.`
  },
  {
    id: 'mapa',
    titulo: 'Usar el mapa interactivo',
    contenido: `En la página de inicio encontrarás un mapa interactivo de Colima. Puedes hacer clic en los diferentes municipios para ver su información y los atractivos turísticos que tienen disponibles. El mapa te ayuda a planear tu ruta de viaje de forma visual.`
  },
  {
    id: 'tulia',
    titulo: 'TuliA — Asistente virtual',
    contenido: `Tulima cuenta con TuliA, un asistente virtual que puede ayudarte a resolver dudas sobre los destinos, recomendarte lugares según tus preferencias y orientarte en el uso del sitio. Puedes abrirla desde el menú de navegación haciendo clic en "TuliA".`
  },
  {
    id: 'sesion',
    titulo: 'Iniciar y cerrar sesión',
    contenido: null,
    lista: [
      { titulo: 'Iniciar sesión', desc: 'Haz clic en el botón "Iniciar Sesión" en la parte superior derecha del sitio. Ingresa tu correo y contraseña, o entra con Google.' },
      { titulo: 'Cerrar sesión', desc: 'Cuando tengas sesión activa, verás tu nombre en la parte superior. Haz clic en el botón "Salir" que aparece a su lado.' },
      { titulo: 'Olvidé mi contraseña', desc: 'Si olvidaste tu contraseña, puedes registrarte nuevamente con Google o contactar al equipo de Tulima.' },
    ]
  },
  {
    id: 'problemas',
    titulo: 'Problemas frecuentes',
    contenido: null,
    lista: [
      { titulo: 'No carga la información', desc: 'Verifica tu conexión a internet. Si el problema persiste, intenta recargar la página.' },
      { titulo: 'No puedo agregar favoritos', desc: 'Asegúrate de haber iniciado sesión. El botón de favorito solo funciona con cuenta activa.' },
      { titulo: 'Las imágenes no aparecen', desc: 'Puede ser un problema temporal. Recarga la página o intenta más tarde.' },
      { titulo: 'No puedo iniciar sesión', desc: 'Verifica que tu correo y contraseña sean correctos. También puedes intentar entrar con Google.' },
    ]
  },
  {
    id: 'contacto',
    titulo: 'Contactar al equipo de Tulima',
    contenido: null,
    lista: [
      { titulo: 'Correo', desc: 'info@descubrecolima.mx' },
      { titulo: 'Teléfono', desc: '+52 312 123 4567' },
      { titulo: 'Ubicación', desc: 'Colima, Col., México' },
    ]
  },
];

export default function Ayuda() {
  const [abierto, setAbierto] = useState(null);

  const toggle = (id) => setAbierto(abierto === id ? null : id);

  return (
    <div className="ayuda-page">
      <div className="ayuda-hero">
        <h1 className="ayuda-hero-titulo">Centro de Ayuda</h1>
        <p className="ayuda-hero-desc">Todo lo que necesitas saber para usar Tulima y explorar Colima sin complicaciones.</p>
      </div>

      <div className="ayuda-container">
        {secciones.map((sec) => (
          <div key={sec.id} className={`ayuda-item ${abierto === sec.id ? 'abierto' : ''}`}>
            <button className="ayuda-pregunta" onClick={() => toggle(sec.id)}>
              <span>{sec.titulo}</span>
              <span className="ayuda-icono">{abierto === sec.id ? '−' : '+'}</span>
            </button>
            {abierto === sec.id && (
              <div className="ayuda-respuesta">
                {sec.contenido && <p>{sec.contenido}</p>}
                {sec.lista && (
                  <ul className="ayuda-lista">
                    {sec.lista.map((item, i) => (
                      <li key={i} className="ayuda-lista-item">
                        <strong>{item.titulo}:</strong> {item.desc}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}