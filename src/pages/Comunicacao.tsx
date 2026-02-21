import { FileText, Megaphone, FolderKanban, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const formularios = [
  {
    id: 1,
    titulo: "Requerimento de Pedidos de Comunicação",
    descricao: "Submissão de pedidos relacionados com ações de comunicação.",
    icon: Megaphone,
    url: "https://forms.office.com/Pages/ResponsePage.aspx?id=WjgSWLKyyEaD2WOOg1g5qNFSEvuXwzROiN58fyl-yUdUMEw2VVExNFRIUDRFM1RRVEM5SFYxUU1KNS4u",
  },
  {
    id: 2,
    titulo: "Formulário Briefing de Logo",
    descricao: "Pedido de criação ou desenvolvimento de logotipo.",
    icon: FileText,
    url: "https://forms.office.com/Pages/ResponsePage.aspx?id=WjgSWLKyyEaD2WOOg1g5qNFSEvuXwzROiN58fyl-yUdUME1LUFZRRUo1ODJYVERSMVkwSVlEVEhMWi4u",
  },
  {
    id: 3,
    titulo: "Comunicação de Projetos Financiados",
    descricao: "Submissão de informação para comunicação de projetos financiados.",
    icon: FolderKanban,
    url: "https://forms.office.com/Pages/ResponsePage.aspx?id=WjgSWLKyyEaD2WOOg1g5qNFSEvuXwzROiN58fyl-yUdUQU9QSlNORlI5TFdZNVhaS1I0MkxGQjVOWC4u",
  },
];

const Comunicacao = () => (
  <div className="p-8 animate-fade-in">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-foreground">Novos Pedidos</h1>
      <p className="text-sm text-muted-foreground mt-1">Acesso rápido a formulários de comunicação</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {formularios.map((f) => (
        <Card key={f.id} className="hover:shadow-lg hover:border-primary/20 transition-all group flex flex-col">
          <CardContent className="p-6 flex flex-col items-center text-center gap-4 flex-1">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-200">
              <f.icon className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-foreground leading-tight">{f.titulo}</h3>
            <p className="text-sm text-muted-foreground">{f.descricao}</p>
            <Button className="mt-auto gap-2 w-full" asChild>
              <a href={f.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" /> Aceder ao formulário
              </a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Comunicacao;
