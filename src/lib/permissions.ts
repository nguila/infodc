export type Perfil = "Administrador" | "Gestor" | "Utilizador";

// Routes each profile can access
const routePermissions: Record<Perfil, string[]> = {
  Administrador: ["*"], // full access
  Gestor: [
    "/", "/produtos", "/produtos/categorias", "/servicos", "/projetos",
    "/stock/novo-pedido", "/stock/dashboard", "/stock/categorias", "/stock/pedidos", "/stock/utilizadores",
    "/armazem", "/armazem/localizacoes", "/import-export",
    "/comunicacao/pedidos", "/comunicacao/noticias",
  ],
  Utilizador: [
    "/", "/produtos", "/servicos", "/projetos",
    "/stock/novo-pedido", "/stock/dashboard", "/stock/pedidos",
    "/comunicacao/pedidos", "/comunicacao/noticias",
  ],
};

// Sidebar groups each profile can see
const sidebarPermissions: Record<Perfil, string[]> = {
  Administrador: ["*"],
  Gestor: ["Produtos", "Serviços", "Projetos Financiados", "Stock", "Armazém", "Importar / Exportar", "Comunicação"],
  Utilizador: ["Produtos", "Serviços", "Projetos Financiados", "Stock", "Comunicação"],
};

export function canAccessRoute(perfil: Perfil, path: string): boolean {
  const allowed = routePermissions[perfil];
  if (allowed.includes("*")) return true;
  return allowed.some((r) => path === r || path.startsWith(r + "/"));
}

export function canSeeSidebarGroup(perfil: Perfil, groupLabel: string): boolean {
  const allowed = sidebarPermissions[perfil];
  if (allowed.includes("*")) return true;
  return allowed.includes(groupLabel);
}
