-- Script SQL para configurar o esquema do Supabase para o dashboard
-- Este script cria ou altera tabelas e funções necessárias para o dashboard funcionar

-- Verificar e criar o esquema public se não existir
CREATE SCHEMA IF NOT EXISTS public;

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  imageUrl VARCHAR(500),
  hairType VARCHAR(100),
  length VARCHAR(50),
  color VARCHAR(50),
  origin VARCHAR(100),
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  stock_quantity INT DEFAULT 0,
  stock_threshold INT DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Brasil',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id),
  customer_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pendente',
  total DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'Pendente',
  shipping_address TEXT,
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(50),
  shipping_postal_code VARCHAR(20),
  shipping_country VARCHAR(100) DEFAULT 'Brasil',
  shipping_method VARCHAR(100),
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir acesso anônimo (para desenvolvimento)
DROP POLICY IF EXISTS "Permitir acesso anônimo aos produtos" ON public.products;
DROP POLICY IF EXISTS "Permitir acesso anônimo aos clientes" ON public.customers;
DROP POLICY IF EXISTS "Permitir acesso anônimo aos pedidos" ON public.orders;
DROP POLICY IF EXISTS "Permitir acesso anônimo aos itens de pedido" ON public.order_items;

CREATE POLICY "Permitir acesso anônimo aos produtos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Permitir acesso anônimo aos clientes" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Permitir acesso anônimo aos pedidos" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Permitir acesso anônimo aos itens de pedido" ON public.order_items FOR SELECT USING (true);

-- Função para obter estatísticas do dashboard
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
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
    SELECT COUNT(*) INTO total_pedidos FROM public.orders;
    
    -- Conta pedidos pendentes
    SELECT COUNT(*) INTO pedidos_pendentes FROM public.orders WHERE status = 'Pendente' OR status = 'Em processamento';
    
    -- Conta produtos
    SELECT COUNT(*) INTO total_produtos FROM public.products;
    
    -- Conta produtos ativos
    SELECT COUNT(*) INTO produtos_ativos FROM public.products WHERE active = true;
    
    -- Calcula receita total
    SELECT COALESCE(SUM(total), 0) INTO receita_total FROM public.orders;
    
    -- Calcula receita mensal (último mês)
    SELECT COALESCE(SUM(total), 0) INTO receita_mensal 
    FROM public.orders 
    WHERE created_at >= date_trunc('month', current_date);
    
    -- Conta clientes ativos
    SELECT COUNT(DISTINCT customer_id) INTO clientes_ativos 
    FROM public.orders 
    WHERE created_at >= date_trunc('month', current_date - interval '1 month');
    
    -- Conta produtos com estoque baixo
    SELECT COUNT(*) INTO produtos_baixo_estoque 
    FROM public.products 
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

-- Função para obter produtos mais vendidos
CREATE OR REPLACE FUNCTION public.get_top_products()
RETURNS SETOF json AS $$
BEGIN
    RETURN QUERY
    SELECT json_build_object(
        'id', p.id::text,
        'name', p.name,
        'sales', COUNT(oi.id),
        'revenue', SUM(oi.price * oi.quantity)
    )
    FROM public.products p
    JOIN public.order_items oi ON p.id = oi.product_id
    JOIN public.orders o ON oi.order_id = o.id
    GROUP BY p.id
    ORDER BY SUM(oi.price * oi.quantity) DESC;
END;
$$ LANGUAGE plpgsql;

-- Comentário final
COMMENT ON FUNCTION public.get_dashboard_stats() IS 'Função para obter estatísticas do dashboard da loja';
COMMENT ON FUNCTION public.get_top_products() IS 'Função para obter produtos mais vendidos da loja';

-- Inserir alguns produtos de exemplo se a tabela estiver vazia
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM public.products) = 0 THEN
        INSERT INTO public.products (name, description, price, hairType, length, color, origin, featured, stock_quantity, stock_threshold, imageUrl)
        VALUES 
        ('Cabelo Natural Liso 60cm', 'Cabelo natural de alta qualidade, liso, comprimento 60cm.', 1200.00, 'Liso', '60cm', 'Preto', 'Brasileiro', true, 15, 5, 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFpciUyMGV4dGVuc2lvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'),
        ('Cabelo Ondulado 45cm', 'Cabelo ondulado natural, comprimento 45cm.', 950.00, 'Ondulado', '45cm', 'Castanho', 'Indiano', true, 8, 5, 'https://images.unsplash.com/photo-1605980625600-88d6ebb40da7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aGFpciUyMGV4dGVuc2lvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'),
        ('Cabelo Cacheado 50cm', 'Cabelo cacheado natural, comprimento 50cm.', 1050.00, 'Cacheado', '50cm', 'Castanho Escuro', 'Brasileiro', false, 12, 5, 'https://images.unsplash.com/photo-1595462760980-98e721fb50e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3VybHklMjBoYWlyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'),
        ('Peruca Front Lace Ondulada', 'Peruca front lace ondulada com aspecto natural.', 1800.00, 'Ondulado', '40cm', 'Preto', 'Malaio', true, 4, 2, 'https://images.unsplash.com/photo-1596635598058-e989a1c74db0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aGFpciUyMGV4dGVuc2lvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'),
        ('Kit Tratamento Capilar Premium', 'Kit completo de tratamento para cabelos humanos.', 399.99, NULL, NULL, NULL, NULL, true, 20, 8, 'https://images.unsplash.com/photo-1601497285094-6235a1b39145?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aGFpciUyMHByb2R1Y3RzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60');
    END IF;
END $$; 