import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Package, Wrench, FolderKanban, Box, PlusCircle, Tags,
  ClipboardList, Users, Download, Upload, Megaphone, Newspaper,
  ChevronDown, ChevronRight, Info, Warehouse, MapPin, ShieldCheck,
  FileSpreadsheet, LogOut, LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { canSeeSidebarGroup } from "@/lib/permissions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MenuItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: { label: string; icon: React.ElementType; path: string }[];
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Produtos", icon: Package, path: "/produtos" },
  { label: "Serviços", icon: Wrench, path: "/servicos" },
  { label: "Projetos Financiados", icon: FolderKanban, path: "/projetos" },
  {
    label: "Stock",
    icon: Box,
    children: [
      { label: "Novo Pedido", icon: PlusCircle, path: "/stock/novo-pedido" },
      { label: "Produtos", icon: Package, path: "/stock/produtos" },
      { label: "Categorias", icon: Tags, path: "/stock/categorias" },
      { label: "Pedidos", icon: ClipboardList, path: "/stock/pedidos" },
      { label: "Delegações", icon: Users, path: "/stock/delegacoes" },
    ],
  },
  {
    label: "Armazém",
    icon: Warehouse,
    children: [
      { label: "Armazéns", icon: Warehouse, path: "/armazem" },
      { label: "Localizações", icon: MapPin, path: "/armazem/localizacoes" },
    ],
  },
  {
    label: "Comunicação",
    icon: Megaphone,
    children: [
      { label: "Pedidos", icon: ClipboardList, path: "/comunicacao/pedidos" },
      { label: "Notícias", icon: Newspaper, path: "/comunicacao/noticias" },
    ],
  },
  {
    label: "Administração",
    icon: ShieldCheck,
    children: [
      { label: "Permissões", icon: ShieldCheck, path: "/admin/permissoes" },
      { label: "Utilizadores", icon: Users, path: "/admin/utilizadores" },
    ],
  },
  {
    label: "Importar / Exportar",
    icon: FileSpreadsheet,
    children: [
      { label: "Importar", icon: Upload, path: "/import-export" },
      { label: "Exportar", icon: Download, path: "/import-export" },
    ],
  },
];

export function ERPSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [openGroups, setOpenGroups] = useState<string[]>(["Stock"]);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (item: MenuItem) =>
    item.children?.some((c) => location.pathname.startsWith(c.path)) ?? false;

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
          <Info className="w-5 h-5 text-primary" />
        </div>
        <div>
          <span className="text-sm font-semibold text-foreground">+ INFO</span>
          <p className="text-xs text-sidebar-muted">Data CoLAB</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
          Menu Principal
        </p>

        <ul className="space-y-0.5">
          {menuItems
            .filter((item) => (user ? canSeeSidebarGroup(user.perfil, item.label) : false))
            .map((item) => {
              // Direct link items (no children)
              if (item.path && !item.children) {
                return (
                  <li key={item.label}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.path)
                          ? "bg-sidebar-active/15 text-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-foreground"
                      )}
                    >
                      <item.icon className="w-[18px] h-[18px] shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              }

              // Group items with children
              const groupOpen = openGroups.includes(item.label);
              const groupActive = isGroupActive(item);

              return (
                <li key={item.label}>
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className={cn(
                      "flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      groupActive
                        ? "bg-sidebar-active/15 text-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-[18px] h-[18px] shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {groupOpen ? (
                      <ChevronDown className="w-4 h-4 text-sidebar-muted" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-sidebar-muted" />
                    )}
                  </button>

                  {groupOpen && item.children && (
                    <ul className="mt-0.5 ml-4 pl-4 border-l border-sidebar-border space-y-0.5 animate-fade-in">
                      {item.children.map((child) => (
                        <li key={child.path + child.label}>
                          <Link
                            to={child.path}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                              isActive(child.path)
                                ? "bg-primary/15 text-primary font-medium"
                                : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-foreground"
                            )}
                          >
                            <child.icon className="w-4 h-4 shrink-0" />
                            <span>{child.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
        </ul>
      </nav>

      {/* User footer */}
      {user && (
        <div className="border-t border-sidebar-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                {user.nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.nome}</p>
              <p className="text-xs text-sidebar-muted truncate">{user.cargo || user.perfil}</p>
            </div>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="text-sidebar-muted hover:text-destructive transition-colors"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
