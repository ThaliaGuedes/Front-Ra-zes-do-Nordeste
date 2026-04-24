# Lanchonete API Tester

Frontend de testes para o backend Django de lanchonete.  
Construído com React + Vite — foco em cobertura de APIs, não em design.

---

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Estrutura do projeto

```
src/
├── context/
│   └── AuthContext.jsx       # Estado global de tokens, user e baseUrl
├── services/
│   └── http.js               # Cliente HTTP centralizado (Bearer + auto-refresh 401)
├── hooks/
│   └── useApiCall.js         # Hook com estado de loading/result por chamada
├── components/
│   ├── Panel.jsx             # Container colapsável por endpoint
│   ├── ResponseBox.jsx       # Exibe status HTTP, payload enviado e resposta
│   ├── Topbar.jsx            # Barra superior: base URL, usuário, role, logout
│   └── Sidebar.jsx           # Navegação lateral com indicador de lock
├── pages/
│   ├── AuthPage.jsx          # Login, Register, Refresh Token, /usuarios/me/
│   ├── CatalogPage.jsx       # Unidades, Cardápio, Promoções (público)
│   ├── ProdutosPage.jsx      # Listar e criar produtos
│   ├── EstoquePage.jsx       # Listar estoque e registrar movimentações
│   ├── PedidosPage.jsx       # Criar, listar, detalhar, atualizar status, cancelar, pagamento
│   └── FidelidadePage.jsx    # Saldo, consentimento, histórico, resgates
├── styles.css                # Estilo global (tema industrial/terminal)
├── App.jsx                   # Shell principal com roteamento por aba
└── main.jsx                  # Entry point
```

---

## Funcionalidades

| Área           | Endpoints cobertos |
|----------------|--------------------|
| Auth           | POST /auth/register/, POST /auth/token/, POST /auth/token/refresh/, GET /usuarios/me/ |
| Catálogo       | GET /unidades/, GET /unidades/{id}/cardapio/, GET /promocoes/ |
| Produtos       | GET /produtos/, POST /produtos/ |
| Estoque        | GET /estoques/, POST /estoques/movimentacoes/ |
| Pedidos        | GET\|POST /pedidos/, GET /pedidos/{id}/, PATCH /pedidos/{id}/status/, POST /pedidos/{id}/cancelamento/, GET /pagamentos/pedidos/{id}/ |
| Fidelidade     | GET\|PATCH /fidelidade/saldo/, GET /fidelidade/historico/, POST /fidelidade/resgates/ |

---

## Comportamentos do cliente HTTP

- **Bearer automático**: todo request autenticado injeta `Authorization: Bearer <access>`
- **Auto-refresh**: se receber 401 e existir refresh token, tenta `/auth/token/refresh/` uma vez e repete o request original
- **Logout automático**: se o refresh também falhar, limpa os tokens e desloga
- **Base URL configurável**: campo no topo da tela, persistido em localStorage

---

## Suposições documentadas

- O backend roda em `http://127.0.0.1:8000/api` por padrão (editável na UI)
- Os tokens JWT seguem o padrão do `djangorestframework-simplejwt` (campos `access` e `refresh`)
- O endpoint de registro aceita os campos: `username`, `password`, `email`, `nome_completo`, `perfil`
- O endpoint `/usuarios/me/` retorna pelo menos `username`, `perfil` e `email`
- Os itens do pedido seguem o formato `[{ produto_id, quantidade, observacao }]`
- O campo de perfil do usuário vem como string: `CLIENTE`, `ATENDENTE`, `COZINHA`, `GERENTE`, `ADMIN`

Se algum campo divergir do seu backend, basta editar o formulário na página correspondente — o código é direto e sem abstrações desnecessárias.

---

## CORS

Para testar a partir do browser (`localhost:3000 → localhost:8000`), o Django precisa aceitar CORS. Adicione no `settings.py`:

```python
INSTALLED_APPS += ['corsheaders']
MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware', ...resto...]
CORS_ALLOW_ALL_ORIGINS = True  # só para desenvolvimento!
```

E instale: `pip install django-cors-headers`
