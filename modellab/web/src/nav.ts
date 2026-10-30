import { FlaskConical, GitCompareArrows, ListOrdered, Server, Trophy, Users } from "lucide-react";
import { useSession } from "./session";

export type NavEntry = { group: string; to: string; label: string; icon: typeof Trophy; hub?: boolean; admin?: boolean };

/** Pages in the sidebar (and ⌘K). `hub`: only on the hosted hub; `admin`: only for admins. */
export const NAV: NavEntry[] = [
  { group: "Build", to: "/", label: "New experiment", icon: FlaskConical },
  { group: "Run", to: "/queue", label: "Queue", icon: ListOrdered },
  { group: "Run", to: "/machines", label: "Machines", icon: Server, hub: true },
  { group: "Analyze", to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { group: "Analyze", to: "/compare", label: "Compare", icon: GitCompareArrows },
  { group: "Admin", to: "/team", label: "Team", icon: Users, hub: true, admin: true },
];

export function useNav(): NavEntry[] {
  const { hub, me } = useSession();
  return NAV.filter((n) => (!n.hub || hub) && (!n.admin || me?.user?.is_admin));
}
