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
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
  },
  {
    name: "Store Management",
    path: "/admin/stores",
    icon: Store,
    roles: ["SUPER_ADMIN"],
    children: [
      {
        name: "Store List",
        path: "/admin/stores",
        icon: Barcode,
      },
      {
        name: "Admin List",
        path: "/admin/stores/admin-list",
        icon: Users,
      },
      {
        name: "Assign Store Admin",
        path: "/admin/stores/store-admin",
        icon: FolderTree,
      },
    ],
  },
  {
    name: "Order Management",
    path: "/admin/orders",
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
        path: "/admin/products",
        icon: Barcode,
      },
      {
        name: "Categories Management",
        path: "/admin/products/categories",
        icon: FolderTree,
      },
    ],
  },
  {
    name: "Inventory Management",
    path: "/admin/inventory",
    icon: Package,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
  },
  {
    name: "Discount Management",
    path: "/admin/discounts",
    icon: Tag,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
  },
  {
    name: "Report",
    path: "/admin/reports",
    icon: ChartArea,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
    children: [
      {
        name: "Stock Report",
        path: "/admin/reports/stock",
        icon: ChartArea,
      },
    ],
  },
  {
    name: "Users Management",
    path: "/admin/users",
    icon: Users,
    roles: ["SUPER_ADMIN"],
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
    roles: ["SUPER_ADMIN", "STORE_ADMIN"],
  },
];
