import { useState, useCallback } from "react";

export interface Produto {
  id: number;
  nome: string;
  tipologia: string;
  stockAtual: number;
  stockMinimo: number;
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

export interface Pedido {
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

const DEFAULT_STOCK_MINIMO = 40;

const produtosIniciais: Produto[] = [
  { id: 1, nome: "Caneta Data CoLAB", tipologia: "Escritório", stockAtual: 150, stockMinimo: 40 },
  { id: 2, nome: "Bloco de Notas A5", tipologia: "Escritório", stockAtual: 45, stockMinimo: 40 },
  { id: 3, nome: "Mochila Corporativa", tipologia: "Vestuário", stockAtual: 12, stockMinimo: 40 },
  { id: 4, nome: "T-Shirt Data CoLAB", tipologia: "Vestuário", stockAtual: 0, stockMinimo: 40 },
  { id: 5, nome: "Garrafa Termos", tipologia: "Lifestyle", stockAtual: 25, stockMinimo: 40 },
  { id: 6, nome: "Pen USB 32GB", tipologia: "Tecnologia", stockAtual: 8, stockMinimo: 40 },
  { id: 7, nome: "Tote Bag", tipologia: "Lifestyle", stockAtual: 0, stockMinimo: 40 },
  { id: 8, nome: "Calendário 2025", tipologia: "Escritório", stockAtual: 60, stockMinimo: 40 },
];

// Simple global state (no external lib needed)
let _produtos: Produto[] = [...produtosIniciais];
let _movimentos: Movimento[] = [];
let _pedidos: Pedido[] = [];
let _listeners: (() => void)[] = [];

function notify() {
  _listeners.forEach((l) => l());
}

export function useStockStore() {
  const [, setTick] = useState(0);
  const rerender = useCallback(() => setTick((t) => t + 1), []);

  // Subscribe on mount
  useState(() => {
    _listeners.push(rerender);
    return () => {
      _listeners = _listeners.filter((l) => l !== rerender);
    };
  });

  const produtos = _produtos;
  const movimentos = _movimentos;
  const pedidos = _pedidos;

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
          // Parse CSV-like or use basic xlsx parsing
          // For now we parse CSV/text-based data
          const text = e.target?.result as string;
          if (!text) { resolve(); return; }
          
          const lines = text.split("\n").filter((l) => l.trim());
          if (lines.length < 2) { resolve(); return; }
          
          const headers = lines[0].split(/[,;\t]/).map((h) => h.trim().toLowerCase());
          const nomeIdx = headers.findIndex((h) => h.includes("nome") || h.includes("produto") || h.includes("product"));
          const tipoIdx = headers.findIndex((h) => h.includes("tipologia") || h.includes("tipo") || h.includes("type") || h.includes("categoria"));
          const stockIdx = headers.findIndex((h) => h.includes("quantidade") || h.includes("stock atual") || h.includes("qty") || h.includes("stock"));
          const minIdx = headers.findIndex((h) => h.includes("mínimo") || h.includes("minimo") || h.includes("min"));

          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(/[,;\t]/).map((c) => c.trim());
            const nome = nomeIdx >= 0 ? cols[nomeIdx] : "";
            if (!nome) continue;

            const tipologia = tipoIdx >= 0 ? cols[tipoIdx] || "Geral" : "Geral";
            const stockAtual = stockIdx >= 0 ? parseInt(cols[stockIdx]) || 0 : 0;
            const stockMinimo = minIdx >= 0 ? parseInt(cols[minIdx]) || DEFAULT_STOCK_MINIMO : DEFAULT_STOCK_MINIMO;

            const existing = _produtos.find((p) => p.nome.toLowerCase() === nome.toLowerCase());
            if (existing) {
              existing.stockAtual = stockAtual;
              existing.tipologia = tipologia;
              if (minIdx >= 0) existing.stockMinimo = stockMinimo;
            } else {
              _produtos.push({
                id: Date.now() + i,
                nome,
                tipologia,
                stockAtual,
                stockMinimo,
              });
            }
          }
          _produtos = [..._produtos];
          notify();
        } catch {
          // silent fail
        }
        resolve();
      };
      reader.readAsText(file);
    });
  };

  const criarLevantamento = (produtoId: number, quantidade: number, responsavel: string, evento: string, data: string): string | null => {
    const produto = _produtos.find((p) => p.id === produtoId);
    if (!produto) return "Produto não encontrado";
    if (quantidade <= 0) return "Quantidade inválida";
    if (quantidade > produto.stockAtual) return "Stock insuficiente";

    produto.stockAtual -= quantidade;
    
    const pedido: Pedido = {
      id: Date.now(),
      produtoId,
      produtoNome: produto.nome,
      quantidadeLevantada: quantidade,
      quantidadeDevolvida: 0,
      consumoReal: quantidade,
      responsavel,
      evento,
      data,
      estado: "Ativo",
    };
    _pedidos = [..._pedidos, pedido];

    _movimentos = [..._movimentos, {
      id: Date.now(),
      produtoId,
      produtoNome: produto.nome,
      tipo: "levantamento",
      quantidade,
      data,
      responsavel,
      evento,
    }];

    _produtos = [..._produtos];
    notify();
    return null;
  };

  const registarDevolucao = (pedidoId: number, quantidadeDevolvida: number, dataDevolucao: string): string | null => {
    const pedido = _pedidos.find((p) => p.id === pedidoId);
    if (!pedido) return "Pedido não encontrado";
    if (pedido.estado === "Concluído") return "Pedido já concluído";
    if (quantidadeDevolvida <= 0) return "Quantidade inválida";
    if (quantidadeDevolvida > (pedido.quantidadeLevantada - pedido.quantidadeDevolvida)) return "Quantidade superior ao levantado";

    pedido.quantidadeDevolvida += quantidadeDevolvida;
    pedido.consumoReal = pedido.quantidadeLevantada - pedido.quantidadeDevolvida;
    pedido.estado = "Concluído";

    const produto = _produtos.find((p) => p.id === pedido.produtoId);
    if (produto) produto.stockAtual += quantidadeDevolvida;

    _movimentos = [..._movimentos, {
      id: Date.now() + 1,
      produtoId: pedido.produtoId,
      produtoNome: pedido.produtoNome,
      tipo: "devolucao",
      quantidade: quantidadeDevolvida,
      data: dataDevolucao,
      responsavel: pedido.responsavel,
      evento: pedido.evento,
    }];

    _pedidos = [..._pedidos];
    _produtos = [..._produtos];
    notify();
    return null;
  };

  return {
    produtos,
    movimentos,
    pedidos,
    getEstado,
    importarExcel,
    criarLevantamento,
    registarDevolucao,
    DEFAULT_STOCK_MINIMO,
  };
}
