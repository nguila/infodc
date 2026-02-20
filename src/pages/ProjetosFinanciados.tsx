import { useState } from "react";
import { Plus, Calendar, Users, Building2, Copy, CheckCircle2, X, Download, Link2, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  responsavel: string;
  investimentoTotal: string;
  linkUtil: string;
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
    responsavel: "Dr. Carlos Mendes",
    investimentoTotal: "€ 1.250.000",
    linkUtil: "",
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
    responsavel: "Maria Santos",
    investimentoTotal: "€ 890.000",
    linkUtil: "",
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

const NA = "Não aplicável";

const ProjetoDetalheModal = ({ projeto, onClose }: { projeto: Projeto; onClose: () => void }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10">
          <X className="w-4 h-4" />
        </button>
        <DialogHeader>
          <DialogTitle className="text-xl pr-6">{projeto.titulo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Resumo */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Resumo do Projeto</p>
            <p className="text-sm text-foreground">{projeto.descricao || NA}</p>
          </div>

          {/* Equipa */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Equipa / Colaboradores</p>
            {projeto.equipa.length > 0 ? (
              <div className="space-y-2">
                {projeto.equipa.map((m, i) => (
                  <div key={i} className="flex items-center justify-between bg-muted rounded-lg px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{m.nome}</p>
                      <p className="text-xs text-muted-foreground">{m.funcao} · {m.departamento}</p>
                    </div>
                    <Badge variant="outline">{m.alocacao}%</Badge>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">{NA}</p>}
          </div>

          {/* Parcerias */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Parcerias</p>
            {projeto.parcerias.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {projeto.parcerias.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{p.nome}</span>
                    <Badge className={`${tipoColors[p.tipo]} border-0 text-[10px]`}>{p.tipo}</Badge>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">{NA}</p>}
          </div>

          {/* Link útil */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Link Útil</p>
            {projeto.linkUtil ? (
              <Button variant="outline" size="sm" asChild className="gap-2">
                <a href={projeto.linkUtil} target="_blank" rel="noopener noreferrer">
                  <Link2 className="w-3.5 h-3.5" /> Abrir link
                </a>
              </Button>
            ) : <p className="text-sm text-muted-foreground">{NA}</p>}
          </div>

          {/* Download ficha */}
          <div className="pt-2 border-t border-border">
            <Button variant="outline" className="gap-2 w-full" disabled>
              <Download className="w-4 h-4" /> Descarregar ficha de projeto
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-1">{NA}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProjetosFinanciados = () => {
  const [projetos, setProjetos] = useState<Projeto[]>(projetosIniciais);
  const [showNew, setShowNew] = useState(false);
  const [selectedProjeto, setSelectedProjeto] = useState<Projeto | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const [form, setForm] = useState({
    titulo: "", descricao: "", codigo: "", programa: "", tipologia: "",
    dataInicio: "", dataFim: "", responsavel: "", investimentoTotal: "", linkUtil: "",
  });
  const [formParcerias, setFormParcerias] = useState<Parceiro[]>([{ nome: "", tipo: "Parceiro" }]);
  const [formEquipa, setFormEquipa] = useState<MembroEquipa[]>([{ nome: "", funcao: "", departamento: "", alocacao: 100 }]);

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
    setForm({ titulo: "", descricao: "", codigo: "", programa: "", tipologia: "", dataInicio: "", dataFim: "", responsavel: "", investimentoTotal: "", linkUtil: "" });
    setFormParcerias([{ nome: "", tipo: "Parceiro" }]);
    setFormEquipa([{ nome: "", funcao: "", departamento: "", alocacao: 100 }]);
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">Projetos Financiados</h1>
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
                  <Label>Responsável pelo Projeto</Label>
                  <Input value={form.responsavel} onChange={(e) => setForm({ ...form, responsavel: e.target.value })} placeholder="Nome do responsável" />
                </div>
                <div className="space-y-2">
                  <Label>Investimento Total</Label>
                  <Input value={form.investimentoTotal} onChange={(e) => setForm({ ...form, investimentoTotal: e.target.value })} placeholder="€ 0.000" />
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
                <div className="space-y-2">
                  <Label>Link Útil</Label>
                  <Input value={form.linkUtil} onChange={(e) => setForm({ ...form, linkUtil: e.target.value })} placeholder="https://..." />
                </div>
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
            <Card key={p.id} className="hover:shadow-lg hover:border-primary/20 transition-all group flex flex-col">
              <CardContent className="p-5 flex flex-col flex-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight flex-1 pr-2">
                    {p.titulo}
                  </h3>
                  <Badge variant="secondary" className="text-[10px] shrink-0">{p.tipologia || NA}</Badge>
                </div>

                {/* Responsável */}
                <div className="flex items-center gap-1.5 mb-3">
                  <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground">{p.responsavel || NA}</span>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 gap-2 mb-4 bg-muted/40 rounded-lg p-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">Programa</p>
                    <p className="text-xs font-medium truncate">{p.programa || NA}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">Código</p>
                    <div className="flex items-center gap-1.5">
                      <code className="text-[11px] font-mono text-foreground truncate flex-1">{p.codigo}</code>
                      <button
                        onClick={() => handleCopy(p.id, p.codigo)}
                        className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                      >
                        {copiedId === p.id ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">Investimento Total</p>
                    <p className="text-xs font-semibold text-primary">{p.investimentoTotal || NA}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-muted-foreground">Progresso</span>
                    <span className="text-[10px] font-semibold">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>

                {/* Dates */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{p.dataInicio || NA} → {p.dataFim || NA}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-auto w-full text-xs"
                  onClick={() => setSelectedProjeto(p)}
                >
                  Ver mais
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedProjeto && (
        <ProjetoDetalheModal projeto={selectedProjeto} onClose={() => setSelectedProjeto(null)} />
      )}
    </div>
  );
};

export default ProjetosFinanciados;
