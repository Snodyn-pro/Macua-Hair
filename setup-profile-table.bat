@echo off
title Configuração da Tabela de Perfis

echo.
echo ===============================================
echo      SETUP DA TABELA DE PERFIS NO SUPABASE
echo ===============================================
echo.
echo Este script vai ajudar a configurar a tabela de perfis
echo necessária para que a página de perfil funcione corretamente.
echo.
echo Certifique-se de que você tenha as seguintes variáveis configuradas
echo no arquivo .env.local na raiz do projeto:
echo.
echo   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
echo   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
echo   SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role (opcional)
echo.

timeout /t 3 >nul

rem Verificar se a pasta migrations existe
if not exist migrations\ (
  echo [!] Criando pasta migrations...
  mkdir migrations
)

rem Verificar se a pasta scripts existe
if not exist scripts\ (
  echo [!] Criando pasta scripts...
  mkdir scripts
)

rem Verificar se o script de migração existe
if not exist migrations\20240608_add_profiles_table.sql (
  echo [!] ERRO: Arquivo de migração não encontrado em migrations\20240608_add_profiles_table.sql
  echo [!] Por favor, execute este script no diretório raiz do projeto.
  echo.
  pause
  exit /b 1
)

rem Verificar se o arquivo .env.local existe
if not exist .env.local (
  echo [!] AVISO: Arquivo .env.local não encontrado.
  echo [!] Criando um arquivo .env.local de exemplo...
  
  echo NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co > .env.local
  echo NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima >> .env.local
  echo SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role >> .env.local
  
  echo.
  echo [!] Por favor, edite o arquivo .env.local com suas credenciais do Supabase antes de continuar.
  echo.
  start notepad .env.local
  pause
  echo.
)

echo [1] Instalando dependências necessárias...
echo.
call npm install dotenv @supabase/supabase-js

echo.
echo [2] Verificando conexão com o Supabase...
echo.
call node scripts/check-supabase-connection.js
if %ERRORLEVEL% neq 0 (
  echo.
  echo [!] Erro na verificação da conexão com o Supabase. 
  echo [!] Verifique suas credenciais no arquivo .env.local
  echo.
  pause
  exit /b 1
)

echo.
echo [3] Executando migração para criar a tabela de perfis...
echo.
call node scripts/apply-profiles-migration.js

echo.
echo [4] Verificando se a tabela foi criada com sucesso...
echo.
call node scripts/check-supabase-connection.js

echo.
echo ===============================================
echo                 PRÓXIMOS PASSOS
echo ===============================================
echo.
echo Se a migração foi bem-sucedida, agora você pode:
echo.
echo 1. Reiniciar o servidor de desenvolvimento com:
echo    npm run dev
echo.
echo 2. Acessar a página de perfil normalmente
echo.
echo Se continuar enfrentando problemas, verifique
echo os logs do console ou execute SQL diretamente
echo no Dashboard do Supabase.
echo.
pause 