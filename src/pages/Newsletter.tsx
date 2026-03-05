import { FileText, Download, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NewsletterItem {
  id: number;
  titulo: string;
  data: string;
  descricao?: string;
  pdfUrl?: string;
}

const newsletters: NewsletterItem[] = [
  { id: 1, titulo: "Newsletter Dezembro 2024", data: "2024-12-31", descricao: "Balanço anual e destaques de 2024.", pdfUrl: "" },
  { id: 2, titulo: "Newsletter Outubro 2024", data: "2024-10-31", descricao: "Novas parcerias e formações.", pdfUrl: "" },
];

const Newsletter = () => (
  <div className="p-8 animate-fade-in">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-foreground">Newsletter</h1>
      <p className="text-sm text-muted-foreground mt-1">Biblioteca de newsletters em PDF</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {newsletters.map((n) => (
        <Card key={n.id} className="hover:shadow-lg hover:border-primary/20 transition-all group flex flex-col">
          <CardContent className="p-6 flex flex-col gap-3 flex-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10 text-red-600 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                  {n.titulo}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                  <Calendar className="w-3 h-3" />
                  <span>{n.data}</span>
                </div>
              </div>
            </div>

            {n.descricao && (
              <p className="text-sm text-muted-foreground">{n.descricao}</p>
            )}

            <div className="mt-auto pt-2">
              {n.pdfUrl ? (
                <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                  <a href={n.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4" /> Ver / Descarregar PDF
                  </a>
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="w-full gap-2" disabled>
                  <Download className="w-4 h-4" /> PDF não disponível
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Newsletter;
