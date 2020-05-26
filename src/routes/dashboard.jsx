// @material-ui/icons
import ViewList from "@material-ui/icons/ViewList";
import LoopIcon from "@material-ui/icons/Loop";
import DescriptionIcon from "@material-ui/icons/Description";
import PeopleIcon from "@material-ui/icons/People";
// import Unarchive from "@material-ui/icons/Unarchive";
// core components/views
import Products from "../views/Products";
// import ProductsMovements from "../views/Products/Moves";
import MoveByClient from "../views/Products/MoveByClient"
import Bill from "../views/Bill";
import Client from "../views/Client";
// import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.jsx";

const dashboardRoutes = [
  // {
  //   path: "/dashboard",
  //   sidebarName: "Dashboard",
  //   navbarName: "Material Dashboard",
  //   icon: Dashboard,
  //   component: DashboardPage
  // },
  // {
  //   path: "/user",
  //   sidebarName: "User Profile",
  //   navbarName: "Profile",
  //   icon: Person,
  //   component: UserProfile
  // },
  // {
  //   path: "/table",
  //   sidebarName: "Table List",
  //   navbarName: "Table List",
  //   icon: ContentPaste,
  //   component: TableList
  // },
  // {
  //   path: "/typography",
  //   sidebarName: "Typography",
  //   navbarName: "Typography",
  //   icon: LibraryBooks,
  //   component: Typography
  // },
  // {
  //   path: "/icons",
  //   sidebarName: "Icons",
  //   navbarName: "Icons",
  //   icon: BubbleChart,
  //   component: Icons
  // },
  // {
  //   path: "/maps",
  //   sidebarName: "Maps",
  //   navbarName: "Map",
  //   icon: LocationOn,
  //   component: Maps
  // },
  // {
  //   path: "/notifications",
  //   sidebarName: "Notifications",
  //   navbarName: "Notifications",
  //   icon: Notifications,
  //   component: NotificationsPage
  // },
  {
    path: "/products",
    sidebarName: "Productos",
    navbarName: "Lista de Productos",
    icon: ViewList,
    component: Products
  },
  {
    path: "/bills",
    sidebarName: "Facturas",
    navbarName: "Facturas",
    icon: DescriptionIcon,
    component: Bill
  },
  // {
  //   path: "/product-movements",
  //   sidebarName: "Movimientos",
  //   navbarName: "Movimientos de productos",
  //   icon: LoopIcon,
  //   component: ProductsMovements
  // },
  {
    path: "/movements-client",
    sidebarName: "Movimientos Clientes",
    navbarName: "Movimientos por clientes",
    icon: LoopIcon,
    component: MoveByClient
  },
  {
    path: "/client",
    sidebarName: "Clientes",
    navbarName: "Clientes",
    icon: PeopleIcon,
    component: Client
  },
  // {
  //   path: "/upgrade-to-pro",
  //   sidebarName: "Upgrade To PRO",
  //   navbarName: "Upgrade To PRO",
  //   icon: Unarchive,
  //   component: UpgradeToPro
  // },
  { redirect: true, path: "/", to: "/products", navbarName: "Redirect" }
];

export default dashboardRoutes;
