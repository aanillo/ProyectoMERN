import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navegacion from './components/Navegacion';
import CrearUsuario from './components/CrearUsuario'; 
import ListaUsuarios from './components/ListaUsuarios';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route 
        path="/*" 
        element={
          <PrivateRoute>
            <div>
              <Navegacion />
              <div className='container p-4'>
                <Routes>
                  <Route path="/ListaUsuarios" element={<ListaUsuarios />} />
                  <Route path="/CrearUsuario" element={<CrearUsuario />} /> {/* Ruta para crear usuario */}
                  <Route path="/edit/:id" element={<CrearUsuario />} /> {/* Ruta para editar usuario */}
                </Routes>
              </div>
            </div>
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

export default App;
