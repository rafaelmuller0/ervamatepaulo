# Gestão Erva Mate Paulo

Aplicação responsiva de gestão de produtos, estoque, vendas e relatórios com React, Vite, TanStack Router e Supabase Auth/PostgreSQL.

## Supabase
1. Crie um projeto em https://supabase.com.
2. No SQL Editor, execute todo o arquivo supabase/schema.sql.
3. Em Project Settings → API, copie Project URL e a chave pública/anon. Nunca use service_role no frontend.
4. Copie .env.example para .env e preencha as duas variáveis.
5. Em Authentication → URL Configuration, configure a URL local mostrada pelo terminal e adicione a URL de produção às Redirect URLs. Configure SMTP para envio de e-mails em produção.

## Rodar localmente
Requer Node.js compatível com Vite 8 (Node 20.19+ ou 22.12+).
```bash
npm install
npm run dev
```
Abra a URL exibida no terminal, cadastre uma conta e faça login. Em Produtos, use “8 exemplos” para popular o catálogo inicial.

## Vercel
1. Importe o repositório rafaelmuller0/ervamatepaulo em https://vercel.com.
2. Configure build command npm run build.
3. Cadastre VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nas variáveis de ambiente para todos os ambientes.
4. Faça o deploy e inclua o domínio final no Supabase Authentication → URL Configuration.

## Funcionalidades
- Login, cadastro, recuperação de senha e logout.
- Produtos CRUD, busca, filtro, margem, lucro unitário e alerta de estoque.
- Registro de vendas, histórico e trigger no banco para baixa/devolução de estoque.
- Dashboard com gráfico, resumo financeiro, relatórios CSV e impressão/PDF.
- Backup JSON, configurações e tema claro/escuro.
- RLS em todas as tabelas limita os dados ao usuário autenticado.
