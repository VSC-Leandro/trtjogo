# Território

Jogo solarpunk de regeneração ambientado em **Queimados (RJ)**, num mundo pós-colapso climático.
Você guia uma comunidade que cura a terra ferida, bairro por bairro, e a faz viver de novo.

> Protótipo **alpha (v0.3)** — o foco é a estrutura e o núcleo jogável, não o jogo completo.

---

## Estrutura do projeto

```
territorio/
├── package.json          # script para rodar cliente + servidor juntos
├── client/               # FRONTEND (o jogo no navegador) — Vite + JS modular
│   ├── index.html        # marcação das telas (menu, criação, mapa)
│   ├── vite.config.js    # proxy de /api para o servidor
│   └── src/
│       ├── main.js       # ponto de entrada: navegação e ligação dos módulos
│       ├── style.css     # identidade visual (Space Grotesk, verde + grafite)
│       ├── state.js      # estado do jogo (personagem, recursos, tempo)
│       ├── ui.js         # utilidades de tela (toast, recursos)
│       ├── api.js        # chamadas ao backend (salvar/carregar)
│       ├── data/
│       │   └── bairros.js  # os bairros de Queimados como hexágonos
│       └── game/
│           ├── camera.js   # câmera do mapa (arrastar / zoom)
│           ├── hexmap.js   # mapa hexagonal, seleção e regeneração
│           └── time.js     # relógio, data e estações
└── server/               # BACKEND (Node + Express) — salvar/carregar partidas
    ├── server.js
    ├── routes/saves.js
    └── data/saves/       # partidas salvas (arquivos JSON)
```

---

## Por que essa separação?

- **`client/`** é o jogo de verdade. Roda 100% no navegador. Tudo que é jogabilidade
  (mapa, regeneração, tempo, personagem) vive aqui, dividido em módulos pequenos por assunto.
- **`server/`** é um backend **mínimo e proposital**. Hoje ele faz só uma coisa: guardar e
  recuperar partidas. Isso já deixa o esqueleto pronto para crescer.

### Sobre o backend, com franqueza

Um jogo single-player como este **não precisa de backend para funcionar** — o `client/`
roda sozinho. O servidor só passa a valer a pena quando você quiser:

- salvar partidas na nuvem e continuar de outro aparelho;
- ter **contas de usuário**;
- **ranking** entre jogadores;
- **multiplayer**.

Por isso ele começa enxuto (salvar/carregar em arquivos JSON, sem banco de dados).
Quando a necessidade aparecer, troque a camada de arquivos por **SQLite** ou **Postgres**
sem mexer no resto.

---

## Como rodar

Pré-requisito: **Node.js 18+** instalado.

```bash
# 1) instala as dependências (raiz, cliente e servidor)
npm run install:all

# 2) roda cliente e servidor ao mesmo tempo
npm run dev
```

Depois abra **http://localhost:5173** no navegador.

Quer rodar separado? Em dois terminais:

```bash
npm --prefix server run dev    # backend  -> http://localhost:3001
npm --prefix client run dev    # frontend -> http://localhost:5173
```

O botão **Salvar** (na tela do mapa) grava a partida no servidor. Se o servidor estiver
desligado, o jogo avisa e continua funcionando normalmente.

---

## Publicar na Vercel

Publique **apenas o cliente** (o jogo roda sozinho no navegador):

1. Em **Settings → General → Root Directory**, defina `client`.
2. A Vercel detecta o Vite automaticamente (build `vite build`, saída `dist`).

> `package.json` é JSON puro e **não pode ter comentários** (`//`). Se o build falhar com
> *"Unexpected token '/'"*, é sinal de que o conteúdo de um arquivo `.js` foi parar dentro
> de um `package.json` — restaure o `package.json` correto.

O servidor Express **não roda na Vercel** (ambiente serverless: sem processo ligado e com
disco temporário). Por isso, na versão publicada, o botão Salvar fica desativado com um
aviso. Para salvar na nuvem de verdade, hospede o servidor num serviço que mantém o processo
ligado (Render, Railway, Fly) ou migre para funções serverless + armazenamento (Vercel KV/Postgres).

---

## O que já funciona

- Menu → criação de personagem (nome, gênero, personalidade, bioma) → mapa.
- Mapa hexagonal de Queimados: cada hexágono é um bairro, com tipo de terreno e estado.
- Selecionar um bairro e **regenerá-lo** (gasta materiais e saberes; terra viva produz recursos).
- Relógio com data e **estações** correndo (pausa e velocidade).
- Câmera estilo Civ/CK3: arrastar, zoom (roda/pinça/botões), com limites.
- Salvar partida no backend.

## Próximos passos sugeridos

- Tipos de terreno e **problemas específicos** por bairro (erosão, nascente seca).
- Ligar a regeneração ao **sistema de saberes** (cada cura exige o conhecimento certo).
- **Sobreviventes** com talentos e personalidade (camada de comunidade).
- Carregar partidas salvas a partir do menu (**Continuar**).
- Fidelidade geográfica: traçar os polígonos reais dos bairros a partir do mapa oficial.

---

*Notas: o layout dos hexágonos é uma aproximação leste-oeste dos bairros reais, não um
mapa geograficamente exato. A identidade visual (cores, tipografia, marca TERRITÓRIO)
segue o material de referência do projeto.*
