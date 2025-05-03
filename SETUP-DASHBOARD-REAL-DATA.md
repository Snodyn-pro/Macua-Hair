# Configuração do Dashboard com Dados Reais

Este guia mostra como configurar o dashboard da loja para usar dados reais do Supabase em vez dos dados simulados.

## Pré-requisitos

1. Uma conta no [Supabase](https://supabase.com)
2. Um projeto criado no Supabase
3. Node.js instalado no seu computador

## Passo 1: Configurar Variáveis de Ambiente

Você pode configurar as variáveis de ambiente de duas maneiras:

### Opção A: Usando o script automático

Execute o script de configuração do ambiente:

```bash
node setup-supabase-env.js
```

Este script irá solicitar:
- URL do seu projeto Supabase
- Chave anônima (anon key) do seu projeto
- URL da aplicação (opcional, padrão: http://localhost:3001)

### Opção B: Configuração manual

Crie um arquivo `.env.local` na raiz do projeto e adicione:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## Passo 2: Configurar o Banco de Dados Supabase

### Opção A: Usando o script SQL

1. Acesse o painel do Supabase > SQL Editor
2. Crie um novo script
3. Copie e cole o conteúdo do arquivo `setup-supabase-schema.sql`
4. Execute o script

### Opção B: Configuração manual

No Supabase, você precisa:

1. Criar as seguintes tabelas:
   - products
   - customers
   - orders
   - order_items

2. Criar as funções RPC:
   - get_dashboard_stats
   - get_top_products

Os exemplos dessas tabelas e funções estão no arquivo `setup-supabase-schema.sql`.

## Passo 3: Inserir Dados de Exemplo (Opcional)

O script SQL inclui a inserção de produtos de exemplo se a tabela estiver vazia. Se quiser mais dados de exemplo, você pode adicionar:

1. Mais produtos na tabela `products`
2. Clientes na tabela `customers`
3. Pedidos na tabela `orders` 
4. Itens de pedido na tabela `order_items`

## Passo 4: Verificar a Configuração

Para verificar se tudo está configurado corretamente:

1. Inicie o servidor:
   ```bash
   npm run dev
   ```

2. Acesse o dashboard em `http://localhost:3001/dashboard`

3. Verifique no console do navegador se aparece a mensagem:
   ```
   ✅ Usando cliente Supabase real com URL: https://seu-projeto.supabase.co
   ```

## Solução de Problemas

### O dashboard mostra dados de exemplo em vez de dados reais

- Verifique se o arquivo `.env.local` existe e contém as variáveis corretas
- Certifique-se de que reiniciou o servidor após criar o arquivo `.env.local`
- Verifique se as variáveis têm os nomes corretos

### O dashboard mostra erros de RPC

- Verifique se as funções `get_dashboard_stats` e `get_top_products` estão criadas no Supabase
- Certifique-se de que a implementação das funções está correta
- Confira os logs no SQL Editor do Supabase

### Problemas de Autenticação

- Verifique se está usando a chave anônima (anon key) correta
- Certifique-se de que as políticas de segurança no Supabase permitem acesso às tabelas 