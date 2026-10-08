# uprconsultacnpj

Aplicação de consulta de CNPJ desenvolvida com React e Vite.

## Publicação no Netlify

A configuração de publicação está no arquivo `netlify.toml` na raiz do repositório:

- Diretório base: `consulta-cnpj`.
- Comando de build: `npm ci --include=dev && npm run build`.
- Diretório publicado: `consulta-cnpj/dist` (`dist`, relativo ao diretório base).

O Netlify instala as dependências e gera a pasta `dist` a cada deploy. Essa pasta contém o HTML e os arquivos JavaScript, CSS e imagens que devem ser publicados, em vez da raiz do repositório ou da pasta `src`.

Antes do build, `npm ci --include=dev` reinstala as dependências a partir de `package-lock.json`, incluindo TypeScript e Vite. Essa instalação limpa recria os executáveis com as permissões corretas no ambiente de deploy, evitando a falha `tsc: Permission denied` causada por dependências previamente copiadas sem permissão de execução.

As rotas da aplicação são direcionadas para `index.html`, preservando o acesso aos arquivos estáticos existentes.
