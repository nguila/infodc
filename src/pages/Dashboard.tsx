import {
  Package, Wrench, Box, TrendingUp, Users, ClipboardList,
  FolderKanban, Megaphone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Produtos", value: "1.248", icon: Package, change: "+12%" },
  { label: "Serviços", value: "4", icon: Wrench, change: "Ativos" },
  { label: "Projetos Financiados", value: "8", icon: FolderKanban, change: "+2" },
  { label: "Stock Total", value: "8.432", icon: Box, change: "-2%" },
  { label: "Pedidos Pendentes", value: "23", icon: ClipboardList, change: "+5" },
  { label: "Utilizadores", value: "156", icon: Users, change: "+8" },
];

const Dashboard = () => {
  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão geral do sistema ERP — +INFO Data CoLAB
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md hover:border-primary/20 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-green-600">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { text: "Novo pedido #1042 criado", time: "Há 5 min" },
                { text: "Stock atualizado — Categoria Eletrónicos", time: "Há 12 min" },
                { text: "Utilizador João Silva adicionado", time: "Há 1 hora" },
                { text: "Exportação de dados concluída", time: "Há 2 horas" },
                { text: "Novo produto adicionado ao catálogo", time: "Há 3 horas" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{item.text}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: "#1042", status: "Pendente", client: "Empresa ABC", value: "€2.340" },
                { id: "#1041", status: "Em Progresso", client: "Tech Solutions", value: "€890" },
                { id: "#1040", status: "Concluído", client: "Global Corp", value: "€5.120" },
                { id: "#1039", status: "Concluído", client: "StartUp Lda", value: "€1.750" },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-primary">{order.id}</span>
                    <span className="text-sm text-foreground">{order.client}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`text-[11px] border-0 ${
                      order.status === "Concluído" ? "bg-green-100 text-green-700"
                        : order.status === "Pendente" ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>{order.status}</Badge>
                    <span className="text-sm font-medium text-foreground">{order.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
