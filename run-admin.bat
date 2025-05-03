@echo off
echo Iniciando Macua Hair Admin Dashboard...
echo.
echo Limpando cache para evitar erros...

:: Limpar cache do Next.js
if exist ".next" (
  echo Removendo cache da loja principal...
  rmdir /s /q ".next"
)

if exist "Dash-board\.next" (
  echo Removendo cache do dashboard...
  rmdir /s /q "Dash-board\.next"
)

echo.
echo Iniciando aplicativos...

:: Iniciar a loja principal
start cmd /k "npm run dev"

:: Iniciar o dashboard administrativo
cd Dash-board
start cmd /k "npm run dev"

echo.
echo Aplicativos iniciados! Você pode acessar:
echo Loja principal: http://localhost:3000
echo Dashboard administrativo: http://localhost:3000/admin
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause > nul 