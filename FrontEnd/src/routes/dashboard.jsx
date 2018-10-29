import Dashboard from "views/Dashboard/Dashboard.jsx";

var dashRoutes = [
    {
        path: "/dashboard",
        name: "Statistics CH",
        icon: "nc-icon nc-bank",
        component: Dashboard,
    },
    {redirect: true, path: "/", pathTo: "/dashboard", name: "Dashboard"}
];
export default dashRoutes;
