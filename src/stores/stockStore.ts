import { useState, useCallback } from "react";

export interface Produto {
  id: number;
  nome: string;
  tipologia: string;
  localizacao: string;
  stockAtual: number;
  stockMinimo: number;
}

export interface Tipologia {
  id: number;
  nome: string;
  descricao: string;
}

export interface Localizacao {
  id: number;
  nome: string;
  descricao: string;
}

export interface Movimento {
  id: number;
  produtoId: number;
  produtoNome: string;
  tipo: "levantamento" | "devolucao";
  quantidade: number;
  data: string;
  responsavel: string;
  evento: string;
}

export interface PedidoProduto {
  produtoId: number;
  produtoNome: string;
  quantidade: number;
}

export interface Pedido {
  id: number;
  numero: string;
  dataPedido: string;
  nomeRequisitante: string;
  email: string;
  origem: string;
  destino: string;
  descricaoDestino: string;
  tipoEvento: string;
  nomeEvento: string;
  dataEvento: string;
  dataRecolha: string;
  responsavelLevantamento: string;
  prioridade: "Baixa" | "Média" | "Alta" | "Urgente";
  observacoes: string;
  produtos: PedidoProduto[];
  estado: "Pendente" | "Aprovado" | "Em Preparação" | "Entregue" | "Concluído" | "Cancelado";
  criadoEm: string;
}

export interface PedidoLevantamento {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidadeLevantada: number;
  quantidadeDevolvida: number;
  consumoReal: number;
  responsavel: string;
  evento: string;
  data: string;
  estado: "Ativo" | "Concluído";
}

export interface ProdutoDevolucaoDoc {
  produtoId: number;
  produtoNome: string;
  quantidade: number;
}

export interface DocumentoDevolucao {
  id: number;
  nome: string;
  nomeEvento: string;
  dataEntrega: string;
  responsavel: string;
  produtos: ProdutoDevolucaoDoc[];
  observacoes: string;
}

const DEFAULT_STOCK_MINIMO = 40;

const produtosIniciais: Produto[] = [
  { id: 1, nome: "Caneta Data CoLAB", tipologia: "Escritório", localizacao: "Sede", stockAtual: 150, stockMinimo: 40 },
  { id: 2, nome: "Bloco de Notas A5", tipologia: "Escritório", localizacao: "Sede", stockAtual: 45, stockMinimo: 40 },
  { id: 3, nome: "Mochila Corporativa", tipologia: "Vestuário", localizacao: "Armazém", stockAtual: 12, stockMinimo: 40 },
  { id: 4, nome: "T-Shirt Data CoLAB", tipologia: "Vestuário", localizacao: "Armazém", stockAtual: 0, stockMinimo: 40 },
  { id: 5, nome: "Garrafa Termos", tipologia: "Lifestyle", localizacao: "Sede", stockAtual: 25, stockMinimo: 40 },
  { id: 6, nome: "Pen USB 32GB", tipologia: "Tecnologia", localizacao: "Sede", stockAtual: 8, stockMinimo: 40 },
  { id: 7, nome: "Tote Bag", tipologia: "Lifestyle", localizacao: "Armazém", stockAtual: 0, stockMinimo: 40 },
  { id: 8, nome: "Calendário 2025", tipologia: "Escritório", localizacao: "Sede", stockAtual: 60, stockMinimo: 40 },
];

const tipologiasIniciais: Tipologia[] = [
  { id: 1, nome: "Escritório", descricao: "Material de escritório e papelaria" },
  { id: 2, nome: "Vestuário", descricao: "Roupa e acessórios corporativos" },
  { id: 3, nome: "Lifestyle", descricao: "Artigos de lifestyle e bem-estar" },
  { id: 4, nome: "Tecnologia", descricao: "Gadgets e acessórios tecnológicos" },
];

const localizacoesIniciais: Localizacao[] = [
  { id: 1, nome: "Sede", descricao: "Escritório principal" },
  { id: 2, nome: "Armazém", descricao: "Armazém central de stock" },
];

// --- localStorage persistence ---
const STORAGE_KEY = "erp_stock_data";

interface StoreState {
  produtos: Produto[];
  tipologias: Tipologia[];
  localizacoes: Localizacao[];
  movimentos: Movimento[];
  pedidos: Pedido[];
  pedidosLevantamento: PedidoLevantamento[];
  documentosDevolucao: DocumentoDevolucao[];
  nextPedidoNumber: number;
}

function loadState(): StoreState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoreState;
      return parsed;
    }
  } catch { /* fallback to defaults */ }
  return {
    produtos: [...produtosIniciais],
    tipologias: [...tipologiasIniciais],
    localizacoes: [...localizacoesIniciais],
    movimentos: [],
    pedidos: [],
    pedidosLevantamento: [],
    documentosDevolucao: [],
    nextPedidoNumber: 1,
  };
}

