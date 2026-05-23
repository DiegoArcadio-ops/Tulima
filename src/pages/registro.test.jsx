import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Registro from './Registro';

vi.mock('axios');

const renderConRouter = (componente) => {
  return render(<BrowserRouter>{componente}</BrowserRouter>);
};

describe('Pruebas en la página de <Registro />', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. Debe renderizar el formulario completo y permitir ingresar datos', () => {
    renderConRouter(<Registro />);

    const inputNombre = screen.getByPlaceholderText(/tu nombre/i);
    const inputUsuario = screen.getByPlaceholderText(/ej. usuario123/i);
    const inputPassword = screen.getByPlaceholderText(/crea una contraseña segura/i);
    const botonRegistro = screen.getByRole('button', { name: /registrarse/i });

    expect(inputNombre).toBeInTheDocument();
    expect(inputUsuario).toBeInTheDocument();
    expect(inputPassword).toBeInTheDocument();
    expect(botonRegistro).toBeInTheDocument();

    fireEvent.change(inputNombre, { target: { value: 'Alan Parra' } });
    fireEvent.change(inputUsuario, { target: { value: 'AlanParra08' } });
    fireEvent.change(inputPassword, { target: { value: 'MiClaveSegura123' } });

    expect(inputNombre.value).toBe('Alan Parra');
    expect(inputUsuario.value).toBe('AlanParra08');
  });

  it('2. Debe mostrar el mensaje de error del backend si el registro falla', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: 'El nombre de usuario ya está en uso' } }
    });

    renderConRouter(<Registro />);

    fireEvent.change(screen.getByPlaceholderText(/tu nombre/i), { target: { value: 'Alan' } });
    fireEvent.change(screen.getByPlaceholderText(/ej. usuario123/i), { target: { value: 'UsuarioRepetido' } });
    fireEvent.change(screen.getByPlaceholderText(/crea una contraseña segura/i), { target: { value: 'clave123' } });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    const mensajeError = await screen.findByText(/el nombre de usuario ya está en uso/i);
    expect(mensajeError).toBeInTheDocument();
  });

  it('3. Debe procesar un registro exitoso y mostrar mensaje de éxito', async () => {
    axios.post.mockResolvedValueOnce({ status: 201 });

    renderConRouter(<Registro />);

    fireEvent.change(screen.getByPlaceholderText(/tu nombre/i), { target: { value: 'Prueba Test' } });
    fireEvent.change(screen.getByPlaceholderText(/ej. usuario123/i), { target: { value: 'NuevoUsuario' } });
    fireEvent.change(screen.getByPlaceholderText(/crea una contraseña segura/i), { target: { value: 'clave123' } });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    const mensajeExito = await screen.findByText(/cuenta creada con éxito/i);
    expect(mensajeExito).toBeInTheDocument();

    expect(screen.queryByRole('alert', { name: /error/i })).not.toBeInTheDocument();
  });

});