import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ExportarStock = () => {
  const { toast } = useToast();

  const handleExport = (format: string) => {
    toast({
      title: `Exportação ${format}`,
      description: `O ficheiro ${format} será gerado e descarregado em breve.`,
    });
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Exportar Stock</h1>
        <p className="text-sm text-muted-foreground mt-1">Exportar dados de stock em diferentes formatos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
        <Card className="hover:shadow-lg hover:border-primary/20 transition-all group">
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 text-green-600 group-hover:scale-110 transition-transform duration-200">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Exportar Excel</h3>
            <p className="text-sm text-muted-foreground">Descarregar inventário completo em formato .xlsx</p>
            <Button className="w-full gap-2" onClick={() => handleExport("Excel")}>
              <Download className="w-4 h-4" /> Descarregar Excel
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg hover:border-primary/20 transition-all group">
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 text-red-600 group-hover:scale-110 transition-transform duration-200">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Exportar PDF</h3>
            <p className="text-sm text-muted-foreground">Descarregar relatório de stock em formato .pdf</p>
            <Button className="w-full gap-2" onClick={() => handleExport("PDF")}>
              <Download className="w-4 h-4" /> Descarregar PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExportarStock;
