import { useState } from "react";
import { BarChart3, Cpu, Scale, GraduationCap, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const servicos = [
  {
    id: "bi",
    titulo: "Análise de Dados & Business Intelligence",
    icon: BarChart3,
    cor: "bg-blue-500/10 text-blue-600",
    descricao: "Transformamos dados em decisões estratégicas com dashboards, modelos preditivos e automação.",
    itens: [
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
    descricao: "Soluções de monitorização, automação industrial e edge computing para a Indústria 4.0.",
    itens: [
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
    descricao: "Consultoria em normativas, transformação digital, governança de dados e rastreabilidade.",
    itens: [
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
    descricao: "Cursos especializados em desenvolvimento pessoal, gestão, ciências informáticas e mais.",
    itens: [
      "Desenvolvimento pessoal",
      "Gestão e administração",
      "Ciências Informáticas",
      "Informática na ótica do utilizador",
    ],
  },
];

const Servicos = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const servico = servicos.find((s) => s.id === selected);

  if (servico) {
    return (
      <div className="p-8 max-w-4xl mx-auto animate-fade-in">
        <Button variant="ghost" onClick={() => setSelected(null)} className="mb-6 gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Voltar aos Serviços
        </Button>

        <div className="flex items-center gap-4 mb-6">
          <div className={`flex items-center justify-center w-14 h-14 rounded-xl ${servico.cor}`}>
            <servico.icon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{servico.titulo}</h1>
            <p className="text-muted-foreground mt-1">{servico.descricao}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">O que inclui</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {servico.itens.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Serviços</h1>
        <p className="text-sm text-muted-foreground mt-1">Áreas de atuação do +INFO Data CoLAB</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {servicos.map((s) => (
          <Card
            key={s.id}
            className="hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer group"
            onClick={() => setSelected(s.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${s.cor}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {s.titulo}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{s.descricao}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {s.itens.slice(0, 3).map((item, i) => (
                  <Badge key={i} variant="secondary" className="text-xs font-normal">
                    {item.length > 30 ? item.slice(0, 30) + "…" : item}
                  </Badge>
                ))}
                {s.itens.length > 3 && (
                  <Badge variant="outline" className="text-xs">+{s.itens.length - 3}</Badge>
                )}
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                Ver mais
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Servicos;
