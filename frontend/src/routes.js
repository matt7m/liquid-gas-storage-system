import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import DataList from "./views/DataList";
import Tanks from "./views/Tanks";
import DataManagement from "./views/DataManagement";

const routes = [
    { path: "/dashboard", component: Dashboard },
    { path: "/login", component: Login },
    { path: "/docs", component: DataList },
    { path: "/tanks", component: Tanks },
    { path: "/docsAdmin", component: DataManagement },
];

export default routes;