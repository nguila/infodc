
CREATE TABLE public.servicos_imagens (
  id TEXT PRIMARY KEY,
  imagem_url TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.servicos_imagens ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view
CREATE POLICY "Authenticated users can view servicos_imagens"
  ON public.servicos_imagens FOR SELECT
  TO authenticated
  USING (true);

-- Admins and gestors can manage
CREATE POLICY "Admins and gestors can manage servicos_imagens"
  ON public.servicos_imagens FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role));

-- Seed default rows
INSERT INTO public.servicos_imagens (id) VALUES ('bi'), ('iot'), ('consultoria'), ('formacao');
