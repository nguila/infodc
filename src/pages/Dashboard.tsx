import {
  Package,
  Wrench,
  Box,
  TrendingUp,
  Users,
  ClipboardList,
} from "lucide-react";

const stats = [
  { label: "Produtos", value: "1.248", icon: Package, change: "+12%" },
  { label: "Serviços", value: "64", icon: Wrench, change: "+3%" },
  { label: "Stock Total", value: "8.432", icon: Box, change: "-2%" },
  { label: "Pedidos Pendentes", value: "23", icon: ClipboardList, change: "+5" },
  { label: "Utilizadores", value: "156", icon: Users, change: "+8" },
  { label: "Receita Mensal", value: "€124.5k", icon: TrendingUp, change: "+18%" },
];

const Dashboard = () => {
  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão geral do sistema ERP
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-success">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Atividade Recente
          </h2>
          <div className="space-y-4">
            {[
              { text: "Novo pedido #1042 criado", time: "Há 5 min" },
              { text: "Stock atualizado — Categoria Eletrónicos", time: "Há 12 min" },
              { text: "Utilizador João Silva adicionado", time: "Há 1 hora" },
              { text: "Exportação de dados concluída", time: "Há 2 horas" },
              { text: "Novo produto adicionado ao catálogo", time: "Há 3 horas" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <span className="text-sm text-foreground">{item.text}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Pedidos Recentes
          </h2>
          <div className="space-y-3">
            {[
              { id: "#1042", status: "Pendente", client: "Empresa ABC", value: "€2.340" },
              { id: "#1041", status: "Em Progresso", client: "Tech Solutions", value: "€890" },
              { id: "#1040", status: "Concluído", client: "Global Corp", value: "€5.120" },
              { id: "#1039", status: "Concluído", client: "StartUp Lda", value: "€1.750" },
            ].map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-primary">
                    {order.id}
                  </span>
                  <span className="text-sm text-foreground">{order.client}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.status === "Concluído"
                        ? "bg-success/15 text-success"
                        : order.status === "Pendente"
                        ? "bg-warning/15 text-warning"
                        : "bg-primary/15 text-primary"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {order.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
