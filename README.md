# Lanchonete Tester

Aplicacao frontend para testar os endpoints da API Raízes do Nordeste que está nesse repositório
https://github.com/ThaliaGuedes/LanchoneteAPI

## Tecnologias

- React 18
- Vite 5
- JavaScript

## Pre-requisitos

Antes de iniciar, tenha instalado:

- Node.js 18 ou superior
- npm

## Como rodar o projeto

1. Entre na pasta do projeto:

```bash
cd lanchonete-tester
```

2. Instale as dependencias:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra no navegador:

```text
http://localhost:3000
```

## Scripts disponiveis

- `npm run dev`: inicia o projeto em modo de desenvolvimento
- `npm run build`: gera a versao de producao na pasta `dist`
- `npm run preview`: sobe uma visualizacao local da build gerada

## Integracao com o backend

- A aplicacao foi feita para consumir uma API da lanchonete.
- A URL base padrao esperada pela interface e `http://127.0.0.1:8000/api`.
- Essa URL pode ser alterada diretamente no topo da aplicacao.

## Exemplo de fluxo completo

Se quiser rodar do zero:

```bash
npm install
npm run dev
```

Depois acesse `http://localhost:3000`.

## Build para producao

Para gerar a build:

```bash
npm run build
```

Os arquivos finais serao criados na pasta `dist`.

Para testar a build localmente:

```bash
npm run preview
```

## Observacoes

- Se o backend estiver em outra porta ou dominio, atualize a Base URL pela interface.
- Se houver bloqueio de requisicoes no navegador, verifique a configuracao de CORS no backend.
- A pasta `node_modules` nao precisa ser versionada.
