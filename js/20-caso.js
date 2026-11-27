/* Estúdio de Histórias — 20-caso.js: contar o caso (falando ou escrevendo) e pedir o roteiro à IA. */
(function (H) {
  const CAMPOS = ['titulo', 'relato', 'estilo', 'duracao', 'formato'];

  H.on('projeto', () => {
    CAMPOS.forEach((c) => { H.$('#' + c).value = H.p[c] || (c === 'formato' ? 'vertical' : ''); });
    if (!H.p.estilo) H.$('#estilo').value = 'historia';
    if (!H.p.duracao) H.$('#duracao').value = 'medio';
    H.$('#sigilo').checked = H.p.sigilo !== false;
  });
  CAMPOS.forEach((c) => H.$('#' + c).addEventListener('input', () => {
    H.p[c] = H.$('#' + c).value; H.salvar();
    if (c === 'titulo') H.emit('titulo');
  }));
  H.$('#sigilo').addEventListener('change', () => { H.p.sigilo = H.$('#sigilo').checked; H.salvar(); });

  // 🎤 falar (o celular escreve o que você fala)
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null, ligado = false;
  function parar() { ligado = false; try { rec && rec.stop(); } catch (e) {} H.$('#bt-falar').textContent = '🎤 Falar'; H.$('#bt-falar').classList.remove('gravando'); H.$('#falar-status').textContent = ''; }
  H.$('#bt-falar').onclick = () => {
    if (!Rec) { H.aviso('Este navegador não escreve o que você fala. Use o teclado com o microfone do teclado (o 🎤 do Gboard).', 'erro', 6000); return; }
    if (ligado) return parar();
    rec = new Rec(); rec.lang = 'pt-BR'; rec.continuous = true; rec.interimResults = true;
    const ta = H.$('#relato'); let base = ta.value;
    rec.onresult = (ev) => {
      let fim = '', meio = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const t = ev.results[i][0].transcript;
        if (ev.results[i].isFinal) fim += t; else meio += t;
      }
      if (fim) { base = (base + (base && !/\s$/.test(base) ? ' ' : '') + fim.trim()).replace(/\s+([,.!?])/g, '$1'); }
      ta.value = base + (meio ? ' ' + meio : '');
      H.p.relato = base; H.salvar();
    };
    rec.onerror = (e) => { if (e.error === 'not-allowed') { H.aviso('O microfone foi bloqueado. Libere o microfone para este app.', 'erro', 6000); parar(); } };
    rec.onend = () => { if (ligado) { base = ta.value; try { rec.start(); } catch (e) { parar(); } } };
    try { rec.start(); ligado = true; } catch (e) { H.aviso('Não consegui ligar o microfone.', 'erro'); return; }
    H.$('#bt-falar').textContent = '⏹ Parar'; H.$('#bt-falar').classList.add('gravando');
    H.$('#falar-status').textContent = 'Ouvindo… pode falar à vontade.';
  };
  H.on('aba', (n) => { if (n !== 'caso' && ligado) parar(); });

  // 🪄 roteiro
  const ESTILOS = {
    historia: 'história emocionante e envolvente, contada como um caso real, com começo que prende, tensão, virada e desfecho',
    explicacao: 'explicação simples de um direito, para leigos, usando o caso como exemplo, sem juridiquês',
    curiosidade: 'curiosidade jurídica surpreendente, ritmo rápido, com uma revelação no final',
    vida: 'história de vida pessoal, contada em primeira pessoa, sincera e humana'
  };
  const TAMANHOS = { curto: '5 a 7 cenas, cerca de 150 palavras no total (1 minuto)', medio: '9 a 13 cenas, cerca de 430 palavras no total (3 minutos)', longo: '16 a 22 cenas, cerca de 850 palavras no total (6 minutos)' };

  function sistema(p) {
    return [
      'Você é um roteirista brasileiro de vídeos para YouTube. Escreve em português do Brasil, natural, para ser NARRADO em voz alta.',
      'Estilo: ' + ESTILOS[p.estilo || 'historia'] + '.',
      'Tamanho: ' + TAMANHOS[p.duracao || 'medio'] + '.',
      'O narrador é um advogado que conta casos. Frases curtas, fáceis de falar, sem siglas difíceis (escreva por extenso na primeira vez).',
      'Marque ÊNFASE com *asteriscos* em volta da palavra (poucas por cena) e PAUSA com reticências (…).',
      'A primeira cena precisa prender a atenção nos primeiros 5 segundos. A última fecha a história e chama para se inscrever no canal de forma leve.',
      p.sigilo !== false ? 'SIGILO: troque TODOS os nomes de pessoas, cidades pequenas, empresas, números de processo e qualquer detalhe que identifique o cliente. Use nomes fictícios comuns.' : '',
      'NUNCA invente número de lei, artigo, súmula, processo ou jurisprudência. Só cite norma ou decisão se ela estiver no relato. Se precisar, fale de forma geral ("a lei garante…").',
      'Para cada cena, descreva a imagem de fundo (em português) e dê palavras de busca em INGLÊS para banco de imagens grátis (ex.: "old farmer hands", "courtroom").',
      'Responda SOMENTE com JSON neste formato: {"titulo":"título chamativo do vídeo","descricao":"descrição para o YouTube, 2 a 4 frases","cenas":[{"texto":"o que o narrador fala","imagem":"descrição da imagem","busca":"english keywords"}]}'
    ].filter(Boolean).join('\n');
  }

  H.$('#bt-roteiro').onclick = async () => {
    const p = H.p, st = H.$('#roteiro-status');
    if (ligado) parar();
    if ((p.relato || '').trim().length < 40) { H.aviso('Conte um pouco mais do caso (pelo menos umas duas frases).', 'erro'); return; }
    if (!H.ia.pronta()) { H.aviso('Primeiro coloque a chave da IA em ⚙️ Config.', 'erro', 5000); H.abrirAba('config'); return; }
    if (p.cenas.length && !confirm('Já existe um roteiro. Fazer outro no lugar? (as gravações e imagens das cenas atuais ficam guardadas no aparelho, mas saem do roteiro)')) return;
    const bt = H.$('#bt-roteiro'); bt.disabled = true; st.textContent = '⏳ A IA está escrevendo o roteiro…';
    try {
      const r = H.ia.lerJSON(await H.ia.pedir(sistema(p), 'RELATO DO CASO:\n' + p.relato.trim(), true));
      const cenas = Array.isArray(r.cenas) ? r.cenas.filter((c) => c && String(c.texto || '').trim()) : [];
      if (!cenas.length) throw new Error('A IA não mandou nenhuma cena. Tente de novo.');
      p.roteiro = { titulo: String(r.titulo || ''), descricao: String(r.descricao || '') };
      p.cenas = cenas.map((c) => H.novaCena(String(c.texto).trim(), String(c.busca || '').trim(), String(c.imagem || '').trim()));
      if (!p.titulo && r.titulo) { p.titulo = String(r.titulo); H.$('#titulo').value = p.titulo; H.emit('titulo'); }
      await H.salvar(true);
      st.textContent = '✅ Roteiro pronto: ' + p.cenas.length + ' cenas.';
      H.emit('cenas'); H.abrirAba('roteiro');
    } catch (e) {
      st.textContent = '❌ ' + e.message;
    } finally { bt.disabled = false; }
  };
})(window.H);
