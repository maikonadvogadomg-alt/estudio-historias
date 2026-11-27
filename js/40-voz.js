/* Estúdio de Histórias — 40-voz.js: gravar a sua voz em cada cena (teleprompter) ou trazer o áudio pronto. */
(function (H) {
  let urls = [], gravador = null, gravandoI = -1, fluxo = null, pedacos = [];
  const limparUrls = () => { urls.forEach((u) => URL.revokeObjectURL(u)); urls = []; };

  async function pintar() {
    const el = H.$('#voz-lista'), p = H.p; limparUrls();
    if (!p.cenas.length) { el.innerHTML = '<div class="caixa">Primeiro faça o roteiro em 📝 Caso.</div>'; return; }
    const prontas = p.cenas.filter((c) => c.audioId).length;
    let h = '<div class="caixa">🎙️ ' + prontas + ' de ' + p.cenas.length + ' cenas com voz.</div>';
    for (let i = 0; i < p.cenas.length; i++) {
      const c = p.cenas[i]; let au = '';
      if (c.audioId) { const b = await H.banco.midia(c.audioId); if (b) { const u = URL.createObjectURL(b); urls.push(u); au = '<audio controls preload="metadata" src="' + u + '"></audio>'; } }
      h += '<div class="cena" data-i="' + i + '"><div class="cab"><b>Cena ' + (i + 1) + (c.audioId ? ' ✅' : '') + '</b></div>' +
        '<div class="prompter">' + H.prompter(c.texto) + '</div>' + au +
        '<div class="linha">' +
        '<button class="bt forte" data-a="gravar">' + (gravandoI === i ? '⏹ Parar' : (c.audioId ? '⏺ Gravar de novo' : '⏺ Gravar')) + '</button>' +
        '<button class="bt" data-a="importar" title="Trazer áudio pronto">📂 Áudio pronto</button>' +
        '<button class="bt" data-a="previa" title="Ouvir a cena com a voz do aparelho (só para ensaiar)">🔊 Ensaiar</button>' +
        (c.audioId ? '<button class="bt" data-a="tirar">🗑</button>' : '') +
        '</div></div>';
    }
    el.innerHTML = h;
    if (gravandoI >= 0) { const b = H.$('.cena[data-i="' + gravandoI + '"] [data-a="gravar"]', el); if (b) b.classList.add('gravando'); }
  }
  H.on('aba', (n) => { if (n === 'voz') pintar(); else { pararFluxo(); speechSynthesis && speechSynthesis.cancel(); } });
  H.on('projeto', () => { if (!H.$('#aba-voz').hidden) pintar(); });

  function pararFluxo() {
    if (gravador && gravador.state === 'recording') gravador.stop();
    if (fluxo) { fluxo.getTracks().forEach((t) => t.stop()); fluxo = null; }
  }
  const tipoAudio = () => ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find((t) => window.MediaRecorder && MediaRecorder.isTypeSupported(t)) || '';

  async function gravar(i) {
    if (gravandoI === i) { gravador.stop(); return; }
    if (gravandoI >= 0) { H.aviso('Termine a gravação da cena ' + (gravandoI + 1) + ' primeiro.', 'erro'); return; }
    if (!window.MediaRecorder) { H.aviso('Este navegador não grava áudio. Use o Chrome.', 'erro'); return; }
    try {
      if (!fluxo) fluxo = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    } catch (e) { H.aviso('O microfone foi bloqueado. Libere o microfone para este app.', 'erro', 6000); return; }
    const tipo = tipoAudio(); pedacos = [];
    gravador = new MediaRecorder(fluxo, tipo ? { mimeType: tipo } : undefined);
    gravador.ondataavailable = (e) => { if (e.data && e.data.size) pedacos.push(e.data); };
    gravador.onstop = async () => {
      const c = H.p.cenas[gravandoI]; gravandoI = -1;
      const blob = new Blob(pedacos, { type: gravador.mimeType || tipo || 'audio/webm' });
      if (blob.size < 2000) { H.aviso('A gravação ficou vazia. Tente de novo.', 'erro'); pintar(); return; }
      const velho = c.audioId; c.audioId = await H.banco.salvarMidia(blob); await H.banco.apagarMidia(velho);
      await H.salvar(true); H.aviso('✅ Voz da cena guardada.', 'ok'); pintar();
    };
    gravador.start(); gravandoI = i; pintar();
  }

  function importar(i) {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'audio/*,.mp3,.wav,.m4a,.ogg,.opus,.webm';
    inp.onchange = async () => {
      const f = inp.files[0]; if (!f) return;
      const c = H.p.cenas[i], velho = c.audioId;
      c.audioId = await H.banco.salvarMidia(f); await H.banco.apagarMidia(velho);
      await H.salvar(true); H.aviso('✅ Áudio colocado na cena ' + (i + 1) + '.', 'ok'); pintar();
    };
    inp.click();
  }

  // ensaio com a voz do aparelho (prefere a pt-br-x-pte, a mais agradável)
  function vozBoa() {
    const vs = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
    const pt = vs.filter((v) => /^pt[-_]BR/i.test(v.lang));
    return pt.find((v) => /pt-br-x-pte/i.test(v.name + v.voiceURI)) || pt.find((v) => /natural|online|francisco|antonio/i.test(v.name)) || pt.find((v) => !/compact/i.test(v.name)) || pt[0] || null;
  }
  function previa(i) {
    if (!window.speechSynthesis) { H.aviso('Sem voz do aparelho neste navegador.', 'erro'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(H.limpo(H.p.cenas[i].texto).replace(/…/g, '... '));
    u.lang = 'pt-BR'; const v = vozBoa(); if (v) u.voice = v; u.rate = 1;
    speechSynthesis.speak(u);
  }
  if (window.speechSynthesis) speechSynthesis.getVoices();

  H.$('#voz-lista').addEventListener('click', async (e) => {
    const b = e.target.closest('button[data-a]'); if (!b) return;
    const i = +b.closest('.cena').dataset.i, a = b.dataset.a;
    if (a === 'gravar') gravar(i);
    else if (a === 'importar') importar(i);
    else if (a === 'previa') previa(i);
    else if (a === 'tirar') {
      if (!confirm('Tirar a voz da cena ' + (i + 1) + '?')) return;
      const c = H.p.cenas[i]; await H.banco.apagarMidia(c.audioId); c.audioId = ''; await H.salvar(true); pintar();
    }
  });
})(window.H);
