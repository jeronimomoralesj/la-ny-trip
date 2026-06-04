import {
  LayoutDashboard, CalendarRange, Map, Images, FolderLock, Wallet,
  LineChart, CloudSun, Plane, MessagesSquare, CheckSquare, FerrisWheel,
  Trophy, UtensilsCrossed, Bot, Vote, type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group: "Command" | "Operations" | "Finance" | "Squad";
}

export const NAV: NavItem[] = [
  { href: "/", label: "Mission Control", icon: LayoutDashboard, group: "Command" },
  { href: "/timeline", label: "Timeline", icon: CalendarRange, group: "Command" },
  { href: "/map", label: "Map", icon: Map, group: "Command" },
  { href: "/flights", label: "Flights", icon: Plane, group: "Operations" },
  { href: "/weather", label: "Weather", icon: CloudSun, group: "Operations" },
  { href: "/documents", label: "Documents", icon: FolderLock, group: "Operations" },
  { href: "/packing", label: "Packing", icon: CheckSquare, group: "Operations" },
  { href: "/expenses", label: "Expenses", icon: Wallet, group: "Finance" },
  { href: "/finance", label: "Finance Center", icon: LineChart, group: "Finance" },
  { href: "/photos", label: "Photo Vault", icon: Images, group: "Squad" },
  { href: "/feed", label: "Group Feed", icon: MessagesSquare, group: "Squad" },
  { href: "/parks", label: "Theme Parks", icon: FerrisWheel, group: "Squad" },
  { href: "/food", label: "Food Journal", icon: UtensilsCrossed, group: "Squad" },
  { href: "/analytics", label: "Analytics", icon: Trophy, group: "Squad" },
  { href: "/assistant", label: "AI Assistant", icon: Bot, group: "Squad" },
  { href: "/elections", label: "Election Hub", icon: Vote, group: "Squad" },
];

export const NAV_GROUPS: NavItem["group"][] = ["Command", "Operations", "Finance", "Squad"];
