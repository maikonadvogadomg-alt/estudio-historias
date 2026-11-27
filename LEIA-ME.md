# 🎬 Estúdio de Histórias — v26/11-A

Transforma um caso (ou a sua história) num vídeo narrado para o YouTube.

## Como usar
1. **⚙️ Config:** cole a chave da IA (Gemini ou Groq têm cota grátis) e toque em 🧪 Testar.
2. **📝 Caso:** toque em 🎤 Falar e conte o caso do seu jeito, ou escreva. Escolha o estilo, o tamanho e o formato (em pé ou deitado). Deixe marcado o 🔒 sigilo.
3. **🪄 Fazer o roteiro:** a IA escreve as cenas. *Palavra* = ênfase; … = pausa.
4. **🎬 Roteiro:** mude o que quiser, troque a ordem e tire ou acrescente cenas.
5. **🎙️ Voz:** grave cada cena lendo do teleprompter (⏺ Gravar / ⏹ Parar), ou traga o áudio pronto em 📂 (da sua voz clonada). O 🔊 Ensaiar lê com a voz do aparelho, só para treinar.
6. **🖼️ Imagens:** 🔎 Pexels / Pixabay já abrem com a busca pronta. Baixe a imagem e escolha em 📂.
7. **🎞️ Vídeo:** 🎬 Montar o vídeo. É em tempo real: deixe a tela ligada. Depois ⬇ Baixar ou 📤 Compartilhar.

## Sua voz clonada
- Em 🎬 Roteiro, toque em ⬇ Roteiro em .txt (uma cena por parágrafo).
- Gere o áudio de cada cena no programa ou site da clonagem.
- Coloque cada áudio na sua cena em 🎙️ Voz → 📂 Áudio pronto.

## Onde ficam as coisas
Tudo fica **neste aparelho** (projetos, gravações e imagens). A chave da IA também. Nada vai para a nuvem.

## Arquivos
- `index.html`, `css/estilo.css`, `manifest.json`, `sw.js`
- `js/00-base.js` (banco no aparelho e avisos) · `10-ia.js` (IA) · `20-caso.js` (contar e fazer o roteiro) · `30-roteiro.js` (cenas) · `40-voz.js` (gravar e importar) · `50-imagens.js` (imagens) · `60-video.js` (montar o vídeo) · `70-config.js` · `90-inicio.js`
