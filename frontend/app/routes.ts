import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
    {
        path: "/",
        file: "routes/Login.tsx"
    },
    {
        path: "/dashboardCliente",
        file: "routes/DashboardCliente.tsx",
    },
    {
        path: "/reservar",
        file: "routes/ReservarCita.tsx"
    },
    {
        path: "/logout",
        file: "routes/Logout.tsx"
    },
    {
        path: "/dashboardEmpleado",
        file: "routes/DashboardEmpleado.tsx",
    },
    {
        path: "/agenda",
        file: "routes/DisponibilidadEmpleado.tsx",
    },
] satisfies RouteConfig;
