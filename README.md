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
## Diagnóstico: "Failed to fetch" no cadastro local
Esse erro normalmente significa que o navegador não conseguiu alcançar a API do Supabase; não é, por si só, um erro de senha.
1. Confirme que o arquivo `.env` está na mesma pasta que `package.json`.
2. Preencha `VITE_SUPABASE_URL` com o Project URL real do Supabase e `VITE_SUPABASE_ANON_KEY` com a chave pública/anon do mesmo projeto. Não use os textos de exemplo de `.env.example` nem a chave `service_role`.
3. Em Authentication → URL Configuration, adicione a origem local exibida pelo Vite (por exemplo, `http://localhost:5173`) às URLs permitidas.
4. Confirme que o projeto Supabase está ativo e que o computador tem conexão com a internet.
5. Pare o Vite com Ctrl+C e execute novamente `npm run dev`; variáveis `VITE_*` são lidas ao iniciar o servidor.
6. Se persistir, abra as ferramentas do navegador (F12 → Console e Network), tente cadastrar e confira o erro da requisição ao domínio `*.supabase.co`. Nunca publique sua senha ou chave administrativa.
