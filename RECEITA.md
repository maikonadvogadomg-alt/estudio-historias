# 🧬 Receita para recriar: Estúdio de Histórias

_Gerada sem IA, lendo 16 arquivo(s). Serve para remontar este app como HTML modular — com qualquer IA, um arquivo por vez._

## 1. O que é

- **Nome:** Estúdio de Histórias
- **Partes de código:** 11 (1 tela, 9 logica, 0 servidor, 0 dados, 1 estilo)
- **Tem servidor (rotas /api):** não — dá para ser só HTML
- **Peças de fora (bibliotecas):** nenhuma

## 2. Estrutura modular proposta

```
index.html            ← a página; chama os módulos NA ORDEM
css/app.css           ← o visual
js/00-core.js         ← a "locomotiva": cria window.APP (registrar, guardar, avisar)
js/10-base.js         ← Estúdio de Histórias — 00-base.js: peças comuns (banco no aparelho, av (era js/00-base.js)
js/15-ia.js           ← Estúdio de Histórias — 10-ia.js: chama a IA (Gemini, Groq, OpenRouter  (era js/10-ia.js)
js/20-caso.js         ← Estúdio de Histórias — 20-caso.js: contar o caso (falando ou escrevend (era js/20-caso.js)
js/25-roteiro.js      ← Estúdio de Histórias — 30-roteiro.js: ver e mudar as cenas do roteiro (era js/30-roteiro.js)
js/30-voz.js          ← Estúdio de Histórias — 40-voz.js: gravar a sua voz em cada cena (telep (era js/40-voz.js)
js/35-imagens.js      ← Estúdio de Histórias — 50-imagens.js: uma imagem para cada cena (busca (era js/50-imagens.js)
js/40-video.js        ← Estúdio de Histórias — 60-video.js: junta voz + imagens + legenda e gr (era js/60-video.js)
js/45-config.js       ← Estúdio de Histórias — 70-config.js: chave da IA e projeto (era js/70-config.js)
js/50-inicio.js       ← Estúdio de Histórias — 90-inicio.js: abre o último projeto e liga as a (era js/90-inicio.js)
js/55-inicio.js       ← Estúdio de Histórias (era index.html)
js/99-app.js          ← o último: monta a tela com o que embarcou
```

## 3. As partes, uma por uma