function saveState() {
  const state: StoreState = {
    produtos: _produtos,
    tipologias: _tipologias,
    localizacoes: _localizacoes,
    movimentos: _movimentos,
    pedidos: _pedidos,
    pedidosLevantamento: _pedidosLevantamento,
    documentosDevolucao: _documentosDevolucao,
    nextPedidoNumber: _nextPedidoNumber,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Export for backup page
export function getFullBackup(): string {
  const stock = localStorage.getItem(STORAGE_KEY) || "{}";
  const users = localStorage.getItem("erp_users") || "[]";
  const backup = {
    version: 1,
    date: new Date().toISOString(),
    stock: JSON.parse(stock),
    users: JSON.parse(users),
  };
  return JSON.stringify(backup, null, 2);
}

export function restoreFromBackup(json: string): string | null {
  try {
    const data = JSON.parse(json);
    if (!data.version || !data.stock) return "Ficheiro de backup inválido.";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.stock));
    if (data.users) localStorage.setItem("erp_users", JSON.stringify(data.users));
    // Reload state
    const s = data.stock as StoreState;
    _produtos = s.produtos || [];
    _tipologias = s.tipologias || [];
    _localizacoes = s.localizacoes || [];
    _movimentos = s.movimentos || [];
    _pedidos = s.pedidos || [];
    _pedidosLevantamento = s.pedidosLevantamento || [];
    _documentosDevolucao = s.documentosDevolucao || [];
    _nextPedidoNumber = s.nextPedidoNumber || 1;
    notify();
    return null;
  } catch {
    return "Erro ao ler o ficheiro de backup.";
  }
}

const initial = loadState();
let _produtos: Produto[] = initial.produtos;
let _tipologias: Tipologia[] = initial.tipologias;
let _localizacoes: Localizacao[] = initial.localizacoes;
let _movimentos: Movimento[] = initial.movimentos;
let _pedidos: Pedido[] = initial.pedidos;
let _pedidosLevantamento: PedidoLevantamento[] = initial.pedidosLevantamento;
let _documentosDevolucao: DocumentoDevolucao[] = initial.documentosDevolucao;
let _nextPedidoNumber = initial.nextPedidoNumber;
let _listeners: (() => void)[] = [];

function notify() {
  saveState();
  _listeners.forEach((l) => l());
}

