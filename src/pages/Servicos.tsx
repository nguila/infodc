import { useState } from "react";
import { BarChart3, Cpu, Scale, GraduationCap, CheckCircle2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const servicos = [
  {
    id: "bi",
    titulo: "Análise de Dados & Business Intelligence",
    icon: BarChart3,
    cor: "bg-blue-500/10 text-blue-600",
    iconBg: "bg-blue-500",
    
    areas: [
      "Desenvolvimento de dashboards personalizados",
      "Implementação de data warehouses",
      "Serviços de ETL e integração de dados",
      "Análise preditiva e prescritiva",
      "Processamento de linguagem natural e sistemas de recomendação",
      "Análise de big data",
      "Desenvolvimento de modelos de machine learning",
      "Automação de relatórios",
    ],
  },
  {
    id: "iot",
    titulo: "Hardware & IoT",
    icon: Cpu,
    cor: "bg-emerald-500/10 text-emerald-600",
    iconBg: "bg-emerald-500",
    
    areas: [
      "Soluções de monitorização",
      "Sistemas de automação industrial",
      "Prototipagem de hardware",
      "Desenvolvimento de gateways IoT",
      "Soluções de edge computing",
      "Desenvolvimento de ambientes virtuais e digital twins",
    ],
  },
  {
    id: "consultoria",
    titulo: "Consultoria & Compliance",
    icon: Scale,
    cor: "bg-amber-500/10 text-amber-600",
    iconBg: "bg-amber-500",
    
    areas: [
      "Consultoria para aplicação de normativas (incl. ESG, RGPC)",
      "Consultoria em transformação digital e otimização de processos usando IA",
      "Consultoria em gestão de dados e governança",
      "Implementação de sistemas de rastreabilidade de produtos e garantia de autenticidade nas cadeias de valor",
    ],
  },
  {
    id: "formacao",
    titulo: "Formação & Capacitação",
    icon: GraduationCap,
    cor: "bg-purple-500/10 text-purple-600",
    iconBg: "bg-purple-500",
    
    areas: [
      "Desenvolvimento pessoal",
      "Gestão e administração",
      "Ciências Informáticas",
      "Informática na ótica do utilizador",
    ],
  },
];

const ServicoModal = ({ servico, onClose }: { servico: typeof servicos[0]; onClose: () => void }) => (
  <Dialog open onOpenChange={onClose}>
    <DialogContent className="max-w-lg">
      <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-4 mb-5">
        <div className={`flex items-center justify-center w-14 h-14 rounded-xl ${servico.cor}`}>
          <servico.icon className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-foreground leading-tight">{servico.titulo}</h2>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Áreas de Atuação</p>
        <ul className="space-y-2.5">
          {servico.areas.map((area, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-sm text-foreground">{area}</span>
            </li>
          ))}
        </ul>
      </div>
    </DialogContent>
  </Dialog>
);

const Servicos = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const servico = servicos.find((s) => s.id === selected);

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Serviços</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {servicos.map((s) => (
          <Card
            key={s.id}
            className="hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer group"
            onClick={() => setSelected(s.id)}
          >
            <CardContent className="p-8 flex flex-col items-center text-center gap-4">
              <div className={`flex items-center justify-center w-16 h-16 rounded-2xl ${s.cor} group-hover:scale-110 transition-transform duration-200`}>
                <s.icon className="w-8 h-8" />
              </div>
              <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                {s.titulo}
              </h2>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 pointer-events-none">
                Ver mais →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {servico && <ServicoModal servico={servico} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Servicos;
