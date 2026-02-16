import { ERPLayout } from "@/components/ERPLayout";

const Index = () => {
  return (
    <ERPLayout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Bem-vindo ao ERP</h1>
          <p className="text-muted-foreground">Selecione uma opção no menu lateral para começar.</p>
        </div>
      </div>
    </ERPLayout>
  );
};

export default Index;
