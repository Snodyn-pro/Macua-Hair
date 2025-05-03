# Configuração do Supabase para Dados Reais

Para usar dados reais no dashboard, siga os passos abaixo:

## 1. Crie um arquivo .env.local na raiz do projeto

Crie um arquivo chamado `.env.local` na raiz do seu projeto com o seguinte conteúdo:

```
NEXT_PUBLIC_SUPABASE_URL=https://sua-instancia.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## 2. Substitua os valores com suas credenciais do Supabase

- Acesse o painel de controle do Supabase (https://app.supabase.io)
- Selecione seu projeto
- Vá para Configurações > API
- Copie a URL e a chave anônima (anon key) 
- Cole esses valores no arquivo .env.local

## 3. Crie as tabelas e funções necessárias no Supabase

O dashboard espera que existam determinadas tabelas e funções no seu banco de dados Supabase:

### Tabelas necessárias:
- products
- orders
- customers

### Funções RPC necessárias:
- get_dashboard_stats
- get_top_products

## 4. Exemplo de função RPC para estatísticas do dashboard

Crie esta função no SQL Editor do Supabase:

```sql
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS json AS $$
DECLARE
    total_pedidos INT;
    pedidos_pendentes INT;
    total_produtos INT;
    produtos_ativos INT;
    receita_total DECIMAL;
    receita_mensal DECIMAL;
    clientes_ativos INT;
    produtos_baixo_estoque INT;
    result_json json;
BEGIN
    -- Conta o total de pedidos
    SELECT COUNT(*) INTO total_pedidos FROM orders;
    
    -- Conta pedidos pendentes
    SELECT COUNT(*) INTO pedidos_pendentes FROM orders WHERE status = 'Pendente' OR status = 'Em processamento';
    
    -- Conta produtos
    SELECT COUNT(*) INTO total_produtos FROM products;
    
    -- Conta produtos ativos
    SELECT COUNT(*) INTO produtos_ativos FROM products WHERE active = true;
    
    -- Calcula receita total
    SELECT COALESCE(SUM(total), 0) INTO receita_total FROM orders;
    
    -- Calcula receita mensal (último mês)
    SELECT COALESCE(SUM(total), 0) INTO receita_mensal 
    FROM orders 
    WHERE created_at >= date_trunc('month', current_date);
    
    -- Conta clientes ativos
    SELECT COUNT(DISTINCT customer_id) INTO clientes_ativos 
    FROM orders 
    WHERE created_at >= date_trunc('month', current_date - interval '1 month');
    
    -- Conta produtos com estoque baixo
    SELECT COUNT(*) INTO produtos_baixo_estoque 
    FROM products 
    WHERE stock_quantity <= stock_threshold;
    
    -- Constrói e retorna o JSON
    result_json := json_build_object(
        'totalPedidos', total_pedidos,
        'pedidosPendentes', pedidos_pendentes,
        'totalProdutos', total_produtos,
        'produtosAtivos', produtos_ativos,
        'receitaTotal', receita_total,
        'receitaMensal', receita_mensal,
        'clientesAtivos', clientes_ativos,
        'produtosBaixoEstoque', produtos_baixo_estoque
    );
    
    RETURN result_json;
END;
$$ LANGUAGE plpgsql;
```

## 5. Exemplo de função RPC para produtos mais vendidos

```sql
CREATE OR REPLACE FUNCTION get_top_products()
RETURNS SETOF json AS $$
BEGIN
    RETURN QUERY
    SELECT json_build_object(
        'id', p.id,
        'name', p.name,
        'sales', COUNT(oi.id),
        'revenue', SUM(oi.price * oi.quantity)
    )
    FROM products p
    JOIN order_items oi ON p.id = oi.product_id
    JOIN orders o ON oi.order_id = o.id
    GROUP BY p.id
    ORDER BY SUM(oi.price * oi.quantity) DESC;
END;
$$ LANGUAGE plpgsql;
```

## 6. Reinicie o servidor Next.js

Após configurar o arquivo .env.local e as funções no Supabase, reinicie o servidor Next.js:

```
npm run dev
```

Agora seu dashboard deverá carregar dados reais do seu banco de dados Supabase! 