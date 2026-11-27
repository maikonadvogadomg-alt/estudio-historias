/* Estúdio de Histórias — 10-ia.js: chama a IA (Gemini, Groq, OpenRouter ou compatível). */
(function (H) {
  const PADRAO = { gemini: 'gemini-2.5-flash', groq: 'llama-3.3-70b-versatile', openrouter: 'google/gemini-2.5-flash', compat: '' };
  const URLS = { groq: 'https://api.groq.com/openai/v1', openrouter: 'https://openrouter.ai/api/v1' };
  H.ia = {
    config() { return H.pref.get('ia', { prov: 'gemini', chave: '', modelo: '', url: '' }); },
    pronta() { const c = this.config(); return !!c.chave && (c.prov !== 'compat' || !!c.url); },
    async pedir(sistema, texto, json) {
      const c = this.config();
      if (!c.chave) throw new Error('Falta a chave da IA. Vá em ⚙️ Config e cole a chave.');
      const modelo = c.modelo || PADRAO[c.prov];
      let r;
      try {
        if (c.prov === 'gemini') {
          r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(modelo) + ':generateContent?key=' + encodeURIComponent(c.chave), {
            method: 'POST', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ systemInstruction: { parts: [{ text: sistema }] }, contents: [{ role: 'user', parts: [{ text: texto }] }],
              generationConfig: Object.assign({ temperature: 0.8 }, json ? { responseMimeType: 'application/json' } : {}) })
          });
        } else {
          const base = (c.prov === 'compat' ? c.url : URLS[c.prov]).replace(/\/+$/, '');
          if (!modelo) throw new Error('Escreva o nome do modelo em ⚙️ Config.');
          r = await fetch(base + '/chat/completions', {
            method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + c.chave },
            body: JSON.stringify(Object.assign({ model: modelo, temperature: 0.8, messages: [{ role: 'system', content: sistema }, { role: 'user', content: texto }] },
              json && c.prov !== 'compat' ? { response_format: { type: 'json_object' } } : {}))
          });
        }
      } catch (e) {
        throw new Error('Não consegui falar com a IA (internet ou bloqueio do navegador). Confira a internet e tente de novo.');
      }
      const txt = await r.text(); let d = null; try { d = JSON.parse(txt); } catch (e) {}
      if (!r.ok) {
        const m = (d && (d.error && (d.error.message || d.error))) || txt.slice(0, 200);
        if (r.status === 401 || r.status === 403) throw new Error('A chave foi recusada (' + r.status + '). Confira a chave em ⚙️ Config.');
        if (r.status === 429) throw new Error('A cota da IA acabou por agora (429). Espere um pouco ou use outra chave.');
        throw new Error('A IA respondeu com erro ' + r.status + ': ' + (typeof m === 'string' ? m : JSON.stringify(m)).slice(0, 200));
      }
      const saida = c.prov === 'gemini'
        ? ((d && d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts) || []).map((p) => p.text || '').join('')
        : (d && d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content) || '';
      if (!saida.trim()) throw new Error('A IA respondeu vazio. Tente de novo.');
      return saida;
    },
    // tira o JSON de dentro da resposta, mesmo se vier com texto em volta
    lerJSON(t) {
      t = String(t || '').replace(/^```(?:json)?/i, '').replace(/```\s*$/, '').trim();
      try { return JSON.parse(t); } catch (e) {}
      const i = t.indexOf('{'), f = t.lastIndexOf('}');
      if (i >= 0 && f > i) { try { return JSON.parse(t.slice(i, f + 1)); } catch (e) {} }
      throw new Error('A IA não devolveu o roteiro no formato certo. Toque em "Fazer o roteiro" de novo.');
    }
  };
})(window.H);
