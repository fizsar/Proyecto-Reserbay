import { NavLink } from 'react-router';

const Navbar = ({ rol }: { rol?: 'cliente' | 'personal' }) => {
  const baseLinkStyle = "px-3 py-2 rounded transition";
  const activeStyle = "bg-white text-green-700 font-semibold";
  const hoverStyle = "hover:bg-white hover:text-green-700";
  const logoutHoverStyle = "hover:bg-red-200 hover:text-red-700";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#1E7E34] dark:bg-[#1DE91D] text-white dark:text-black px-6 py-4 shadow-md flex justify-between items-center">
      <div className="text-lg font-bold">ReserBay</div>

      {/* Solo mostrar menú si hay rol */}
      {rol && (
        <div className="flex items-center gap-4">
          {rol === 'cliente' && (
            <>
              <NavLink
                to="/dashboardCliente"
                className={({ isActive }) =>
                  `${baseLinkStyle} ${isActive ? activeStyle : hoverStyle}`
                }
              >
                Inicio
              </NavLink>
              <NavLink
                to="/reservar"
                className={({ isActive }) =>
                  `${baseLinkStyle} ${isActive ? activeStyle : hoverStyle}`
                }
              >
                Reservar Cita
              </NavLink>
            </>
          )}
          {rol === 'personal' && (
            <>
              <NavLink
                to="/dashboardEmpleado"
                className={({ isActive }) =>
                  `${baseLinkStyle} ${isActive ? activeStyle : hoverStyle}`
                }
              >
                Panel
              </NavLink>
              <NavLink
                to="/agenda"
                className={({ isActive }) =>
                  `${baseLinkStyle} ${isActive ? activeStyle : hoverStyle}`
                }
              >
                Agenda
              </NavLink>
              <NavLink
                to="/NuevoServicio"
                className={({ isActive }) =>
                  `${baseLinkStyle} ${isActive ? activeStyle : hoverStyle}`
                }
              >
                Nuevo Servicio
              </NavLink>
              <NavLink
                to="/AltaEmpleado"
                className={({ isActive }) =>
                  `${baseLinkStyle} ${isActive ? activeStyle : hoverStyle}`
                }
              >
                Alta Empleado
              </NavLink>
            </>
          )}
          <NavLink
            to="/logout"
            className={() =>
              `${baseLinkStyle} ${logoutHoverStyle}`
            }
          >
            Cerrar sesión
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
