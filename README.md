# uprconsultacnpj

Aplicação de consulta de CNPJ desenvolvida com React, TypeScript e Vite.

## Publicação no Netlify

O arquivo `netlify.toml`, na raiz do repositório, configura a publicação:

- Diretório base: `consulta-cnpj`.
- Comando de build: `npm ci && npm run build`.
- Diretório de publicação: `dist`, relativo ao diretório base (`consulta-cnpj/dist`).

O comando executa uma instalação limpa das dependências a partir do `package-lock.json` antes de compilar o aplicativo. Isso substitui arquivos de `node_modules` copiados de outro ambiente, restaura as permissões dos executáveis e instala os binários nativos adequados ao Linux usado no Netlify.

Os arquivos do site são gerados nesse diretório a cada deploy. Publicar a raiz do repositório, em vez de `consulta-cnpj/dist`, não disponibiliza a página inicial e causa o erro “Page not found”.
