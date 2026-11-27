/* Estúdio de Histórias — 50-imagens.js: uma imagem para cada cena (busca grátis já pronta). */
(function (H) {
  let urls = [];
  async function pintar() {
    const el = H.$('#img-lista'), p = H.p; urls.forEach((u) => URL.revokeObjectURL(u)); urls = [];
    if (!p.cenas.length) { el.innerHTML = '<div class="caixa">Primeiro faça o roteiro em 📝 Caso.</div>'; return; }
    const prontas = p.cenas.filter((c) => c.imgId).length;
    let h = '<div class="caixa">🖼️ ' + prontas + ' de ' + p.cenas.length + ' cenas com imagem. <span class="pequeno">Dica: no Pexels e no Pixabay as imagens são grátis para usar em vídeos.</span></div>';
    for (let i = 0; i < p.cenas.length; i++) {
      const c = p.cenas[i]; let img = '<div class="sem-img">sem imagem · fundo escuro</div>';
      if (c.imgId) { const b = await H.banco.midia(c.imgId); if (b) { const u = URL.createObjectURL(b); urls.push(u); img = '<img class="miniatura" alt="" src="' + u + '">'; } }
      const q = encodeURIComponent(c.busca || H.limpo(c.texto).split(/\s+/).slice(0, 4).join(' '));
      h += '<div class="cena" data-i="' + i + '"><div class="cab"><b>Cena ' + (i + 1) + (c.imgId ? ' ✅' : '') + '</b></div>' +
        '<div class="pequeno">' + H.esc(H.limpo(c.texto).slice(0, 140)) + (c.texto.length > 140 ? '…' : '') + '</div>' +
        (c.imagem ? '<div class="meta">💡 ' + H.esc(c.imagem) + '</div>' : '') + img +
        '<div class="linha">' +
        '<a class="bt" style="display:inline-flex;align-items:center;text-decoration:none" target="_blank" rel="noopener" href="https://www.pexels.com/pt-br/procurar/' + q + '/">🔎 Pexels</a>' +
        '<a class="bt" style="display:inline-flex;align-items:center;text-decoration:none" target="_blank" rel="noopener" href="https://pixabay.com/pt/images/search/' + q + '/">🔎 Pixabay</a>' +
        '<button class="bt forte" data-a="escolher">📂 Escolher</button>' +
        (c.imgId ? '<button class="bt" data-a="tirar">🗑</button>' : '') +
        '</div></div>';
    }
    el.innerHTML = h;
  }
  H.on('aba', (n) => { if (n === 'img') pintar(); });
  H.on('projeto', () => { if (!H.$('#aba-img').hidden) pintar(); });

  // diminui a imagem para no máximo 1920 px (economiza espaço do aparelho)
  async function reduzir(f) {
    try {
      const bmp = await createImageBitmap(f);
      const k = Math.min(1, 1920 / Math.max(bmp.width, bmp.height));
      if (k === 1 && f.size < 1.5e6) return f;
      const cv = document.createElement('canvas'); cv.width = Math.round(bmp.width * k); cv.height = Math.round(bmp.height * k);
      cv.getContext('2d').drawImage(bmp, 0, 0, cv.width, cv.height);
      return await new Promise((ok) => cv.toBlob((b) => ok(b || f), 'image/jpeg', 0.88));
    } catch (e) { return f; }
  }

  H.$('#img-lista').addEventListener('click', async (e) => {
    const b = e.target.closest('button[data-a]'); if (!b) return;
    const i = +b.closest('.cena').dataset.i, c = H.p.cenas[i];
    if (b.dataset.a === 'escolher') {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
      inp.onchange = async () => {
        const f = inp.files[0]; if (!f) return;
        const velho = c.imgId; c.imgId = await H.banco.salvarMidia(await reduzir(f)); await H.banco.apagarMidia(velho);
        await H.salvar(true); H.aviso('✅ Imagem colocada na cena ' + (i + 1) + '.', 'ok'); pintar();
      };
      inp.click();
    } else if (b.dataset.a === 'tirar') {
      if (!confirm('Tirar a imagem da cena ' + (i + 1) + '?')) return;
      await H.banco.apagarMidia(c.imgId); c.imgId = ''; await H.salvar(true); pintar();
    }
  });
})(window.H);
