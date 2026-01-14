import {
  HomeIcon,
  LayoutDashboard,
  Store,
  LucideIcon,
  Box,
  Tag,
  Settings,
  Warehouse,
  ChartArea,
  MonitorCog,
  FolderTree,
  Barcode,
  Package,
  ShoppingCart,
  Users
} from "lucide-react";

export interface ISubMenuItem {
  name: string;
  path: string;
  icon?: LucideIcon;
}

export interface IMenuItems {
  name: string;
  path?: string;
  icon: LucideIcon;
  roles: ("SUPER_ADMIN" | "STORE_ADMIN")[];
  children?: ISubMenuItem[];
}

export const menuItems: IMenuItems[] = [
  {
    name: "Home",
    path: "/",
    icon: HomeIcon,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
  },
  {
    name: "Store Management",
    path: "/stores",
    icon: Store,
    roles: ["SUPER_ADMIN"],
    children: [
      {
        name: "Store List",
        path: "/stores",
        icon: Barcode,
      },
      {
        name: "Admin List",
        path: "/stores/admin-list",
        icon: Users,
      },
      {
        name: "Assign Store Admin",
        path: "/stores/store-admin",
        icon: FolderTree,
      },
    ],
  },
  {
    name: "Order Management",
    path: "/orders",
    icon: ShoppingCart,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
  },
  {
    name: "Product Management",
    path: "#",
    icon: Box,
    roles: ["SUPER_ADMIN"],
    children: [
      {
        name: "Product List",
        path: "/products",
        icon: Barcode,
      },
      {
        name: "Categories Management",
        path: "/products/categories",
        icon: FolderTree,
      },
    ],
  },
  {
    name: "Inventory Management",
    path: "/inventory",
    icon: Package,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
  },
  {
    name: "Discount Management",
    path: "/discounts",
    icon: Tag,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
  },
  {
    name: "Report",
    path: "/reports",
    icon: ChartArea,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
    children: [
      {
        name: "Stock Report",
        path: "/reports/stock",
        icon: ChartArea,
      },
    ],
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
  },
];
