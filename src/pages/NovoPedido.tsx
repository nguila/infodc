import { useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Plus, Trash2, CalendarIcon, Send, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const categoriasProdutos = ["Brindes", "Material Escritório", "Tecnologia", "Têxtil", "Decoração"];
const delegacoes = ["Lisboa", "Porto", "Coimbra", "Faro", "Braga", "Aveiro", "Setúbal"];
const tiposEvento = ["Conferência", "Workshop", "Feira", "Formação", "Evento Social", "Reunião Institucional", "Outro"];

const produtosPorCategoria: Record<string, { id: number; nome: string }[]> = {
  "Brindes": [
    { id: 7, nome: "Porta-chaves LED" },
    { id: 8, nome: "Garrafa Térmica" },
  ],
  "Material Escritório": [
    { id: 1, nome: "Caneta Personalizada" },
    { id: 5, nome: "Bloco de Notas A5" },
  ],
  "Tecnologia": [
    { id: 3, nome: "Pendrive 16GB" },
    { id: 6, nome: "Power Bank 5000mAh" },
    { id: 9, nome: "Mouse Pad Custom" },
  ],
  "Têxtil": [
    { id: 2, nome: "T-Shirt Evento" },
    { id: 4, nome: "Saco de Algodão" },
  ],
  "Decoração": [
    { id: 10, nome: "Roll-up Banner" },
    { id: 11, nome: "Toalha de Mesa Personalizada" },
  ],
};

interface ProdutoPedido {
  produtoId: number;
  nome: string;
  categoria: string;
  quantidade: number;
}

const NovoPedido = () => {
  const { toast } = useToast();
  const [nomeRequerente, setNomeRequerente] = useState("");
  const [delegacao, setDelegacao] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [dataEvento, setDataEvento] = useState<Date>();
  const [dataRecolha, setDataRecolha] = useState<Date>();
  const [destino, setDestino] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [produtosPedido, setProdutosPedido] = useState<ProdutoPedido[]>([]);

  const produtosDisponiveis = categoriaFiltro ? (produtosPorCategoria[categoriaFiltro] || []) : [];

  const adicionarProduto = () => {
    const prod = produtosDisponiveis.find((p) => p.id === Number(produtoSelecionado));
    if (!prod || quantidade < 1) return;
    const existing = produtosPedido.find((pp) => pp.produtoId === prod.id);
    if (existing) {
      setProdutosPedido((prev) =>
        prev.map((pp) => pp.produtoId === prod.id ? { ...pp, quantidade: pp.quantidade + quantidade } : pp)
      );
    } else {
      setProdutosPedido((prev) => [...prev, { produtoId: prod.id, nome: prod.nome, categoria: categoriaFiltro, quantidade }]);
    }
    setProdutoSelecionado("");
    setQuantidade(1);
  };

  const removerProduto = (produtoId: number) => {
    setProdutosPedido((prev) => prev.filter((pp) => pp.produtoId !== produtoId));
  };

  const limpar = () => {
    setNomeRequerente("");
    setDelegacao("");
    setTipoEvento("");
    setDataEvento(undefined);
    setDataRecolha(undefined);
    setDestino("");
    setObservacoes("");
    setCategoriaFiltro("");
    setProdutoSelecionado("");
    setQuantidade(1);
    setProdutosPedido([]);
  };

  const handleSubmit = () => {
    if (!nomeRequerente || !delegacao || !tipoEvento || !dataEvento || !destino || produtosPedido.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios e adicione pelo menos um produto.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Pedido submetido com sucesso!",
      description: `Pedido com ${produtosPedido.length} produto(s) registado.`,
    });
    limpar();
  };

  const totalItens = produtosPedido.reduce((sum, p) => sum + p.quantidade, 0);

  return (
    <div className="p-8 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Novo Pedido de Material</h1>
        <p className="text-sm text-muted-foreground mt-1">Preencha o formulário para requisitar brindes ou materiais para o seu evento.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal – Formulário */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dados do Requerente */}
          <section className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="text-base font-semibold text-foreground">Dados do Requerente</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Requerente <span className="text-destructive">*</span></Label>
                <Input value={nomeRequerente} onChange={(e) => setNomeRequerente(e.target.value)} placeholder="Nome completo" />
              </div>
              <div className="space-y-2">
                <Label>Delegação <span className="text-destructive">*</span></Label>
                <Select value={delegacao} onValueChange={setDelegacao}>
                  <SelectTrigger><SelectValue placeholder="Selecionar delegação" /></SelectTrigger>
                  <SelectContent>
                    {delegacoes.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Evento */}
          <section className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="text-base font-semibold text-foreground">Detalhes do Evento</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Evento <span className="text-destructive">*</span></Label>
                <Select value={tipoEvento} onValueChange={setTipoEvento}>
                  <SelectTrigger><SelectValue placeholder="Selecionar tipo" /></SelectTrigger>
                  <SelectContent>
                    {tiposEvento.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Destino <span className="text-destructive">*</span></Label>
                <Input value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Ex: Departamento de RH" />
              </div>
              <div className="space-y-2">
                <Label>Data do Evento <span className="text-destructive">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dataEvento && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataEvento ? format(dataEvento, "d 'de' MMMM, yyyy", { locale: pt }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dataEvento} onSelect={setDataEvento} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Data de Recolha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dataRecolha && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataRecolha ? format(dataRecolha, "d 'de' MMMM, yyyy", { locale: pt }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dataRecolha} onSelect={setDataRecolha} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </section>

          {/* Produtos */}
          <section className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="text-base font-semibold text-foreground">Produtos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div className="space-y-2">
                <Label>Categoria <span className="text-destructive">*</span></Label>
                <Select value={categoriaFiltro} onValueChange={(v) => { setCategoriaFiltro(v); setProdutoSelecionado(""); }}>
                  <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                  <SelectContent>
                    {categoriasProdutos.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Produto <span className="text-destructive">*</span></Label>
                <Select value={produtoSelecionado} onValueChange={setProdutoSelecionado} disabled={!categoriaFiltro}>
                  <SelectTrigger><SelectValue placeholder={categoriaFiltro ? "Selecionar produto" : "Escolha a categoria"} /></SelectTrigger>
                  <SelectContent>
                    {produtosDisponiveis.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantidade <span className="text-destructive">*</span></Label>
                <Input type="number" min={1} value={quantidade} onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value)))} />
              </div>
              <Button onClick={adicionarProduto} disabled={!produtoSelecionado} className="gap-2">
                <Plus className="w-4 h-4" /> Adicionar
              </Button>
            </div>

            {produtosPedido.length > 0 ? (
              <div className="rounded-lg border border-border overflow-hidden mt-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/40">
                      <TableHead>Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Qtd.</TableHead>
                      <TableHead className="text-right w-[60px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtosPedido.map((pp) => (
                      <TableRow key={pp.produtoId}>
                        <TableCell className="font-medium text-foreground">{pp.nome}</TableCell>
                        <TableCell className="text-muted-foreground">{pp.categoria}</TableCell>
                        <TableCell className="text-right text-foreground font-medium">{pp.quantidade}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => removerProduto(pp.produtoId)} className="h-8 w-8">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-lg mt-2">
                Nenhum produto adicionado ao pedido.
              </div>
            )}
          </section>

          {/* Observações */}
          <section className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="text-base font-semibold text-foreground">Observações</h2>
            <Textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
              placeholder="Informações adicionais sobre o pedido..."
            />
          </section>
        </div>

        {/* Coluna lateral – Resumo */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-6 sticky top-8 space-y-5">
            <h2 className="text-base font-semibold text-foreground">Resumo do Pedido</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Requerente</span>
                <span className="text-foreground font-medium truncate ml-2 max-w-[140px]">{nomeRequerente || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delegação</span>
                <span className="text-foreground font-medium">{delegacao || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Evento</span>
                <span className="text-foreground font-medium">{tipoEvento || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data Evento</span>
                <span className="text-foreground font-medium">{dataEvento ? format(dataEvento, "dd/MM/yyyy") : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Destino</span>
                <span className="text-foreground font-medium truncate ml-2 max-w-[140px]">{destino || "—"}</span>
              </div>

              <hr className="border-border" />

              <div className="flex justify-between">
                <span className="text-muted-foreground">Produtos</span>
                <span className="text-foreground font-semibold">{produtosPedido.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total de itens</span>
                <span className="text-foreground font-semibold">{totalItens}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Button onClick={handleSubmit} className="w-full gap-2">
                <Send className="w-4 h-4" /> Submeter Pedido
              </Button>
              <Button variant="outline" onClick={limpar} className="w-full gap-2">
                <RotateCcw className="w-4 h-4" /> Limpar
              </Button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Os materiais solicitados estão sujeitos a disponibilidade em stock. Após submissão, será notificado com a confirmação.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovoPedido;
