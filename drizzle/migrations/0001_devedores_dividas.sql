ALTER TABLE public.vendas DROP CONSTRAINT vendas_forma_pagamento_check;
ALTER TABLE public.vendas ADD CONSTRAINT vendas_forma_pagamento_check CHECK (forma_pagamento IN ('Dinheiro','Pix','Cartão de Crédito','Cartão de Débito','Fiado'));

CREATE TABLE public.devedores(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, nome text NOT NULL, telefone text NOT NULL DEFAULT '', endereco text NOT NULL DEFAULT '', observacoes text NOT NULL DEFAULT '', criado_em timestamptz NOT NULL DEFAULT now());
GRANT SELECT,INSERT,UPDATE,DELETE ON public.devedores TO authenticated; GRANT ALL ON public.devedores TO service_role;
ALTER TABLE public.devedores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user debtors" ON public.devedores FOR ALL TO authenticated USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid());

CREATE TABLE public.dividas(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, devedor_id uuid NOT NULL REFERENCES public.devedores(id) ON DELETE CASCADE, descricao text NOT NULL DEFAULT '', valor_original numeric(12,2) NOT NULL CHECK (valor_original>0), saldo numeric(12,2) NOT NULL CHECK (saldo>=0), data_vencimento date NOT NULL, status text NOT NULL DEFAULT 'aberta', criado_em timestamptz NOT NULL DEFAULT now());
GRANT SELECT,INSERT,UPDATE,DELETE ON public.dividas TO authenticated; GRANT ALL ON public.dividas TO service_role;
ALTER TABLE public.dividas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user debts" ON public.dividas FOR ALL TO authenticated USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid() AND EXISTS(SELECT 1 FROM public.devedores d WHERE d.id=devedor_id AND d.user_id=auth.uid()));

CREATE TABLE public.pagamentos_dividas(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, divida_id uuid NOT NULL REFERENCES public.dividas(id) ON DELETE CASCADE, valor numeric(12,2) NOT NULL CHECK (valor>0), observacao text NOT NULL DEFAULT '', pago_em timestamptz NOT NULL DEFAULT now());
GRANT SELECT,INSERT,UPDATE,DELETE ON public.pagamentos_dividas TO authenticated; GRANT ALL ON public.pagamentos_dividas TO service_role;
ALTER TABLE public.pagamentos_dividas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user debt payments" ON public.pagamentos_dividas FOR ALL TO authenticated USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid());

CREATE OR REPLACE FUNCTION public.registrar_pagamento_divida(p_divida_id uuid, p_valor numeric, p_observacao text DEFAULT '')
RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE s numeric;
BEGIN
  SELECT saldo INTO s FROM public.dividas WHERE id=p_divida_id AND user_id=auth.uid() FOR UPDATE;
  IF s IS NULL THEN RAISE EXCEPTION 'Dívida não encontrada.'; END IF;
  IF p_valor<=0 OR p_valor>s THEN RAISE EXCEPTION 'Valor inválido.'; END IF;
  INSERT INTO public.pagamentos_dividas(user_id,divida_id,valor,observacao) VALUES(auth.uid(),p_divida_id,p_valor,coalesce(p_observacao,''));
  UPDATE public.dividas SET saldo=saldo-p_valor, status=CASE WHEN saldo-p_valor<=0 THEN 'quitada' ELSE 'aberta' END WHERE id=p_divida_id;
END $$;
GRANT EXECUTE ON FUNCTION public.registrar_pagamento_divida(uuid,numeric,text) TO authenticated;