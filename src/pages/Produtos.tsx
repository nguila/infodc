import { useState } from "react";
import { Search, Filter, Users, Building2, Calendar, Link2, ChevronDown, ChevronUp, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const tags = ["Passaporte Digital de Produto", "Inteligência Artificial", "Capital Natural", "OCR", "Cidades Inteligentes", "Sustentabilidade", "Rastreabilidade"];

const estados: Record<string, { label: string; class: string }> = {
  ativo: { label: "Ativo", class: "bg-green-100 text-green-700" },
};

interface Produto {
  id: number;
  nome: string;
  resumo: string;
  descricao: string;
  tags: string[];
  estado: string;
  equipa: string[];
  cliente: string;
  parceiros: string[];
  dataInicio: string;
  dataFim: string;
  links: { label: string; url: string }[];
  imagemUrl: string;
  logoUrl: string;
}

const produtos: Produto[] = [
  {
    id: 1,
    nome: "MyDigiFile",
    resumo: "Processamento automático de faturas com OCR e Inteligência Artificial",
    descricao: "A plataforma MyDigiFile processa as suas faturas de forma automática através de tecnologias de Reconhecimento Óptico de Caracteres (OCR) e Inteligência Artificial (IA), de forma rápida e segura.",
    tags: ["OCR", "Inteligência Artificial"],
    estado: "ativo",
    equipa: [],
    cliente: "",
    parceiros: [],
    dataInicio: "",
    dataFim: "",
    links: [{ label: "Saber mais", url: "https://www.mydigifile.ai/pt" }],
    imagemUrl: "/images/mydigifile.png",
    logoUrl: "/images/mydigifile.png",
  },
  {
    id: 2,
    nome: "DPP – Passaporte Digital do Produto",
    resumo: "Sistema digital normalizado de identidade e rastreabilidade de produtos",
    descricao: "Um sistema digital normalizado que reúne, organiza e disponibiliza informação relevante sobre um produto ao longo de todo o seu ciclo de vida. Cada produto tem uma identidade digital única acessível por meio de identificadores como QR Code ou NFC.",
    tags: ["Passaporte Digital de Produto", "Rastreabilidade"],
    estado: "ativo",
    equipa: [],
    cliente: "",
    parceiros: [],
    dataInicio: "",
    dataFim: "",
    links: [{ label: "Saber mais", url: "https://www.datacolab.pt/project/dpp-digital-product-passport/" }],
    imagemUrl: "/images/dpp.png",
    logoUrl: "/images/dpp.png",
  },
  {
    id: 3,
    nome: "CIT – Centro de Inteligência Territorial",
    resumo: "Plataforma de Data as a Service para territórios inteligentes",
    descricao: "Uma plataforma que centraliza serviços de Data as a Service (DaaS), permitindo recolher, integrar, analisar, monitorizar e comunicar dados de várias fontes. Ajuda a promover transparência e suportar a tomada de decisão com base em dados, assim como a facilitar o acesso a informação relevante para os cidadãos sobre diferentes dimensões do território.",
    tags: ["Cidades Inteligentes"],
    estado: "ativo",
    equipa: [],
    cliente: "",
    parceiros: [],
    dataInicio: "",
    dataFim: "",
    links: [{ label: "Saber mais", url: "https://www.inteligenciaterritorial.pt/" }],
    imagemUrl: "/images/cit.png",
    logoUrl: "/images/cit.png",
  },
  {
    id: 4,
    nome: "NVP",
    resumo: "Medição e compreensão de impactos nos ecossistemas através da tecnologia",
    descricao: "Uma iniciativa resultado da colaboração entre a NBI – Natural Business Intelligence e o Data CoLAB, orientada para revolucionar a forma de medir e compreender impactos nos ecossistemas através da tecnologia.",
    tags: ["Capital Natural", "Sustentabilidade"],
    estado: "ativo",
    equipa: [],
    cliente: "",
    parceiros: ["NBI – Natural Business Intelligence"],
    dataInicio: "",
    dataFim: "",
    links: [{ label: "Saber mais", url: "https://www.nvp.pt/" }],
    imagemUrl: "/images/nvp.png",
    logoUrl: "/images/nvp.png",
  },
];

const NA = "Não aplicável";

const ProdutoModal = ({ produto, onClose }: { produto: Produto; onClose: () => void }) => {
  const est = estados[produto.estado];
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        {/* Banner */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <img src={produto.imagemUrl} alt={produto.nome} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-end gap-3">
            <img src={produto.logoUrl} alt="Logo" className="w-12 h-12 rounded-lg border-2 border-white object-cover shadow-lg" />
            <div>
              <h2 className="text-white font-bold text-xl leading-tight">{produto.nome}</h2>
              <Badge className={`${est.class} border-0 text-xs mt-1`}>{est.label}</Badge>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {produto.tags.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
          </div>

          {/* Descrição */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Descrição</p>
            <p className="text-sm text-foreground">{produto.descricao || NA}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Equipa */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Equipa</p>
              {produto.equipa.length > 0
                ? produto.equipa.map((m) => (
                  <div key={m} className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <Users className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm">{m}</span>
                  </div>
                ))
                : <p className="text-sm text-muted-foreground">{NA}</p>
              }
            </div>

            {/* Cliente */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Cliente</p>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{produto.cliente || NA}</span>
              </div>
            </div>

            {/* Datas */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Data de Início</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{produto.dataInicio || NA}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Data de Fim</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{produto.dataFim || NA}</span>
              </div>
            </div>
          </div>

          {/* Parceiros */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Parceiros / Entidades Beneficiárias</p>
            {produto.parceiros.length > 0
              ? <div className="flex flex-wrap gap-2">{produto.parceiros.map((p) => <Badge key={p} variant="outline">{p}</Badge>)}</div>
              : <p className="text-sm text-muted-foreground">{NA}</p>
            }
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Links Úteis</p>
            {produto.links.length > 0
              ? <div className="flex flex-wrap gap-2">
                {produto.links.map((l) => (
                  <Button key={l.label} variant="outline" size="sm" asChild className="gap-2">
                    <a href={l.url} target="_blank" rel="noopener noreferrer">
                      <Link2 className="w-3.5 h-3.5" />{l.label}
                    </a>
                  </Button>
                ))}
              </div>
              : <p className="text-sm text-muted-foreground">{NA}</p>
            }
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Produtos = () => {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);

  const toggleTag = (tag: string) => {
    if (tag === "all") { setSelectedTags([]); return; }
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const filtered = produtos.filter((p) => {
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase()) || p.resumo.toLowerCase().includes(search.toLowerCase());
    const matchTags = selectedTags.length === 0 || selectedTags.some((t) => p.tags.includes(t));
    return matchSearch && matchTags;
  });

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Produtos</h1>
        <p className="text-sm text-muted-foreground mt-1">Catálogo de produtos e soluções</p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Button
            variant={selectedTags.length === 0 ? "default" : "outline"}
            size="sm"
            onClick={() => toggleTag("all")}
            className="text-xs h-7"
          >
            Todos
          </Button>
          {tags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleTag(tag)}
              className="text-xs h-7"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p) => {
          const est = estados[p.estado];
          return (
            <Card key={p.id} className="hover:shadow-lg hover:border-primary/20 transition-all group overflow-hidden flex flex-col">
              {/* Banner image */}
              <div className="relative h-36 overflow-hidden">
                <img src={p.imagemUrl} alt={p.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <Badge className={`${est.class} border-0 text-[10px] absolute top-3 right-3`}>{est.label}</Badge>
                {/* Logo */}
                <img src={p.logoUrl} alt="logo" className="absolute bottom-3 left-3 w-9 h-9 rounded-md border border-white/80 object-cover shadow" />
              </div>

              <CardContent className="p-4 flex flex-col flex-1">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1 leading-tight">
                  {p.nome}
                </h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.resumo}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {p.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] font-normal">{tag}</Badge>
                  ))}
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3 h-3 shrink-0" />
                    <span className="truncate">{p.equipa.join(", ") || "Não aplicável"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3 h-3 shrink-0" />
                    <span className="truncate">{p.cliente || "Não aplicável"}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-auto w-full text-xs gap-1"
                  onClick={() => setSelectedProduto(p)}
                >
                  Ver mais <ChevronDown className="w-3 h-3" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>Nenhum produto encontrado com os filtros selecionados.</p>
        </div>
      )}

      {selectedProduto && (
        <ProdutoModal produto={selectedProduto} onClose={() => setSelectedProduto(null)} />
      )}
    </div>
  );
};

export default Produtos;
