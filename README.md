# Macua Hair

Loja virtual especializada em comercialização de cabelos naturais de alta qualidade.

## Tecnologias Utilizadas

- React
- TypeScript
- React Query
- React Router
- Prisma
- Framer Motion
- Tailwind CSS
- Shadcn/ui

## Funcionalidades

- Catálogo de produtos com filtros
- Carrinho de compras
- Sistema de autenticação
- Área administrativa
- Gerenciamento de pedidos
- Interface responsiva

## Requisitos

- Node.js 16+
- npm ou yarn
- PostgreSQL

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

## Configurando um Usuário Administrador

Para criar ou configurar um usuário administrador:

1. Primeiro, crie uma conta normal através do formulário de registro no site.

2. Configure as variáveis de ambiente em um arquivo `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico
ADMIN_USER_EMAIL=seu_email@exemplo.com
```

3. Execute o script de configuração de administrador:
```bash
node setup-admin.js
```

4. Agora você poderá acessar a área administrativa em `/admin`.

## Estrutura do Projeto

- `/app` - Componentes principais da aplicação
- `/components` - Componentes reutilizáveis
- `/client` - Código do cliente (API, utils)
- `/prisma` - Schema e migrações do banco de dados

## Resolução de Problemas

### Erro de Recursão Infinita na Política do Supabase

Se você encontrar o erro "infinite recursion detected in policy for relation profiles", siga estas etapas:

1. Aplique a migração SQL para criar a função de RPC segura:
   ```bash
   node apply-migration.js
   ```
   
   Você precisará configurar a variável de ambiente `SUPABASE_SERVICE_ROLE_KEY` para executar este script.

2. Ou acesse o SQL Editor no Supabase e execute:
   ```sql
   -- Create a function to safely get a user's role
   CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
   RETURNS TABLE (role TEXT) 
   SECURITY DEFINER
   SET search_path = public
   AS $$
   BEGIN
     RETURN QUERY
     SELECT p.role 
     FROM profiles p 
     WHERE p.id = user_id;
   END;
   $$ LANGUAGE plpgsql;
   ```

3. Verifique e corrija suas políticas de RLS para a tabela "profiles" no Supabase:
   - Remova políticas circulares que possam estar causando a recursão
   - Certifique-se de que as políticas não se referenciam em círculo

### Acesso à Área Administrativa

Se você não conseguir acessar a área administrativa:

1. Verifique se o seu usuário tem a função `admin` no Supabase:
   - Use o script `setup-admin.js` para configurar seu usuário como administrador
   - Ou configure manualmente através do dashboard do Supabase

2. Limpe os cookies e cache do navegador
3. Faça login novamente no site

## Licença

MIT 

# Nova Loja - Sistema de gerenciamento de loja

Este é um sistema de gerenciamento para uma loja de cabelos e perucas, incluindo dashboard administrativo, gerenciamento de pedidos, produtos e clientes.

## Configuração

### 1. Configurar o Supabase

1. Crie uma conta no [Supabase](https://supabase.com/) se ainda não tiver
2. Crie um novo projeto 
3. Quando o projeto estiver pronto, vá para a seção SQL Editor
4. Cole o conteúdo do arquivo `scripts/supabase_setup.sql` e execute

Este script criará:
- Tabelas necessárias (produtos, clientes, pedidos, itens de pedido)
- Funções RPC para o dashboard (`get_dashboard_stats` e `get_top_products`)
- Políticas de segurança
- Dados de exemplo

### 2. Configurar as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key
```

Você encontra esses valores na seção API do seu projeto no Supabase.

### 3. Instalar e executar o projeto

```bash
# Instalar dependências
npm install

# Executar o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em http://localhost:3000

## Funcionalidades

- **Dashboard**: Visualize estatísticas de vendas, produtos mais vendidos e pedidos recentes
- **Produtos**: Gerencie o catálogo de produtos
- **Pedidos**: Acompanhe e gerencie pedidos de clientes
- **Clientes**: Gerencie informações de clientes

## Tecnologias utilizadas

- Next.js
- React Query
- Supabase (Banco de dados PostgreSQL + Autenticação)
- Tailwind CSS

## Solução de problemas

Se o dashboard não estiver mostrando dados:

1. Verifique se as variáveis de ambiente estão corretas
2. Verifique se o SQL foi executado corretamente no Supabase
3. Verifique o console do navegador para erros
4. Verifique se as funções RPC (`get_dashboard_stats` e `get_top_products`) estão criadas no Supabase 