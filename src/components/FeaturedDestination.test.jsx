import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FeaturedDestinations from './FeaturedDestinations';

global.fetch = vi.fn();

describe('Pruebas en <FeaturedDestinations />', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. Debe mostrar el estado de carga al montar el componente', () => {
    fetch.mockImplementation(() => new Promise(() => {}));

    render(<FeaturedDestinations />);
    
    expect(screen.getByText(/Cargando destinos.../i)).toBeInTheDocument();
  });

  it('2. Debe renderizar la lista de destinos cuando la API responde correctamente', async () => {
    const destinosFalsos = [
      {
        id_destino: 1,
        nombre: 'La Campana',
        imagen: 'https://ruta-falsa.com/imagen.jpg',
        categoria: { nombre: 'Lugar Turístico' },
        municipio: { nombre: 'Colima' },
        rese_a: { calificacion: '4.5', descripcion: 'Excelente lugar' },
        horarioAbierto: '09:00:00',
        horarioCerrado: '18:00:00'
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => destinosFalsos,
    });

    render(<FeaturedDestinations />);

    const tituloDestino = await screen.findByText('La Campana');
    expect(tituloDestino).toBeInTheDocument();

    expect(screen.getByText('Colima')).toBeInTheDocument();
  });

  it('3. Debe abrir el modal con los detalles al hacer clic en un destino', async () => {
    const destinosFalsos = [
      {
        id_destino: 1,
        nombre: 'La Campana',
        categoria: { nombre: 'Lugar Turístico' }
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => destinosFalsos,
    });

    render(<FeaturedDestinations />);

    const tarjetaDestino = await screen.findByText('La Campana');
    fireEvent.click(tarjetaDestino);

    const tituloModal = screen.getByRole('heading', { level: 2, name: 'La Campana' });
    const botonEnviarResena = screen.getByText('Enviar reseña');

    expect(tituloModal).toBeInTheDocument();
    expect(botonEnviarResena).toBeInTheDocument();
  });
});