| # | Era | Vira | Tipo | O que faz | Usa |
|---|---|---|---|---|---|
| 1 | `js/00-base.js` | `js/10-base.js` | logica | Estúdio de Histórias — 00-base.js: peças comuns (banco no aparelho, avisos, abas) | — |
| 2 | `js/10-ia.js` | `js/15-ia.js` | logica | Estúdio de Histórias — 10-ia.js: chama a IA (Gemini, Groq, OpenRouter ou compatível) | — |
| 3 | `js/20-caso.js` | `js/20-caso.js` | logica | Estúdio de Histórias — 20-caso.js: contar o caso (falando ou escrevendo) e pedir o roteiro | — |
| 4 | `js/30-roteiro.js` | `js/25-roteiro.js` | logica | Estúdio de Histórias — 30-roteiro.js: ver e mudar as cenas do roteiro | — |
| 5 | `js/40-voz.js` | `js/30-voz.js` | logica | Estúdio de Histórias — 40-voz.js: gravar a sua voz em cada cena (teleprompter) ou trazer o | — |
| 6 | `js/50-imagens.js` | `js/35-imagens.js` | logica | Estúdio de Histórias — 50-imagens.js: uma imagem para cada cena (busca grátis já pronta) | — |
| 7 | `js/60-video.js` | `js/40-video.js` | logica | Estúdio de Histórias — 60-video.js: junta voz + imagens + legenda e grava o vídeo (no próp | — |
| 8 | `js/70-config.js` | `js/45-config.js` | logica | Estúdio de Histórias — 70-config.js: chave da IA e projeto | — |
| 9 | `js/90-inicio.js` | `js/50-inicio.js` | logica | Estúdio de Histórias — 90-inicio.js: abre o último projeto e liga as abas | — |
| 10 | `css/estilo.css` | css/app.css | estilo | — | — |
| 11 | `index.html` | `js/55-inicio.js` | tela | Estúdio de Histórias | manifest.json, icone.svg, estilo.css, 00-base.js |

## 4. Montar passo a passo (cada bloco é um pedido pronto: 📋 Copiar → colar na IA)

### Passo 0 — combinar as regras com a IA

```text
Vamos recriar o app "Estúdio de Histórias" como HTML MODULAR, que abre pelo index.html, sem servidor e sem nada da Replit.
Regras: (1) index.html chama os arquivos js/ na ordem, antes do </body>; (2) js/00-core.js cria window.APP com APP.registrar(modulo), APP.guardar(chave, valor) em IndexedDB/localStorage e APP.avisar(texto); (3) cada arquivo js/NN-nome.js cuida de UM assunto, começa com (function (APP) { e termina com })(window.APP); (4) js/99-app.js vem por último e monta a tela com os módulos registrados; (5) textos em português do Brasil.
Vou pedir UM arquivo por vez. Responda só com o arquivo completo, sem cortar nada. Primeiro: crie index.html, css/app.css e js/00-core.js.
```

### Passo 1 — `js/10-base.js` (era `js/00-base.js`, 95 linhas)

```text
Crie js/10-base.js. Ele faz: Estúdio de Histórias — 00-base.js: peças comuns (banco no aparelho, avisos, abas).
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 2 — `js/15-ia.js` (era `js/10-ia.js`, 55 linhas)

```text
Crie js/15-ia.js. Ele faz: Estúdio de Histórias — 10-ia.js: chama a IA (Gemini, Groq, OpenRouter ou compatível).
Ele chamava estes endereços: https://generativelanguage.googleapis.com/v1beta/models/. Em HTML, ligue cada um à função equivalente do módulo certo.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 3 — `js/20-caso.js` (era `js/20-caso.js`, 90 linhas)

```text
Crie js/20-caso.js. Ele faz: Estúdio de Histórias — 20-caso.js: contar o caso (falando ou escrevendo) e pedir o roteiro à IA.
No app original ele tinha estas funções/partes: parar, sistema.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 4 — `js/25-roteiro.js` (era `js/30-roteiro.js`, 50 linhas)

```text
Crie js/25-roteiro.js. Ele faz: Estúdio de Histórias — 30-roteiro.js: ver e mudar as cenas do roteiro.
No app original ele tinha estas funções/partes: pintar, textoRoteiro.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 5 — `js/30-voz.js` (era `js/40-voz.js`, 93 linhas)

```text
Crie js/30-voz.js. Ele faz: Estúdio de Histórias — 40-voz.js: gravar a sua voz em cada cena (teleprompter) ou trazer o áudio pronto.
No app original ele tinha estas funções/partes: limparUrls, pintar, pararFluxo, tipoAudio, gravar, importar, vozBoa, previa.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 6 — `js/35-imagens.js` (era `js/50-imagens.js`, 57 linhas)

```text
Crie js/35-imagens.js. Ele faz: Estúdio de Histórias — 50-imagens.js: uma imagem para cada cena (busca grátis já pronta).
No app original ele tinha estas funções/partes: pintar, reduzir.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 7 — `js/40-video.js` (era `js/60-video.js`, 212 linhas)

```text
Crie js/40-video.js. Ele faz: Estúdio de Histórias — 60-video.js: junta voz + imagens + legenda e grava o vídeo (no próprio aparelho).
No app original ele tinha estas funções/partes: palavras, durSemVoz, resumo, pedacosLegenda, tokensEnfase, desenharLegenda, desenharImagem, escurecerBaixo, desenharTitulo, tipoVideo, aviso, quadro.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 8 — `js/45-config.js` (era `js/70-config.js`, 28 linhas)

```text
Crie js/45-config.js. Ele faz: Estúdio de Histórias — 70-config.js: chave da IA e projeto.
No app original ele tinha estas funções/partes: mostrar, gravar.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 9 — `js/50-inicio.js` (era `js/90-inicio.js`, 36 linhas)

```text
Crie js/50-inicio.js. Ele faz: Estúdio de Histórias — 90-inicio.js: abre o último projeto e liga as abas.
No app original ele tinha estas funções/partes: lista, abrir, novo, iniciar.
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 10 — `js/55-inicio.js` (era `index.html`, 161 linhas)

```text
Crie js/55-inicio.js. Ele faz: Estúdio de Histórias.
Ele usa o que já foi criado em: js/10-base.js, js/15-ia.js, js/20-caso.js, js/25-roteiro.js, js/30-voz.js, js/35-imagens.js, js/40-video.js, js/45-config.js, js/50-inicio.js (pelo APP).
Registre com APP.registrar({ nome, icone, abrir }). Devolva só o arquivo completo.
```

### Passo 11 — `js/99-app.js` e conferir

```text
Crie js/99-app.js: ele olha APP.modulos e monta o menu/abas com um botão para cada módulo. Depois, me mande o index.html atualizado com todos os <script src="js/…"> na ordem certa: js/00-core.js, js/10-base.js, js/15-ia.js, js/20-caso.js, js/25-roteiro.js, js/30-voz.js, js/35-imagens.js, js/40-video.js, js/45-config.js, js/50-inicio.js, js/55-inicio.js, js/99-app.js.
```

## 5. Conferir no final

- [ ] Abrir o index.html na prévia: aparece a tela sem erro (▤ console vazio)?
- [ ] Cada botão abre a sua parte?
- [ ] Fechar e abrir de novo: os dados continuam?
- [ ] Nada com "replit", "REPL_", "@workspace" no código (🏗️ Preparar confere).
- [ ] 📱 PWA → deixar instalável; 📦 APK ou 🖥️ .exe.