export function useStockStore() {
  const [, setTick] = useState(0);
  const rerender = useCallback(() => setTick((t) => t + 1), []);

  useState(() => {
    _listeners.push(rerender);
    return () => {
      _listeners = _listeners.filter((l) => l !== rerender);
    };
  });

  const produtos = _produtos;
  const tipologias = _tipologias;
  const localizacoes = _localizacoes;
  const movimentos = _movimentos;
  const pedidos = _pedidos;
  const pedidosLevantamento = _pedidosLevantamento;
  const documentosDevolucao = _documentosDevolucao;

  const getEstado = (p: Produto): "OK" | "Abaixo do mínimo" | "Esgotado" => {
    if (p.stockAtual === 0) return "Esgotado";
    if (p.stockAtual < p.stockMinimo) return "Abaixo do mínimo";
    return "OK";
  };

  const importarExcel = (file: File): Promise<void> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          if (!text) { resolve(); return; }
          const lines = text.split("\n").filter((l) => l.trim());
          if (lines.length < 2) { resolve(); return; }
          const headers = lines[0].split(/[,;\t]/).map((h) => h.trim().toLowerCase());
          const nomeIdx = headers.findIndex((h) => h.includes("nome") || h.includes("produto") || h.includes("product"));
          const tipoIdx = headers.findIndex((h) => h.includes("tipologia") || h.includes("tipo") || h.includes("type") || h.includes("categoria"));
          const stockIdx = headers.findIndex((h) => h.includes("quantidade") || h.includes("stock atual") || h.includes("qty") || h.includes("stock"));
          const minIdx = headers.findIndex((h) => h.includes("mínimo") || h.includes("minimo") || h.includes("min"));
          const locIdx = headers.findIndex((h) => h.includes("localização") || h.includes("localizacao") || h.includes("localiza") || h.includes("location"));
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(/[,;\t]/).map((c) => c.trim());
            const nome = nomeIdx >= 0 ? cols[nomeIdx] : "";
            if (!nome) continue;
            const tipologia = tipoIdx >= 0 ? cols[tipoIdx] || "Geral" : "Geral";
            const stockAtual = stockIdx >= 0 ? parseInt(cols[stockIdx]) || 0 : 0;
            const stockMinimo = minIdx >= 0 ? parseInt(cols[minIdx]) || DEFAULT_STOCK_MINIMO : DEFAULT_STOCK_MINIMO;
            const localizacao = locIdx >= 0 ? cols[locIdx] || "" : "";
            const existing = _produtos.find((p) => p.nome.toLowerCase() === nome.toLowerCase());
            if (existing) {
              existing.stockAtual = stockAtual;
              existing.tipologia = tipologia;
              if (localizacao) existing.localizacao = localizacao;
              if (minIdx >= 0) existing.stockMinimo = stockMinimo;
            } else {
              _produtos.push({ id: Date.now() + i, nome, tipologia, localizacao, stockAtual, stockMinimo });
            }
          }
          _produtos = [..._produtos];
          notify();
        } catch { /* silent */ }
        resolve();
      };
      reader.readAsText(file);
    });
  };

  const adicionarProduto = (nome: string, tipologia: string, localizacao: string, stockAtual: number, stockMinimo: number): string | null => {
    if (!nome.trim()) return "Nome do produto é obrigatório.";
    const existing = _produtos.find((p) => p.nome.toLowerCase() === nome.toLowerCase());
    if (existing) return `Produto "${nome}" já existe.`;
    _produtos = [..._produtos, { id: Date.now(), nome: nome.trim(), tipologia: tipologia || "Geral", localizacao: localizacao || "", stockAtual: stockAtual || 0, stockMinimo: stockMinimo || DEFAULT_STOCK_MINIMO }];
    notify();
    return null;
  };

  const editarProduto = (id: number, nome: string, tipologia: string, localizacao: string, stockAtual: number, stockMinimo: number) => {
    _produtos = _produtos.map((p) => p.id === id ? { ...p, nome: nome.trim(), tipologia, localizacao, stockAtual, stockMinimo } : p);
    notify();
  };

  const eliminarProduto = (id: number) => {
    _produtos = _produtos.filter((p) => p.id !== id);
    notify();
  };

  const getNextPedidoNumber = () => {
    return `PED-${String(_nextPedidoNumber).padStart(4, "0")}`;
  };

  const exportarTemplate = () => {
    const headers = ["Nome do Produto *", "Tipologia *", "Localização", "Quantidade / Stock Atual *", "Stock Mínimo"];
    const example = ["Exemplo Produto", "Escritório", "Sede", "100", "40"];
    const bom = "\uFEFF";
    const csv = [headers.join(";"), example.join(";"), ";;;; (apagar estas linhas de exemplo)"].join("\n");
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_produtos_stock.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Tipologias CRUD
  const adicionarTipologia = (nome: string, descricao: string): string | null => {
    if (!nome.trim()) return "Nome é obrigatório.";
    if (_tipologias.find((t) => t.nome.toLowerCase() === nome.toLowerCase())) return `Tipologia "${nome}" já existe.`;
    _tipologias = [..._tipologias, { id: Date.now(), nome: nome.trim(), descricao: descricao.trim() }];
    notify();
    return null;
  };
  const editarTipologia = (id: number, nome: string, descricao: string) => {
    _tipologias = _tipologias.map((t) => t.id === id ? { ...t, nome: nome.trim(), descricao: descricao.trim() } : t);
    notify();
  };
  const eliminarTipologia = (id: number) => {
    _tipologias = _tipologias.filter((t) => t.id !== id);
    notify();
  };

  // Localizações CRUD
  const adicionarLocalizacao = (nome: string, descricao: string): string | null => {
    if (!nome.trim()) return "Nome é obrigatório.";
    if (_localizacoes.find((l) => l.nome.toLowerCase() === nome.toLowerCase())) return `Localização "${nome}" já existe.`;
    _localizacoes = [..._localizacoes, { id: Date.now(), nome: nome.trim(), descricao: descricao.trim() }];
    notify();
    return null;
  };
  const editarLocalizacao = (id: number, nome: string, descricao: string) => {
    _localizacoes = _localizacoes.map((l) => l.id === id ? { ...l, nome: nome.trim(), descricao: descricao.trim() } : l);
    notify();
  };
  const eliminarLocalizacao = (id: number) => {
    _localizacoes = _localizacoes.filter((l) => l.id !== id);
    notify();
  };

  const criarPedido = (pedidoData: Omit<Pedido, "id" | "estado" | "criadoEm" | "numero">): string | null => {
    for (const pp of pedidoData.produtos) {
      const prod = _produtos.find((p) => p.id === pp.produtoId);
      if (!prod) return `Produto "${pp.produtoNome}" não encontrado.`;
      if (pp.quantidade > prod.stockAtual) return `Stock insuficiente para "${pp.produtoNome}" (disponível: ${prod.stockAtual}).`;
    }
    for (const pp of pedidoData.produtos) {
      const prod = _produtos.find((p) => p.id === pp.produtoId)!;
      prod.stockAtual -= pp.quantidade;
    }
    const numero = getNextPedidoNumber();
    _nextPedidoNumber++;
    const newPedido: Pedido = { ...pedidoData, id: Date.now(), numero, estado: "Pendente", criadoEm: new Date().toISOString() };
    _pedidos = [..._pedidos, newPedido];
    _produtos = [..._produtos];
    notify();
    return null;
  };

  const atualizarEstadoPedido = (pedidoId: number, estado: Pedido["estado"]) => {
    const pedido = _pedidos.find((p) => p.id === pedidoId);
    if (!pedido) return;
    if (estado === "Cancelado") {
      for (const pp of pedido.produtos) {
        const prod = _produtos.find((p) => p.id === pp.produtoId);
        if (prod) prod.stockAtual += pp.quantidade;
      }
      _produtos = [..._produtos];
    }
    pedido.estado = estado;
    _pedidos = [..._pedidos];
    notify();
  };

  const criarLevantamento = (produtoId: number, quantidade: number, responsavel: string, evento: string, data: string): string | null => {
    const produto = _produtos.find((p) => p.id === produtoId);
    if (!produto) return "Produto não encontrado";
    if (quantidade <= 0) return "Quantidade inválida";
    if (quantidade > produto.stockAtual) return "Stock insuficiente";
    produto.stockAtual -= quantidade;
    const pl: PedidoLevantamento = { id: Date.now(), produtoId, produtoNome: produto.nome, quantidadeLevantada: quantidade, quantidadeDevolvida: 0, consumoReal: quantidade, responsavel, evento, data, estado: "Ativo" };
    _pedidosLevantamento = [..._pedidosLevantamento, pl];
    _movimentos = [..._movimentos, { id: Date.now(), produtoId, produtoNome: produto.nome, tipo: "levantamento", quantidade, data, responsavel, evento }];
    _produtos = [..._produtos];
    notify();
    return null;
  };

  const registarDevolucao = (pedidoId: number, quantidadeDevolvida: number, dataDevolucao: string): string | null => {
    const pedido = _pedidosLevantamento.find((p) => p.id === pedidoId);
    if (!pedido) return "Pedido não encontrado";
    if (pedido.estado === "Concluído") return "Pedido já concluído";
    if (quantidadeDevolvida <= 0) return "Quantidade inválida";
    if (quantidadeDevolvida > (pedido.quantidadeLevantada - pedido.quantidadeDevolvida)) return "Quantidade superior ao levantado";
    pedido.quantidadeDevolvida += quantidadeDevolvida;
    pedido.consumoReal = pedido.quantidadeLevantada - pedido.quantidadeDevolvida;
    pedido.estado = "Concluído";
    const produto = _produtos.find((p) => p.id === pedido.produtoId);
    if (produto) produto.stockAtual += quantidadeDevolvida;
    _movimentos = [..._movimentos, { id: Date.now() + 1, produtoId: pedido.produtoId, produtoNome: pedido.produtoNome, tipo: "devolucao", quantidade: quantidadeDevolvida, data: dataDevolucao, responsavel: pedido.responsavel, evento: pedido.evento }];
    _pedidosLevantamento = [..._pedidosLevantamento];
    _produtos = [..._produtos];
    notify();
    return null;
  };

  const registarDocumentoDevolucao = (doc: Omit<DocumentoDevolucao, "id">): void => {
    const newDoc: DocumentoDevolucao = { ...doc, id: Date.now() };
    _documentosDevolucao = [newDoc, ..._documentosDevolucao];
    for (const pp of doc.produtos) {
      const produto = _produtos.find((p) => p.id === pp.produtoId);
      if (produto) produto.stockAtual += pp.quantidade;
      _movimentos = [..._movimentos, { id: Date.now() + pp.produtoId, produtoId: pp.produtoId, produtoNome: pp.produtoNome, tipo: "devolucao" as const, quantidade: pp.quantidade, data: doc.dataEntrega, responsavel: doc.responsavel, evento: doc.nomeEvento }];
    }
    _produtos = [..._produtos];
    notify();
  };

  return {
    produtos, tipologias, localizacoes, movimentos, pedidos, pedidosLevantamento, documentosDevolucao,
    getEstado, importarExcel, adicionarProduto, editarProduto, eliminarProduto, exportarTemplate, getNextPedidoNumber,
    criarPedido, atualizarEstadoPedido, criarLevantamento, registarDevolucao, registarDocumentoDevolucao,
    adicionarTipologia, editarTipologia, eliminarTipologia,
    adicionarLocalizacao, editarLocalizacao, eliminarLocalizacao,
    DEFAULT_STOCK_MINIMO,
  };
}
