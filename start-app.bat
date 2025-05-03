@echo off
echo ===================================================
echo   INICIANDO LOJA E PAINEL ADMINISTRATIVO
echo ===================================================
echo.

REM Limpar portas potencialmente ocupadas
echo Verificando e liberando portas...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Limpar cache para evitar problemas
echo Limpando cache...
if exist .next rmdir /s /q .next
timeout /t 1 /nobreak >nul

REM Configurar variáveis de ambiente
set PORT=3000
set NEXT_PUBLIC_STORE_URL=http://localhost:%PORT%

REM Iniciar aplicação
echo Iniciando aplicação na porta %PORT%...
echo.
echo ===================================================
echo   APLICAÇÃO INICIADA!
echo ===================================================
echo.
echo URL: %NEXT_PUBLIC_STORE_URL%
echo Painel Admin: %NEXT_PUBLIC_STORE_URL%/dashboard
echo.
echo Para encerrar a aplicação, feche a janela do terminal ou execute:
echo taskkill /f /im node.exe
echo.

npm run dev 