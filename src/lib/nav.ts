import {
  LayoutDashboard, CalendarRange, Map, Images, FolderLock, Wallet,
  LineChart, CloudSun, Plane, MessagesSquare, CheckSquare, FerrisWheel,
  Trophy, UtensilsCrossed, Bot, Vote, Syringe, type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group: "Comando" | "Operaciones" | "Finanzas" | "Escuadrón";
}

export const NAV: NavItem[] = [
  { href: "/", label: "Centro de Mando", icon: LayoutDashboard, group: "Comando" },
  { href: "/timeline", label: "Cronograma", icon: CalendarRange, group: "Comando" },
  { href: "/map", label: "Mapa", icon: Map, group: "Comando" },
  { href: "/flights", label: "Vuelos", icon: Plane, group: "Operaciones" },
  { href: "/weather", label: "Clima", icon: CloudSun, group: "Operaciones" },
  { href: "/documents", label: "Documentos", icon: FolderLock, group: "Operaciones" },
  { href: "/packing", label: "Equipaje", icon: CheckSquare, group: "Operaciones" },
  { href: "/vaccines", label: "Vacunas", icon: Syringe, group: "Operaciones" },
  { href: "/expenses", label: "Gastos", icon: Wallet, group: "Finanzas" },
  { href: "/finance", label: "Centro Financiero", icon: LineChart, group: "Finanzas" },
  { href: "/photos", label: "Baúl de Fotos", icon: Images, group: "Escuadrón" },
  { href: "/feed", label: "Feed del Grupo", icon: MessagesSquare, group: "Escuadrón" },
  { href: "/parks", label: "Parques", icon: FerrisWheel, group: "Escuadrón" },
  { href: "/food", label: "Diario Gastronómico", icon: UtensilsCrossed, group: "Escuadrón" },
  { href: "/analytics", label: "Analíticas", icon: Trophy, group: "Escuadrón" },
  { href: "/assistant", label: "Asistente IA", icon: Bot, group: "Escuadrón" },
  { href: "/elections", label: "Elecciones", icon: Vote, group: "Escuadrón" },
];

export const NAV_GROUPS: NavItem["group"][] = ["Comando", "Operaciones", "Finanzas", "Escuadrón"];
