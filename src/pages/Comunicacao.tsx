import { MessageSquare, Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const pedidos = [
  { id: 1, titulo: "Design de brochura institucional", solicitante: "Ana Silva", data: "2025-01-15", estado: "Pendente", descricao: "Necessidade de brochura A4 para evento de março." },
  { id: 2, titulo: "Vídeo promocional DataLab", solicitante: "Carlos Mendes", data: "2025-01-12", estado: "Em Progresso", descricao: "Vídeo de 2 minutos para redes sociais sobre o projeto DataLab 4.0." },
  { id: 3, titulo: "Post LinkedIn — novo parceiro", solicitante: "Maria Santos", data: "2025-01-10", estado: "Concluído", descricao: "Publicação sobre a nova parceria com Fraunhofer Institute." },
  { id: 4, titulo: "Newsletter mensal janeiro", solicitante: "Rui Ferreira", data: "2025-01-08", estado: "Concluído", descricao: "Newsletter com resumo de atividades de janeiro." },
];

const estadoColors: Record<string, string> = {
  Pendente: "bg-amber-100 text-amber-700",
  "Em Progresso": "bg-blue-100 text-blue-700",
  Concluído: "bg-green-100 text-green-700",
};

const Comunicacao = () => (
  <div className="p-8 animate-fade-in">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-foreground">Pedidos de Comunicação</h1>
      <p className="text-sm text-muted-foreground mt-1">Solicitações à equipa de comunicação</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {pedidos.map((p) => (
        <Card key={p.id} className="hover:shadow-lg hover:border-primary/20 transition-all">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base font-semibold text-foreground">{p.titulo}</h3>
              <Badge className={`${estadoColors[p.estado]} text-[11px] border-0 shrink-0 ml-2`}>{p.estado}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{p.descricao}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{p.solicitante}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{p.data}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Comunicacao;
