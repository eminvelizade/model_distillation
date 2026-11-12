import { BookOpen, FlaskConical, GitCompareArrows, ListOrdered, MessagesSquare, Server, Trophy, Users, Wand2 } from "lucide-react";
import { useSession } from "./session";

export type NavEntry = { group: string; to: string; label: string; icon: typeof Trophy; hub?: boolean; admin?: boolean };

/** Pages in the sidebar (and ⌘K). `hub`: only on the hosted hub; `admin`: only for admins. */
export const NAV: NavEntry[] = [
  { group: "Team", to: "/chat", label: "Chat", icon: MessagesSquare, hub: true },
  { group: "Build", to: "/", label: "New experiment", icon: FlaskConical },
  { group: "Build", to: "/search", label: "Find best model", icon: Wand2, hub: true },
  { group: "Run", to: "/queue", label: "Queue", icon: ListOrdered },
  { group: "Run", to: "/machines", label: "Machines", icon: Server, hub: true },
  { group: "Analyze", to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { group: "Analyze", to: "/compare", label: "Compare", icon: GitCompareArrows },
  { group: "Analyze", to: "/notebook", label: "Notebook", icon: BookOpen, hub: true },
  { group: "Admin", to: "/team", label: "Team", icon: Users, hub: true, admin: true },
];

export function useNav(): NavEntry[] {
  const { hub, me } = useSession();
  return NAV.filter((n) => (!n.hub || hub) && (!n.admin || me?.user?.is_admin));
}
