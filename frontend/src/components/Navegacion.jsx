import React from 'react';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Imagen local
import logo from '../assets/logo.png';

const Navegacion = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#003366' }}>
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center w-auto" to="/ListaUsuarios" style={{ color: '#FFD700' }}>
            {/* Imagen del logo */}
            <img
              src={logo}
              alt="Cádiz CF"
              width="50"
              height="50"
              className="d-inline-block align-text-top"
            />
            {/* Texto con margen a la izquierda y sin cortar */}
            <span className="ms-2" style={{ whiteSpace: 'nowrap' }}>Cádiz CF</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/ListaUsuarios" style={{ color: '#FFD700' }}>
                  Lista de Socios
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/CrearUsuario" style={{ color: '#FFD700' }}>
                  Crear Socio
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navegacion;
