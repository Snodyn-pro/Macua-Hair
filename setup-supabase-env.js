/**
 * Script para configurar o ambiente Supabase
 * 
 * Este script ajuda a configurar o arquivo .env.local 
 * com as credenciais do Supabase.
 */

const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('===================================================');
console.log('      Configuração do Supabase para Dados Reais    ');
console.log('===================================================');
console.log('\nEste script irá ajudá-lo a configurar o ambiente para usar dados reais do Supabase.');
console.log('\nVocê precisará fornecer sua URL do Supabase e chave anônima (anon key).');
console.log('Você pode encontrar essas informações no painel do Supabase em Configurações > API.\n');

// Captura as informações do usuário
rl.question('Digite a URL do seu projeto Supabase (ex: https://abcdefghijk.supabase.co): ', (supabaseUrl) => {
  if (!supabaseUrl || !supabaseUrl.includes('supabase.co')) {
    console.error('\nERRO: URL do Supabase inválida. Deve ser no formato https://xxxxx.supabase.co\n');
    rl.close();
    return;
  }

  rl.question('Digite a chave anônima (anon key) do seu projeto Supabase: ', (supabaseKey) => {
    if (!supabaseKey || supabaseKey.length < 20) {
      console.error('\nERRO: Chave anônima inválida. A chave deve ter pelo menos 20 caracteres.\n');
      rl.close();
      return;
    }

    rl.question('URL da aplicação (pressione ENTER para usar http://localhost:3001): ', (appUrl) => {
      const finalAppUrl = appUrl || 'http://localhost:3001';

      // Criar o conteúdo do arquivo .env.local
      const envContent = `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey}
NEXT_PUBLIC_APP_URL=${finalAppUrl}`;

      // Gravar o arquivo .env.local
      const envFilePath = path.join(process.cwd(), '.env.local');
      try {
        fs.writeFileSync(envFilePath, envContent, 'utf8');
        console.log('\n✅ Arquivo .env.local criado com sucesso!');
        console.log(`\nO arquivo foi salvo em: ${envFilePath}`);
      } catch (error) {
        console.error('\n❌ Erro ao criar o arquivo .env.local:', error.message);
        console.log('\nVocê pode criar o arquivo manualmente com o seguinte conteúdo:');
        console.log('\n-------------------------------------------');
        console.log(envContent);
        console.log('-------------------------------------------');
      }

      console.log('\n⚠️ PRÓXIMOS PASSOS:');
      console.log('1. Certifique-se de que suas tabelas e funções estão configuradas no Supabase');
      console.log('2. Consulte o arquivo supabase-config.md para exemplos de funções SQL necessárias');
      console.log('3. Reinicie o servidor Next.js com npm run dev');
      console.log('\n✨ Concluído! Seu dashboard deve agora usar dados reais do Supabase.');
      
      rl.close();
    });
  });
});

// Lidar com o encerramento da interface readline
rl.on('close', () => {
  process.exit(0);
}); 