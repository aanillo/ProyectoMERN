import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post('https://proyectomern.onrender.com/api/usuarios/login', { correo, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token); 
        navigate('/ListaUsuarios'); 
      } else {
        alert('Token no recibido, error en la respuesta del servidor');
      }
    } catch (error) {
      alert('Error al iniciar sesión: ' + (error.response?.data?.message || 'Error desconocido'));
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div 
        className="card p-4 shadow-lg" 
        style={{ maxWidth: '400px', width: '100%', borderRadius: '15px', margin: '50px', backgroundColor: '#FFE07A' }}
      >
        
        {/* Logo */}
        <div className="text-center mb-3">
          <img 
            src="https://proyectomern.onrender.com/img/logo.png" 
            alt="Logo" 
            style={{ width: '120px', height: 'auto' }} 
          />
        </div>

        <h2 className="text-center mb-4" style={{ color: '#003366' }}>Iniciar Sesión</h2>

        <form onSubmit={iniciarSesion}>
          <div className="mb-3">
            <label className="form-label" style={{ color: '#003366', fontWeight: 'bold' }}>Correo:</label>
            <input
              type="email"
              className="form-control"
              placeholder="Ingresa tu correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: '#003366', fontWeight: 'bold' }}>Contraseña:</label>
            <input
              type="password"
              className="form-control"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn w-100" style={{ backgroundColor: '#003366', color: '#FFD700', fontWeight: 'bold' }}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
