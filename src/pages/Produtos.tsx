import { useState } from "react";
import { Search, Filter, Users, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const tags = ["IA", "IoT", "Big Data", "Cloud", "Automação", "ESG", "Blockchain", "Edge Computing"];

const estados: Record<string, { label: string; class: string }> = {
  em_desenvolvimento: { label: "Em Desenvolvimento", class: "bg-blue-100 text-blue-700" },
  concluido: { label: "Concluído", class: "bg-green-100 text-green-700" },
  planeado: { label: "Planeado", class: "bg-amber-100 text-amber-700" },
  em_pausa: { label: "Em Pausa", class: "bg-gray-100 text-gray-600" },
};

const produtos = [
  { id: 1, nome: "Plataforma Analytics Pro", descricao: "Dashboard avançado de análise de dados em tempo real", tags: ["IA", "Big Data", "Cloud"], estado: "em_desenvolvimento", equipa: ["Ana Silva", "João Costa"], cliente: "Tech Solutions Lda" },
  { id: 2, nome: "Smart Factory Monitor", descricao: "Sistema de monitorização industrial com sensores IoT", tags: ["IoT", "Automação", "Edge Computing"], estado: "concluido", equipa: ["Pedro Martins", "Sara Lopes"], cliente: "IndustrialCorp" },
  { id: 3, nome: "ESG Compliance Tracker", descricao: "Plataforma de tracking e reporting de métricas ESG", tags: ["ESG", "Cloud"], estado: "planeado", equipa: ["Maria Santos"], cliente: "Green Energy SA" },
  { id: 4, nome: "DataFlow Engine", descricao: "Motor de ETL e integração de dados multi-source", tags: ["Big Data", "Cloud", "Automação"], estado: "em_desenvolvimento", equipa: ["Rui Ferreira", "Ana Silva"], cliente: "Banco Nacional" },
  { id: 5, nome: "Chain Verify", descricao: "Sistema de rastreabilidade e autenticidade na cadeia de valor", tags: ["Blockchain", "IoT"], estado: "em_pausa", equipa: ["João Costa"], cliente: "FoodTrace SA" },
  { id: 6, nome: "Edge AI Gateway", descricao: "Gateway inteligente para processamento edge com IA", tags: ["IA", "Edge Computing", "IoT"], estado: "em_desenvolvimento", equipa: ["Pedro Martins", "Sara Lopes", "Rui Ferreira"], cliente: "Telecom Plus" },
];

const Produtos = () => {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const filtered = produtos.filter((p) => {
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase()) || p.descricao.toLowerCase().includes(search.toLowerCase());
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
          {selectedTags.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])} className="text-xs h-7 text-muted-foreground">
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p) => {
          const est = estados[p.estado];
          return (
            <Card key={p.id} className="hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                    {p.nome}
                  </h3>
                  <Badge className={`${est.class} text-[11px] shrink-0 ml-2 border-0`}>{est.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{p.descricao}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[11px] font-normal">{tag}</Badge>
                  ))}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    <span>{p.equipa.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{p.cliente}</span>
                  </div>
                </div>
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
    </div>
  );
};

export default Produtos;
