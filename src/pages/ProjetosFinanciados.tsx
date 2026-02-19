import { useState } from "react";
import { Plus, Calendar, Users, Building2, ArrowLeft, Copy, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Parceiro {
  nome: string;
  tipo: "Líder" | "Parceiro" | "Subcontratado";
}

interface MembroEquipa {
  nome: string;
  funcao: string;
  departamento: string;
  alocacao: number;
}

interface Projeto {
  id: number;
  titulo: string;
  descricao: string;
  codigo: string;
  programa: string;
  tipologia: string;
  dataInicio: string;
  dataFim: string;
  parcerias: Parceiro[];
  equipa: MembroEquipa[];
}

const projetosIniciais: Projeto[] = [
  {
    id: 1,
    titulo: "DataLab 4.0",
    descricao: "Desenvolvimento de infraestrutura laboratorial para análise avançada de dados industriais com foco em IA e IoT.",
    codigo: "POCI-01-0247-FEDER-045123",
    programa: "Portugal 2020",
    tipologia: "FEDER",
    dataInicio: "2024-01-15",
    dataFim: "2026-06-30",
    parcerias: [
      { nome: "+INFO Data CoLAB", tipo: "Líder" },
      { nome: "Universidade do Minho", tipo: "Parceiro" },
      { nome: "TechInov SA", tipo: "Subcontratado" },
    ],
    equipa: [
      { nome: "Dr. Carlos Mendes", funcao: "Coordenador", departamento: "Direção", alocacao: 40 },
      { nome: "Ana Silva", funcao: "Investigadora", departamento: "BI & Analytics", alocacao: 80 },
      { nome: "Pedro Martins", funcao: "Engenheiro IoT", departamento: "Hardware", alocacao: 60 },
    ],
  },
  {
    id: 2,
    titulo: "GreenChain AI",
    descricao: "Implementação de IA na cadeia de valor para monitorização ESG e rastreabilidade de produtos sustentáveis.",
    codigo: "HE-2024-DIGITAL-098765",
    programa: "Horizonte Europa",
    tipologia: "Horizonte Europa",
    dataInicio: "2025-03-01",
    dataFim: "2027-12-31",
    parcerias: [
      { nome: "+INFO Data CoLAB", tipo: "Parceiro" },
      { nome: "Fraunhofer Institute", tipo: "Líder" },
    ],
    equipa: [
      { nome: "Maria Santos", funcao: "Gestora de Projeto", departamento: "PMO", alocacao: 50 },
      { nome: "Rui Ferreira", funcao: "Data Engineer", departamento: "BI & Analytics", alocacao: 70 },
    ],
  },
];

function calcProgress(inicio: string, fim: string): number {
  const now = Date.now();
  const start = new Date(inicio).getTime();
  const end = new Date(fim).getTime();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}

const tipoColors: Record<string, string> = {
  "Líder": "bg-blue-100 text-blue-700",
  "Parceiro": "bg-green-100 text-green-700",
  "Subcontratado": "bg-amber-100 text-amber-700",
};

const ProjetosFinanciados = () => {
  const [projetos, setProjetos] = useState<Projeto[]>(projetosIniciais);
  const [selected, setSelected] = useState<Projeto | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [copied, setCopied] = useState(false);

  // New project form state
  const [form, setForm] = useState({
    titulo: "", descricao: "", codigo: "", programa: "", tipologia: "",
    dataInicio: "", dataFim: "",
  });
  const [formParcerias, setFormParcerias] = useState<Parceiro[]>([{ nome: "", tipo: "Parceiro" }]);
  const [formEquipa, setFormEquipa] = useState<MembroEquipa[]>([{ nome: "", funcao: "", departamento: "", alocacao: 100 }]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreate = () => {
    const novo: Projeto = {
      id: Date.now(),
      ...form,
      parcerias: formParcerias.filter((p) => p.nome.trim()),
      equipa: formEquipa.filter((m) => m.nome.trim()),
    };
    setProjetos([novo, ...projetos]);
    setShowNew(false);
    setForm({ titulo: "", descricao: "", codigo: "", programa: "", tipologia: "", dataInicio: "", dataFim: "" });
    setFormParcerias([{ nome: "", tipo: "Parceiro" }]);
    setFormEquipa([{ nome: "", funcao: "", departamento: "", alocacao: 100 }]);
  };

  // Detail view
  if (selected) {
    const progress = calcProgress(selected.dataInicio, selected.dataFim);
    return (
      <div className="p-8 max-w-4xl mx-auto animate-fade-in">
        <Button variant="ghost" onClick={() => setSelected(null)} className="mb-6 gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">{selected.titulo}</h1>
            <p className="text-muted-foreground mb-4">{selected.descricao}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Código de Projeto</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{selected.codigo}</code>
                  <button onClick={() => handleCopy(selected.codigo)} className="text-muted-foreground hover:text-primary">
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Programa</p>
                <p className="text-sm font-medium">{selected.programa} — {selected.tipologia}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Período</p>
                <p className="text-sm">{selected.dataInicio} → {selected.dataFim}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Progresso</p>
                <div className="flex items-center gap-3">
                  <Progress value={progress} className="h-2 flex-1" />
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">Parcerias</h3>
              <div className="flex flex-wrap gap-2">
                {selected.parcerias.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{p.nome}</span>
                    <Badge className={`${tipoColors[p.tipo]} text-[10px] border-0`}>{p.tipo}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Equipa</h3>
              <div className="space-y-2">
                {selected.equipa.map((m, i) => (
                  <div key={i} className="flex items-center justify-between bg-muted rounded-lg px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{m.nome}</p>
                      <p className="text-xs text-muted-foreground">{m.funcao} · {m.departamento}</p>
                    </div>
                    <Badge variant="outline">{m.alocacao}%</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projetos Financiados</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestão de projetos com financiamento externo</p>
        </div>
        <Dialog open={showNew} onOpenChange={setShowNew}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Novo Projeto</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Projeto Financiado</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Título *</Label>
                  <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Breve Descrição *</Label>
                  <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Código de Projeto *</Label>
                  <Input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} placeholder="POCI-01-..." />
                </div>
                <div className="space-y-2">
                  <Label>Programa de Financiamento *</Label>
                  <Input value={form.programa} onChange={(e) => setForm({ ...form, programa: e.target.value })} placeholder="Portugal 2020" />
                </div>
                <div className="space-y-2">
                  <Label>Tipologia</Label>
                  <Input value={form.tipologia} onChange={(e) => setForm({ ...form, tipologia: e.target.value })} placeholder="FEDER, Horizonte Europa..." />
                </div>
                <div />
                <div className="space-y-2">
                  <Label>Data de Início *</Label>
                  <Input type="date" value={form.dataInicio} onChange={(e) => setForm({ ...form, dataInicio: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Data de Fim *</Label>
                  <Input type="date" value={form.dataFim} onChange={(e) => setForm({ ...form, dataFim: e.target.value })} />
                </div>
              </div>

              {/* Parcerias */}
              <div>
                <Label className="mb-2 block">Parcerias</Label>
                {formParcerias.map((p, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input placeholder="Nome da entidade" value={p.nome} onChange={(e) => {
                      const copy = [...formParcerias]; copy[i] = { ...copy[i], nome: e.target.value }; setFormParcerias(copy);
                    }} />
                    <Select value={p.tipo} onValueChange={(v) => {
                      const copy = [...formParcerias]; copy[i] = { ...copy[i], tipo: v as Parceiro["tipo"] }; setFormParcerias(copy);
                    }}>
                      <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Líder">Líder</SelectItem>
                        <SelectItem value="Parceiro">Parceiro</SelectItem>
                        <SelectItem value="Subcontratado">Subcontratado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setFormParcerias([...formParcerias, { nome: "", tipo: "Parceiro" }])}>
                  + Adicionar parceiro
                </Button>
              </div>

              {/* Equipa */}
              <div>
                <Label className="mb-2 block">Equipa</Label>
                {formEquipa.map((m, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                    <Input placeholder="Nome" value={m.nome} onChange={(e) => {
                      const copy = [...formEquipa]; copy[i] = { ...copy[i], nome: e.target.value }; setFormEquipa(copy);
                    }} />
                    <Input placeholder="Função" value={m.funcao} onChange={(e) => {
                      const copy = [...formEquipa]; copy[i] = { ...copy[i], funcao: e.target.value }; setFormEquipa(copy);
                    }} />
                    <Input placeholder="Departamento" value={m.departamento} onChange={(e) => {
                      const copy = [...formEquipa]; copy[i] = { ...copy[i], departamento: e.target.value }; setFormEquipa(copy);
                    }} />
                    <Input type="number" placeholder="%" value={m.alocacao} onChange={(e) => {
                      const copy = [...formEquipa]; copy[i] = { ...copy[i], alocacao: Number(e.target.value) }; setFormEquipa(copy);
                    }} />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setFormEquipa([...formEquipa, { nome: "", funcao: "", departamento: "", alocacao: 100 }])}>
                  + Adicionar membro
                </Button>
              </div>

              <Button onClick={handleCreate} disabled={!form.titulo || !form.codigo || !form.dataInicio || !form.dataFim} className="w-full">
                Criar Projeto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projetos.map((p) => {
          const progress = calcProgress(p.dataInicio, p.dataFim);
          return (
            <Card key={p.id} className="hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer group" onClick={() => setSelected(p)}>
              <CardContent className="p-5">
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-2">{p.titulo}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{p.descricao}</p>

                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-[11px]">{p.tipologia}</Badge>
                  <code className="text-[11px] text-muted-foreground font-mono">{p.codigo.slice(0, 20)}…</code>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <Progress value={progress} className="h-1.5 flex-1" />
                  <span className="text-xs font-medium text-muted-foreground">{progress}%</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{p.dataInicio} → {p.dataFim}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProjetosFinanciados;
