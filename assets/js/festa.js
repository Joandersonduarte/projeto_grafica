/* =========================================================
   MIMÔ PERSONALIZADOS — ENFEITES SAZONAIS

   Lê a campanha ativa (definida em campanha.js) e monta:
     1. a camada de partículas (neve, confete, pétalas…)
     2. o varal do topo (luzes de Natal, bandeirinhas)
     3. o viajante que cruza a tela (trenó, aviãozinho)
     4. a caixa de presente que abre ao entrar no site

   Nada aqui roda quando não há campanha — e quem pediu
   "menos animação" no sistema operacional também fica de fora.
   ========================================================= */
(function () {
  "use strict";

  var C = window.MIMO_CAMPANHA;
  if (!C) return;

  var calmo = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function sorteio(min, max) {
    /* pseudoaleatório simples; só decora, não precisa de rigor */
    return min + Math.random() * (max - min);
  }

  /* =======================================================
     1. PARTÍCULAS
     ======================================================= */
  var FORMAS = {
    floco:
      '<svg viewBox="0 0 24 24" fill="none" stroke="COR" stroke-width="1.6" stroke-linecap="round">' +
      '<path d="M12 2v20M3.4 7l17.2 10M20.6 7 3.4 17"/>' +
      '<path d="M12 6.2 9.6 4M12 6.2 14.4 4M12 17.8 9.6 20M12 17.8 14.4 20"/>' +
      '<path d="m6.6 9.1-3.1-.5M6.6 9.1 5.9 6M17.4 14.9l3.1.5M17.4 14.9l.7 3.1"/>' +
      '<path d="m6.6 14.9-3.1.5M6.6 14.9 5.9 18M17.4 9.1l3.1-.5M17.4 9.1l.7-3.1"/></svg>',
    etiqueta:
      '<svg viewBox="0 0 24 24" fill="COR"><path d="M3.6 11.4 11.4 3.6a2 2 0 0 1 1.4-.6h6.2a2 2 0 0 1 2 2v6.2a2 2 0 0 1-.6 1.4l-7.8 7.8a2 2 0 0 1-2.8 0l-6-6a2 2 0 0 1 0-2.8Z"/>' +
      '<circle cx="16.5" cy="7.5" r="1.7" fill="#fff" opacity=".85"/></svg>',
    petala:
      '<svg viewBox="0 0 24 24" fill="COR"><path d="M12 2c5 4.4 8 8 8 11.2A8 8 0 0 1 4 13.2C4 10 7 6.4 12 2Z"/></svg>',
    confete:
      '<svg viewBox="0 0 24 24" fill="COR"><rect x="6" y="2" width="12" height="20" rx="3"/></svg>',
    lapis:
      '<svg viewBox="0 0 24 24" fill="COR"><path d="M9 2h6v15l-3 5-3-5V2Z"/><path d="M9 2h6v3H9z" fill="#00000030"/></svg>',
    milho:
      '<svg viewBox="0 0 24 24" fill="COR"><ellipse cx="12" cy="11" rx="5" ry="9"/>' +
      '<path d="M12 20c-3 0-5 1.4-5 3h10c0-1.6-2-3-5-3Z" opacity=".55"/></svg>',
    estrela:
      '<svg viewBox="0 0 24 24" fill="COR"><path d="M12 2.5 14.8 9l7 .6-5.3 4.6 1.6 6.9L12 17.4 5.9 21l1.6-6.9L2.2 9.6 9.2 9 12 2.5Z"/></svg>',
    bexiga:
      '<svg viewBox="0 0 24 24" fill="COR"><ellipse cx="12" cy="9" rx="6.4" ry="7.8"/>' +
      '<path d="M10.7 16.4h2.6L12 19l-1.3-2.6Z"/>' +
      '<path d="M12 19c0 1.6 1.8 1.8 1.8 3.4" fill="none" stroke="COR" stroke-width="1.1" stroke-linecap="round"/>' +
      '<ellipse cx="9.6" cy="6.4" rx="1.6" ry="2.3" fill="#fff" opacity=".38"/></svg>'
  };

  function montarParticulas(cfg) {
    var forma = FORMAS[cfg.particula] || FORMAS.confete;
    var camada = el("div", "festa-particulas");
    camada.setAttribute("aria-hidden", "true");

    for (var i = 0; i < cfg.quantidade; i++) {
      var cor = cfg.cores[i % cfg.cores.length];
      var p = el("span", "festa-p", forma.replace(/COR/g, cor));
      p.style.left = sorteio(0, 100).toFixed(2) + "%";
      p.style.width = sorteio(9, 20).toFixed(0) + "px";
      p.style.animationDuration = sorteio(9, 20).toFixed(1) + "s";
      p.style.animationDelay = (-sorteio(0, 20)).toFixed(1) + "s";
      p.style.opacity = sorteio(.45, .95).toFixed(2);
      p.style.setProperty("--giro", sorteio(-360, 360).toFixed(0) + "deg");
      p.style.setProperty("--deriva", sorteio(-70, 70).toFixed(0) + "px");
      camada.appendChild(p);
    }
    return camada;
  }

  /* =======================================================
     2. VARAL DO TOPO
     ======================================================= */
  function montarVaral(tipo) {
    var varal = el("div", "festa-varal festa-varal--" + tipo);
    varal.setAttribute("aria-hidden", "true");

    if (tipo === "luzes") {
      var cores = ["#ff4d4d", "#ffd200", "#4dd37d", "#4db5ff", "#ff7bd1"];
      for (var i = 0; i < 40; i++) {
        var luz = el("span", "festa-luz");
        luz.style.background = cores[i % cores.length];
        luz.style.animationDelay = (i % 5 * .22).toFixed(2) + "s";
        varal.appendChild(luz);
      }
    } else {
      var paleta = tipo === "bandeirinhas"
        ? ["#f0b429", "#c03221", "#2f8f4e", "#2550a8", "#e86c1a"]
        : ["#7139ad", "#2fc2ba", "#f2603f", "#ffd200"];
      for (var j = 0; j < 26; j++) {
        var b = el("span", "festa-bandeira");
        b.style.background = paleta[j % paleta.length];
        b.style.animationDelay = (j * .09).toFixed(2) + "s";
        varal.appendChild(b);
      }
    }
    return varal;
  }

  /* =======================================================
     3. VIAJANTE (atravessa a tela de tempos em tempos)
     ======================================================= */
  var VIAJANTES = {
    treno:
      '<svg viewBox="0 0 220 90" aria-hidden="true">' +
      '<g fill="none" stroke="#f6e7c8" stroke-width="3" stroke-linecap="round">' +
      '<path d="M150 58h44M152 44l10-10M186 44l10-10"/></g>' +
      '<g fill="#f6e7c8">' +
      '<path d="M156 30c6-10 16-12 22-6 5 5 3 14-4 18l-18 10Z"/>' +
      '<path d="M190 30c6-10 16-12 22-6 5 5 3 14-4 18l-18 10Z"/></g>' +
      '<path d="M40 56h74c6 0 10-4 10-10V34a6 6 0 0 0-6-6H70c-8 0-14 5-16 12l-4 16Z" fill="#c62a35"/>' +
      '<path d="M36 56h92c4 0 6 3 4 6-3 4-8 6-13 6H48c-9 0-14-5-12-12Z" fill="#8f1c25"/>' +
      '<path d="M60 26h40l6 12H56l4-12Z" fill="#f0b429"/>' +
      '<circle cx="118" cy="20" r="7" fill="#f6e7c8"/>' +
      '</svg>',
    faixa:
      '<svg viewBox="0 0 260 70" aria-hidden="true">' +
      '<path d="M10 30 52 14v32L10 30Z" fill="#ffffff" opacity=".92"/>' +
      '<path d="M52 20h18v20H52z" fill="#ffd200"/>' +
      '<path d="M74 16h170c6 0 8 4 5 9l-4 6 4 6c3 5 1 9-5 9H74V16Z" fill="#ffffff" opacity=".95"/>' +
      '<text x="158" y="39" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="19" fill="#7139ad">OBRIGADO!</text>' +
      '</svg>',
    cometa:
      '<svg viewBox="0 0 240 90" aria-hidden="true">' +
      '<defs><linearGradient id="cometaRastro" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#e8c86a" stop-opacity="0"/>' +
      '<stop offset="1" stop-color="#f8efd6" stop-opacity=".85"/></linearGradient></defs>' +
      '<path d="M8 52h176c6 0 6 10 0 10H26c-14 0-20-6-18-10Z" fill="url(#cometaRastro)"/>' +
      '<path d="M60 40h120c5 0 5 7 0 7H72c-10 0-14-4-12-7Z" fill="url(#cometaRastro)" opacity=".55"/>' +
      '<circle cx="196" cy="54" r="13" fill="#f8efd6"/>' +
      '<circle cx="196" cy="54" r="21" fill="#e8c86a" opacity=".3"/>' +
      '<path d="M196 30l3.6 14.8L214 48l-14.4 3.2L196 66l-3.6-14.8L178 48l14.4-3.2L196 30Z" fill="#ffffff" opacity=".9"/>' +
      '</svg>',
    pipa:
      '<svg viewBox="0 0 240 90" aria-hidden="true">' +
      '<path d="M110 6 72 44l38 38V6Z" fill="#4a63d8"/>' +
      '<path d="M110 6l38 38-38 38V6Z" fill="#ffc93c"/>' +
      '<g stroke="#ffffff" stroke-width="2" opacity=".65"><path d="M110 6v76M72 44h76"/></g>' +
      '<path d="M110 82c-16 8-26 0-40 8s-24 0-38 6" fill="none" stroke="#ff5c8a" stroke-width="3" stroke-linecap="round"/>' +
      '<g fill="#2fc2ba"><ellipse cx="86" cy="86" rx="5" ry="3"/><ellipse cx="56" cy="90" rx="5" ry="3"/></g>' +
      '</svg>'
  };

  function montarViajante(tipo) {
    var arte = VIAJANTES[tipo];
    if (!arte) return null;
    var v = el("div", "festa-viajante festa-viajante--" + tipo, arte);
    v.setAttribute("aria-hidden", "true");
    return v;
  }

  /* =======================================================
     MONTA A DECORAÇÃO
     ======================================================= */
  var E = C.enfeite;
  if (E && !calmo) {
    var palco = el("div", "festa");
    palco.setAttribute("aria-hidden", "true");
    palco.appendChild(montarParticulas(E));
    if (E.brilho) palco.appendChild(el("span", "festa-brilho"));
    if (E.viajante) {
      var v = montarViajante(E.viajante);
      if (v) palco.appendChild(v);
    }
    document.body.appendChild(palco);

    /* o varal fica no fluxo do topo, logo abaixo do cabeçalho fixo */
    if (E.varal) document.body.appendChild(montarVaral(E.varal));
  }

  /* =======================================================
     4. A CAIXA DE PRESENTE
     ======================================================= */
  var ARTES = {
    presente:
      '<svg viewBox="0 0 160 150">' +
      '<rect x="26" y="62" width="108" height="76" rx="7" fill="#c62a35"/>' +
      '<rect x="70" y="62" width="20" height="76" fill="#f0b429"/>' +
      '<g class="tampa">' +
      '<rect x="18" y="42" width="124" height="26" rx="7" fill="#9e1f28"/>' +
      '<rect x="70" y="42" width="20" height="26" fill="#f0b429"/>' +
      '<path d="M80 42c-16-4-26-12-22-22 3-8 15-6 22 6 7-12 19-14 22-6 4 10-6 18-22 22Z" fill="#f0b429"/>' +
      '</g></svg>',
    "caixa-preta":
      '<svg viewBox="0 0 160 150">' +
      '<rect x="26" y="62" width="108" height="76" rx="7" fill="#17171a"/>' +
      '<rect x="70" y="62" width="20" height="76" fill="#f2c744"/>' +
      '<g class="tampa">' +
      '<rect x="18" y="42" width="124" height="26" rx="7" fill="#09090b"/>' +
      '<rect x="70" y="42" width="20" height="26" fill="#f2c744"/>' +
      '<path d="M80 42c-16-4-26-12-22-22 3-8 15-6 22 6 7-12 19-14 22-6 4 10-6 18-22 22Z" fill="#f2c744"/>' +
      '</g></svg>',
    caderno:
      '<svg viewBox="0 0 160 150">' +
      '<rect x="36" y="24" width="94" height="112" rx="6" fill="#ffffff" stroke="#c9d6e3" stroke-width="2"/>' +
      '<g stroke="#d4e1ea" stroke-width="3"><path d="M56 56h58M56 74h58M56 92h40"/></g>' +
      '<g class="tampa"><rect x="30" y="20" width="76" height="116" rx="6" fill="#2550a8"/>' +
      '<rect x="30" y="20" width="14" height="116" fill="#1a3c80"/>' +
      '<rect x="56" y="58" width="34" height="8" rx="4" fill="#ffc93c"/></g>' +
      '<g fill="#8fa6bd"><circle cx="37" cy="40" r="4"/><circle cx="37" cy="78" r="4"/><circle cx="37" cy="116" r="4"/></g>' +
      '</svg>',
    flor:
      '<svg viewBox="0 0 160 150">' +
      '<path d="M80 150V84" stroke="#2f8f4e" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M80 118c-16 0-26-8-28-20 14-4 26 4 28 20Z" fill="#2f8f4e"/>' +
      '<g class="tampa">' +
      '<circle cx="80" cy="46" r="20" fill="#f3a7c5"/><circle cx="52" cy="66" r="20" fill="#f3a7c5"/>' +
      '<circle cx="108" cy="66" r="20" fill="#f3a7c5"/><circle cx="63" cy="96" r="20" fill="#f3a7c5"/>' +
      '<circle cx="97" cy="96" r="20" fill="#f3a7c5"/></g>' +
      '<circle cx="80" cy="74" r="17" fill="#ffd200"/></svg>',
    pescaria:
      '<svg viewBox="0 0 160 150">' +
      '<path d="M22 132h116" stroke="#8a4c17" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M30 132c0-26 22-44 50-44s50 18 50 44" fill="#f0b429" opacity=".25"/>' +
      '<g class="tampa">' +
      '<path d="M116 16 44 88" stroke="#8a4c17" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M44 88v22" stroke="#c9b28a" stroke-width="3"/>' +
      '<path d="M44 110c-8 0-14 6-14 12s6 12 14 12 14-6 14-12-6-12-14-12Z" fill="#c03221"/>' +
      '<path d="M58 116l12-6v24l-12-6Z" fill="#c03221"/></g>' +
      '</svg>',
    "caixa-ferramenta":
      '<svg viewBox="0 0 160 150">' +
      '<rect x="22" y="70" width="116" height="66" rx="8" fill="#336088"/>' +
      '<rect x="22" y="70" width="116" height="14" fill="#254766"/>' +
      '<g class="tampa">' +
      '<rect x="30" y="48" width="100" height="24" rx="7" fill="#15283c"/>' +
      '<path d="M62 48v-8a18 18 0 0 1 36 0v8" fill="none" stroke="#d9a441" stroke-width="7" stroke-linecap="round"/></g>' +
      '<rect x="66" y="98" width="28" height="10" rx="5" fill="#d9a441"/></svg>',
    espumante:
      '<svg viewBox="0 0 160 150">' +
      '<path d="M66 44h28v16c0 8 14 14 14 26v44a8 8 0 0 1-8 8H60a8 8 0 0 1-8-8V86c0-12 14-18 14-26V44Z" fill="#15402f"/>' +
      '<path d="M66 44h28v16c0 3 2 5 4 8H62c2-3 4-5 4-8V44Z" fill="#0d2b20"/>' +
      '<rect x="56" y="96" width="48" height="30" rx="5" fill="#f8efd6"/>' +
      '<g fill="#b98a2f"><rect x="62" y="104" width="36" height="4" rx="2"/>' +
      '<rect x="68" y="113" width="24" height="3" rx="1.5"/></g>' +
      '<rect x="64" y="38" width="32" height="12" rx="3" fill="#e8c86a"/>' +
      '<g class="tampa">' +
      '<path d="M68 18h24v20H68z" fill="#d9b773"/>' +
      '<rect x="64" y="12" width="32" height="10" rx="5" fill="#e8c86a"/>' +
      '<path d="M80 12V2" stroke="#b98a2f" stroke-width="3" stroke-linecap="round"/>' +
      '</g></svg>',
    "caixa-brinquedo":
      '<svg viewBox="0 0 160 150">' +
      '<rect x="24" y="68" width="112" height="70" rx="10" fill="#4a63d8"/>' +
      '<rect x="24" y="68" width="112" height="13" fill="#3448b0"/>' +
      '<circle cx="48" cy="112" r="10" fill="#2fc2ba"/>' +
      '<rect x="96" y="102" width="20" height="20" rx="5" fill="#ffc93c"/>' +
      '<rect x="68" y="96" width="24" height="10" rx="5" fill="#ffc93c"/>' +
      '<g class="tampa">' +
      '<path d="M20 70c0-23 27-40 60-40s60 17 60 40H20Z" fill="#ff5c8a"/>' +
      '<path d="M80 30V16" stroke="#ffc93c" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M80 2l4.6 9.4 10.4 1.5-7.5 7.3 1.8 10.3L80 25.6l-9.3 4.9 1.8-10.3L65 12.9l10.4-1.5L80 2Z" fill="#ffc93c"/>' +
      '</g></svg>',
    balao:
      '<svg viewBox="0 0 160 150">' +
      '<path d="M80 108v30" stroke="#7139ad" stroke-width="3" fill="none"/>' +
      '<g class="tampa">' +
      '<ellipse cx="80" cy="62" rx="42" ry="50" fill="#f2603f"/>' +
      '<ellipse cx="64" cy="44" rx="11" ry="16" fill="#ffffff" opacity=".35"/>' +
      '<path d="M74 110h12l-6 10-6-10Z" fill="#d44a2c"/></g>' +
      '</svg>'
  };

  var K = C.caixa;
  if (!K) return;

  var chave = "mimo_caixa_" + C.slug;
  var jaResgatado = false;
  try { jaResgatado = !!localStorage.getItem(chave); } catch (e) { /* segue */ }

  /* ---------- o presente que fica no canto superior direito ---------- */
  var presente = el("button", "presente");
  presente.type = "button";
  presente.setAttribute("aria-label", K.titulo + " — " + K.botao);
  presente.innerHTML =
    '<span class="presente__pulso" aria-hidden="true"></span>' +
    '<span class="presente__arte" aria-hidden="true">' + (ARTES[K.arte] || ARTES.presente) + "</span>" +
    '<span class="presente__dica">' + (jaResgatado ? "Ver meu cupom" : "Clique e ganhe") + "</span>";
  document.body.appendChild(presente);

  /* mostra o rótulo por alguns segundos e recolhe; depois só no hover */
  if (!jaResgatado && !calmo) {
    setTimeout(function () { presente.classList.add("is-chamando"); }, 1200);
    setTimeout(function () { presente.classList.remove("is-chamando"); }, 6200);
  }

  var modal = el("div", "caixa");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "caixaTitulo");
  modal.innerHTML =
    '<div class="caixa__fundo" data-fechar></div>' +
    '<div class="caixa__box">' +
      '<button class="caixa__x" type="button" data-fechar aria-label="Fechar">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>' +
      '</button>' +

      '<div class="caixa__palco">' +
        '<button class="caixa__arte" type="button" id="caixaAbrir" aria-label="' + K.botao + '">' +
          (ARTES[K.arte] || ARTES.presente) +
        '</button>' +
        '<div class="caixa__estrelas" aria-hidden="true"></div>' +
      '</div>' +

      '<div class="caixa__antes">' +
        '<p class="caixa__selo">' + C.nome + '</p>' +
        '<h2 class="caixa__titulo" id="caixaTitulo">' + K.titulo + '</h2>' +
        '<p class="caixa__texto">' + K.texto + '</p>' +
        '<button class="btn btn--primary btn--lg" type="button" data-abrir>' + K.botao + '</button>' +
      '</div>' +

      '<div class="caixa__depois" hidden>' +
        '<p class="caixa__selo">Seu presente</p>' +
        '<h2 class="caixa__titulo">' + K.premio + '</h2>' +
        '<p class="caixa__cupomrot">use o cupom</p>' +
        '<p class="caixa__cupom"><span>' + K.cupom + '</span></p>' +
        '<div class="caixa__acoes">' +
          '<a class="btn btn--whats btn--lg" data-zap-caixa>Pegar no WhatsApp</a>' +
          '<button class="btn btn--ghost" type="button" data-fechar>Continuar navegando</button>' +
        '</div>' +
        '<p class="caixa__rodape">Vale enquanto a campanha estiver no ar.</p>' +
      '</div>' +
    '</div>';

  document.body.appendChild(modal);

  /* link do WhatsApp já com o cupom na mensagem.
     O número vem do CONFIG do main.js — não precisa ser trocado aqui. */
  var cfg = window.MIMO_ZAP || { whatsapp: "5581991873132", origem: "site" };
  var btnZap = modal.querySelector("[data-zap-caixa]");
  if (btnZap) {
    btnZap.href = "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(
      "Olá! Vim pelo " + cfg.origem + " da Mimô e abri o presente de " + C.nome +
      ". Quero usar o cupom " + K.cupom + "."
    );
    btnZap.target = "_blank";
    btnZap.rel = "noopener";
  }

  var box = modal.querySelector(".caixa__box");

  function fechar() {
    modal.classList.remove("is-open");
    document.removeEventListener("keydown", aoTeclar);
    presente.focus();
  }
  function aoTeclar(e) { if (e.key === "Escape") fechar(); }

  function revelar() {
    modal.querySelector(".caixa__antes").hidden = true;
    modal.querySelector(".caixa__depois").hidden = false;
    var alvo = modal.querySelector("[data-zap-caixa]");
    if (alvo) alvo.focus();
  }

  function abrir() {
    box.classList.add("is-aberta");
    presente.classList.add("is-resgatado");
    presente.querySelector(".presente__dica").textContent = "Ver meu cupom";
    jaResgatado = true;
    try { localStorage.setItem(chave, "1"); } catch (e) { /* segue */ }

    if (calmo) { revelar(); return; }

    /* chuva de confete dentro do painel */
    var palco = modal.querySelector(".caixa__estrelas");
    palco.innerHTML = "";
    var cores = (C.enfeite && C.enfeite.cores) || ["#ffd200", "#f2603f", "#2fc2ba"];
    for (var i = 0; i < 26; i++) {
      var c = el("i");
      c.style.background = cores[i % cores.length];
      c.style.left = sorteio(4, 96).toFixed(1) + "%";
      c.style.animationDelay = sorteio(0, .5).toFixed(2) + "s";
      c.style.setProperty("--giro", sorteio(-320, 320).toFixed(0) + "deg");
      palco.appendChild(c);
    }
    setTimeout(revelar, 620);
  }

  /* o presente abre o painel; quem já resgatou vê o cupom direto */
  presente.addEventListener("click", function () {
    modal.classList.add("is-open");
    document.addEventListener("keydown", aoTeclar);

    if (jaResgatado) {
      box.classList.add("is-aberta");
      revelar();
      return;
    }
    /* um clique só: o painel entra e o presente se abre sozinho */
    setTimeout(abrir, 260);
  });

  modal.addEventListener("click", function (e) {
    if (e.target.closest("[data-fechar]")) { fechar(); return; }
    if (e.target.closest("[data-abrir]") || e.target.closest("#caixaAbrir")) { abrir(); }
  });
})();
