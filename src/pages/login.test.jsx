import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Login from './Login'; 

vi.mock('axios');

const renderConRouter = (componente) => {
  return render(<BrowserRouter>{componente}</BrowserRouter>);
};

describe('Pruebas en la página de <Login />', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    axios.get.mockResolvedValue({ data: { csrfToken: 'token_falso_123' } });
  });

  it('1. Debe renderizar el formulario y permitir escribir en los campos', () => {
    renderConRouter(<Login />);
    
    const inputUsuario = screen.getByPlaceholderText(/nombre de usuario/i);
    const inputPassword = screen.getByPlaceholderText(/contraseña/i);
    const botonLogin = screen.getByRole('button', { name: /iniciar sesión/i });

    expect(inputUsuario).toBeInTheDocument();
    expect(inputPassword).toBeInTheDocument();
    expect(botonLogin).toBeInTheDocument();

    fireEvent.change(inputUsuario, { target: { value: 'AlanParra08' } });
    fireEvent.change(inputPassword, { target: { value: 'miclave123' } });

    expect(inputUsuario.value).toBe('AlanParra08');
    expect(inputPassword.value).toBe('miclave123');
  });

  it('2. Debe mostrar un mensaje de error si las credenciales son incorrectas', async () => {
    axios.post.mockRejectedValueOnce(new Error('Unauthorized'));

    renderConRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/nombre de usuario/i), { target: { value: 'AlanParra08' } });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { target: { value: 'claveEquivocada' } });

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    const mensajeError = await screen.findByText(/Credenciales inválidas/i);
    expect(mensajeError).toBeInTheDocument();
  });

  it('3. Debe procesar el login exitoso', async () => {
    axios.post.mockResolvedValueOnce({ status: 201, data: {} });

    renderConRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/nombre de usuario/i), { target: { value: 'AlanParra08' } });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { target: { value: 'claveCorrecta' } });

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
        expect(screen.queryByText(/Credenciales inválidas/i)).not.toBeInTheDocument();
    });
  });

});