/* =========================================================
   MIMÔ PERSONALIZADOS — scripts do site
   ========================================================= */
(function () {
  "use strict";

  /* -------------------------------------------------------
     CONFIGURAÇÃO — o WhatsApp que recebe todos os pedidos do site
     ------------------------------------------------------- */
  var CONFIG = {
    whatsapp: "5581991873132", // DDI + DDD + número, só dígitos
    origem: "site"             // entra na mensagem para identificar a origem do contato
  };

  /* o festa.js também precisa montar link de WhatsApp (botão do presente),
     então o número fica disponível para ele a partir daqui */
  window.MIMO_ZAP = CONFIG;

  function zap(msg) {
    return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg);
  }
  function brl(v) {
    return "R$ " + v.toFixed(2).replace(".", ",");
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var ICON_ZAP =
    '<svg viewBox="0 0 448 512" fill="currentColor" aria-hidden="true"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 110.9L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 222-99.6 222-222 0-59.3-23.1-115-65-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>';

  var ICON_CLOCK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg>';

  /* A home fica na raiz e as outras páginas numa subpasta, então o caminho
     das fotos muda. Em vez de repetir a lista em cada página, descobrimos o
     prefixo a partir do próprio <script> que carregou este arquivo. */
  var BASE = (function () {
    var s = document.querySelector('script[src*="assets/js/main.js"]');
    return s ? s.getAttribute("src").replace(/assets\/js\/main\.js.*$/, "") : "";
  })();

  /* Aceita um nome de arquivo (foto única) ou uma lista de nomes.
     Com mais de uma foto, embrulha num .shots e a peça fica alternando
     sozinha entre elas (ver mais abaixo). Com uma só, o resultado é
     visualmente idêntico ao de antes.

     Nenhuma das fotos leva loading="lazy": são JPGs pequenos (a soma de
     todas não passa de poucos MB), e uma foto adiada é exatamente o que
     gera um card em branco — seja a primeira, que devia aparecer junto
     com o card, seja a de trás, que pode nunca ter sido buscada quando
     a vez dela chegar no revezamento. */
  function fotos(arquivos, alt) {
    var lista = Array.isArray(arquivos) ? arquivos : [arquivos];
    var tags = lista.map(function (arq, i) {
      return '<img src="' + BASE + "assets/img/" + arq + '" alt="' + esc(alt) + '"' +
        (i === 0 ? ' class="is-active"' : "") +
        ' decoding="async">';
    }).join("");
    return '<div class="shots">' + tags + "</div>";
  }

  /* -------------------------------------------------------
     CATÁLOGO
     Preço e prazo são opcionais: sem eles o card mostra
     "Sob orçamento", que é o certo enquanto o valor depender
     da quantidade e da personalização.
     ------------------------------------------------------- */
  var PRODUTOS = [
    {
      nome: "Caixa de joias dos noivos", flag: "Mais pedido", hot: true,
      img: ["caixa-joias-noivos.jpg", "caixa-joias-noivos-2.jpg"],
      specs: [
        "Forro interno aveludado",
        "Nomes e data gravados na tampa",
        "Rosa, nude ou branca"
      ]
    },
    {
      nome: "Copo térmico padrinho e madrinha", flag: "Padrinhos", hot: false,
      img: ["copos-padrinho-madrinha.jpg", "copos-padrinho-madrinha-2.jpg", "copos-padrinho-madrinha-3.jpg", "copos-padrinho-madrinha-4.jpg"],
      specs: [
        "Inox de parede dupla, com tampa",
        "Nome de cada padrinho e madrinha",
        "Segura a temperatura por horas"
      ]
    },
    {
      nome: "Kit madrinha", flag: "", hot: false,
      img: ["kit-madrinha.jpg", "kit-madrinha-2.jpg"],
      specs: [
        "Chinelo, necessaire e ecobag",
        "Nome de cada uma nas três peças",
        "Monte o kit com as peças que quiser"
      ]
    },
    {
      nome: "Quebra-cabeça com foto do casal", flag: "", hot: false,
      img: ["quebra-cabeca-casal.jpg", "quebra-cabeca-casal-2.jpg"],
      specs: [
        "A foto de vocês impressa em alta",
        "Nomes e data da cerimônia",
        "Vai com caixa personalizada"
      ]
    },
    {
      nome: "Quadro com código do Spotify", flag: "", hot: false,
      img: ["quadro-spotify.jpg", "quadro-spotify-2.jpg"],
      specs: [
        "A música de vocês em código escaneável",
        "Moldura branca ou madeira natural",
        "20 × 20 cm ou 30 × 30 cm"
      ]
    },
    {
      nome: "Placa de cavalete", flag: "Para a cerimônia", hot: false,
      img: ["placa-livro-memorias.jpg", "placa-livro-memorias-2.jpg"],
      specs: [
        "\"Assine nosso livro de memórias\" ou texto livre",
        "Acompanha o cavalete de madeira",
        "A4 ou A3"
      ]
    },
    {
      nome: "Taça gravada", flag: "", hot: false,
      img: ["taca-gravada.jpg", "taca-gravada-2.jpg"],
      specs: [
        "Gravação permanente, não sai na lavagem",
        "Silhueta dos noivos, nomes e data",
        "Avulsa ou em par"
      ]
    },
    {
      nome: "Ecobag personalizada", flag: "", hot: false,
      img: ["ecobag-noivos.jpg", "ecobag-noivos-2.jpg"],
      specs: [
        "Algodão cru com alça reforçada",
        "Monograma, nomes e data",
        "A partir de 10 unidades"
      ]
    },
    {
      nome: "Caixa de joias com laço", flag: "", hot: false,
      img: ["caixa-joias-laco.jpg", "caixa-joias-laco-2.jpg"],
      specs: [
        "Estojo de viagem com divisórias",
        "Nome gravado na tampa",
        "Entregue embalada, com laço de cetim"
      ]
    },
    {
      nome: "Pratinho com nome", flag: "", hot: false,
      img: ["pratinhos-nomes.jpg", "pratinhos-nomes-2.jpg"],
      specs: [
        "Cerâmica com borda dourada",
        "Nome e arte floral",
        "Lembrancinha de mesa ou porta-joias"
      ]
    },
    {
      nome: "Vaso lembrancinha", flag: "", hot: false,
      img: ["vaso-lembrancinha.jpg", "vaso-lembrancinha-2.jpg"],
      specs: [
        "Cachepô com suculenta",
        "Nomes, data e recado dos noivos",
        "A partir de 20 unidades"
      ]
    },
    {
      nome: "Copo long drink", flag: "", hot: false,
      img: ["copos-long-drink.jpg", "copos-long-drink-2.jpg"],
      specs: [
        "500 ml, acrílico resistente",
        "Nomes, data e arte à sua escolha",
        "A partir de 20 unidades"
      ]
    },
    {
      nome: "Bóton personalizado", flag: "Linha cristã", hot: false,
      img: ["boton-cristao.jpg", "boton-cristao-2.jpg"],
      specs: [
        "Metal com acabamento brilhante",
        "Versículo, logo do ministério ou arte sua",
        "38, 45 ou 55 mm"
      ]
    },
    {
      nome: "Camiseta personalizada", flag: "", hot: false,
      img: ["camiseta-jesus.jpg", "camiseta-jesus-2.jpg"],
      specs: [
        "Algodão fio 30.1, estampa em DTF",
        "Frase, versículo ou arte própria",
        "P ao GG, a partir de 1 peça"
      ]
    }
  ];

  /* -------------------------------------------------------
     GALERIA
     As fotos são mockups do produto, não registros de entrega:
     por isso não há nome de cliente nem data. O filtro se monta
     sozinho a partir do campo "cat".
     ------------------------------------------------------- */
  var GALERIA = [
    {
      titulo: "Caixa de joias dos noivos", cat: "Casamento",
      texto: "Com os nomes e a data gravados na tampa, forro aveludado por dentro.",
      tags: ["Casamento", "Gravação"], img: ["caixa-joias-noivos.jpg", "caixa-joias-noivos-2.jpg"]
    },
    {
      titulo: "Quebra-cabeça com foto", cat: "Casamento",
      texto: "A foto do casal virando lembrança de montar, com caixa personalizada.",
      tags: ["Casamento", "Foto"], img: ["quebra-cabeca-casal.jpg", "quebra-cabeca-casal-2.jpg"]
    },
    {
      titulo: "Quadro com código do Spotify", cat: "Casamento",
      texto: "A música de vocês em código escaneável, emoldurada para a parede.",
      tags: ["Casamento", "Quadro"], img: ["quadro-spotify.jpg", "quadro-spotify-2.jpg"]
    },
    {
      titulo: "Placa de cavalete", cat: "Casamento",
      texto: "Convite para assinar o livro de memórias, pronta para a entrada da festa.",
      tags: ["Cerimônia", "Placa"], img: ["placa-livro-memorias.jpg", "placa-livro-memorias-2.jpg"]
    },
    {
      titulo: "Taça gravada", cat: "Casamento",
      texto: "Gravação permanente com a silhueta dos noivos, os nomes e a data.",
      tags: ["Casamento", "Gravação"], img: ["taca-gravada.jpg", "taca-gravada-2.jpg"]
    },
    {
      titulo: "Ecobag dos noivos", cat: "Casamento",
      texto: "Algodão cru com monograma, para quem quer lembrança que se usa.",
      tags: ["Casamento", "Tecido"], img: ["ecobag-noivos.jpg", "ecobag-noivos-2.jpg"]
    },
    {
      titulo: "Copos de padrinho e madrinha", cat: "Padrinhos e madrinhas",
      texto: "Inox de parede dupla com o nome de cada um, no convite ou no agradecimento.",
      tags: ["Padrinhos", "Inox"], img: ["copos-padrinho-madrinha.jpg", "copos-padrinho-madrinha-2.jpg", "copos-padrinho-madrinha-3.jpg"]
    },
    {
      titulo: "Kit madrinha", cat: "Padrinhos e madrinhas",
      texto: "Chinelo, necessaire e ecobag com o nome dela nas três peças.",
      tags: ["Padrinhos", "Kit"], img: ["kit-madrinha.jpg", "kit-madrinha-2.jpg"]
    },
    {
      titulo: "Caixa de joias com laço", cat: "Padrinhos e madrinhas",
      texto: "Estojo de viagem com divisórias, entregue embalado e pronto para presentear.",
      tags: ["Padrinhos", "Presente"], img: ["caixa-joias-laco.jpg", "caixa-joias-laco-2.jpg"]
    },
    {
      titulo: "Pratinhos com nome", cat: "Lembrancinhas",
      texto: "Cerâmica com borda dourada e arte floral, um para cada convidada.",
      tags: ["Lembrancinha", "Cerâmica"], img: ["pratinhos-nomes.jpg", "pratinhos-nomes-2.jpg"]
    },
    {
      titulo: "Vasinho de suculenta", cat: "Lembrancinhas",
      texto: "Cachepô com o recado dos noivos — a lembrança que continua crescendo.",
      tags: ["Lembrancinha", "Plantas"], img: ["vaso-lembrancinha.jpg", "vaso-lembrancinha-2.jpg"]
    },
    {
      titulo: "Copos long drink", cat: "Lembrancinhas",
      texto: "500 ml com nomes e data, para a pista e para levar para casa depois.",
      tags: ["Lembrancinha", "Festa"], img: ["copos-long-drink.jpg", "copos-long-drink-2.jpg"]
    },
    {
      titulo: "Bótons com versículo", cat: "Linha cristã",
      texto: "Metal brilhante com versículo, logo do ministério ou arte da sua igreja.",
      tags: ["Linha cristã", "Bóton"], img: ["boton-cristao.jpg", "boton-cristao-2.jpg"]
    },
    {
      titulo: "Camiseta com frase", cat: "Linha cristã",
      texto: "Algodão fio 30.1 com estampa em DTF, de uma peça em diante.",
      tags: ["Linha cristã", "Camiseta"], img: ["camiseta-jesus.jpg", "camiseta-jesus-2.jpg"]
    }
  ];

  /* -------------------------------------------------------
     CAMPANHA SAZONAL (definida em campanha.js)
     ------------------------------------------------------- */
  var CAMPANHA = window.MIMO_CAMPANHA || null;
  var OFF = CAMPANHA && CAMPANHA.desconto > 0 ? CAMPANHA.desconto : 0;

  function comDesconto(v) {
    return OFF ? v * (1 - OFF / 100) : v;
  }

  /* faixa no topo da página */
  if (CAMPANHA) {
    var faixa = document.createElement("div");
    faixa.className = "promo";
    faixa.setAttribute("role", "status");
    /* a data e o cupom saíram da faixa: o cronômetro já cria a urgência,
       e o cupom chega pronto na mensagem do WhatsApp quando o cliente
       clica em qualquer botão — não precisa repetir aqui */
    faixa.innerHTML =
      '<span class="promo__tag">' + esc(CAMPANHA.nome) + "</span>" +
      "<strong>" + esc(CAMPANHA.chamada) + "</strong>" +
      '<span class="promo__timer" id="promoTimer" aria-hidden="true"></span>';
    document.body.insertBefore(faixa, document.body.firstChild);
    contagemRegressiva();
  }

  /* -------------------------------------------------------
     CRONÔMETRO DA FAIXA
     Conta para trás até o último segundo do dia de término da
     campanha e, ao chegar a zero, recarrega a página — que então
     volta sem faixa, sem tema e sem enfeites, porque o
     campanha.js não vai mais achar nenhuma campanha valendo.
     ------------------------------------------------------- */
  function contagemRegressiva() {
    var alvo = document.getElementById("promoTimer");
    if (!alvo || !CAMPANHA.fimEm) { return; }

    /* A diferença entre o relógio real e o de Brasília é constante.
       Guardamos o desvio no primeiro tique e somamos a cada segundo,
       em vez de reconverter o fuso 1× por segundo. */
    var desvio = CAMPANHA.agoraEm.getTime() - Date.now();
    var fim = CAMPANHA.fimEm.getTime();

    function doisDigitos(n) { return (n < 10 ? "0" : "") + n; }

    function tique() {
      var falta = fim - (Date.now() + desvio);

      if (falta <= 0) {
        clearInterval(relogio);
        alvo.textContent = "";
        /* em modo de teste a campanha foi ligada à mão e continuaria
           ligada depois do reload: recarregar aqui seria um laço */
        if (!CAMPANHA.forcada) { location.reload(); }
        return;
      }

      var s = Math.floor(falta / 1000);
      var dias = Math.floor(s / 86400);
      var h = Math.floor((s % 86400) / 3600);
      var m = Math.floor((s % 3600) / 60);
      var seg = s % 60;

      alvo.textContent = "termina em " + (dias ? dias + "d " : "") +
        doisDigitos(h) + ":" + doisDigitos(m) + ":" + doisDigitos(seg);
    }

    /* relógio adiantado ou campanha já vencida: não mostra nem recarrega */
    if (fim - (Date.now() + desvio) <= 0) { return; }

    tique();
    var relogio = setInterval(tique, 1000);
  }

  /* -------------------------------------------------------
     RENDER — produtos
     ------------------------------------------------------- */
  var elProds = document.getElementById("lista-produtos");
  if (elProds) {
    elProds.innerHTML = PRODUTOS.map(function (p) {
      var temPreco = typeof p.preco === "number";
      var msg = "Olá! Vim pelo " + CONFIG.origem + " da Mimô e quero orçamento de: " +
        p.nome + " (" + p.specs.join(" / ") + ")." +
        (CAMPANHA && CAMPANHA.cupom ? " Vi a promoção " + CAMPANHA.nome + " (cupom " + CAMPANHA.cupom + ")." : "");

      /* sem preço na lista, o card assume o orçamento pelo WhatsApp —
         e aí não há valor para a campanha descontar */
      var bloco;
      if (temPreco) {
        bloco = '<p class="prod__price">' +
          (OFF ? '<span class="prod__de">de ' + brl(p.preco) + "</span>" : "") +
          (OFF ? "por" : "a partir de") +
          "<strong>" + brl(comDesconto(p.preco)) + (p.unidade ? "<span>" + esc(p.unidade) + "</span>" : "") + "</strong>" +
        "</p>";
      } else {
        bloco = '<p class="prod__price prod__price--sob">' +
          "<strong>Sob orçamento</strong>" +
          "o valor muda com a quantidade e a personalização" +
        "</p>";
      }

      return '<article class="prod reveal">' +
        '<div class="prod__art">' +
          (p.flag ? '<span class="prod__flag' + (p.hot ? " prod__flag--hot" : "") + '">' + esc(p.flag) + "</span>" : "") +
          (OFF && temPreco ? '<span class="prod__off">-' + OFF + "%</span>" : "") +
          fotos(p.img, p.nome) +
        "</div>" +
        '<div class="prod__body">' +
          '<h3 class="prod__title">' + esc(p.nome) + "</h3>" +
          '<ul class="prod__specs">' + p.specs.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>" +
          bloco +
          (p.prazo ? '<p class="prod__prazo">' + ICON_CLOCK + "Pronto em " + esc(p.prazo) + "</p>" : "") +
          '<a class="btn btn--whats btn--block" href="' + zap(msg) + '" target="_blank" rel="noopener">' +
            ICON_ZAP + "Pedir orçamento</a>" +
        "</div>" +
      "</article>";
    }).join("");
  }

  /* -------------------------------------------------------
     RENDER — galeria + filtros
     ------------------------------------------------------- */
  var elWorks = document.getElementById("lista-galeria");
  if (elWorks) {
    elWorks.innerHTML = GALERIA.map(function (t) {
      return '<article class="work reveal" data-cat="' + esc(t.cat) + '">' +
        '<div class="work__art">' + fotos(t.img, t.titulo) + "</div>" +
        '<div class="work__body">' +
          '<h3 class="work__title">' + esc(t.titulo) + "</h3>" +
          '<p class="work__text">' + esc(t.texto) + "</p>" +
          '<ul class="chips">' + t.tags.map(function (g) { return "<li>" + esc(g) + "</li>"; }).join("") + "</ul>" +
        "</div>" +
      "</article>";
    }).join("");

    var elFilters = document.getElementById("filtros");
    if (elFilters) {
      var cats = ["Todos"];
      GALERIA.forEach(function (p) { if (cats.indexOf(p.cat) < 0) cats.push(p.cat); });

      elFilters.innerHTML = cats.map(function (c, i) {
        return '<button class="filter" type="button" data-cat="' + esc(c) + '" aria-pressed="' + (i === 0) + '">' + esc(c) + "</button>";
      }).join("");

      elFilters.addEventListener("click", function (e) {
        var btn = e.target.closest(".filter");
        if (!btn) return;
        var alvo = btn.getAttribute("data-cat");
        Array.prototype.forEach.call(elFilters.children, function (f) {
          f.setAttribute("aria-pressed", String(f === btn));
        });
        Array.prototype.forEach.call(elWorks.children, function (card) {
          var mostra = alvo === "Todos" || card.getAttribute("data-cat") === alvo;
          card.classList.toggle("is-hidden", !mostra);
        });
      });
    }
  }

  /* -------------------------------------------------------
     FOTOS ALTERNANDO (.shots)
     Só peças com mais de uma foto real alternam — nada de fingir
     variedade trocando a mesma imagem por ela mesma. Respeita quem
     pede menos movimento no sistema: nesse caso a primeira foto
     fica parada, do jeito que já era antes desse recurso existir.
     ------------------------------------------------------- */
  var reduzMovimento = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduzMovimento) {
    Array.prototype.forEach.call(document.querySelectorAll(".shots"), function (grupo) {
      var imgs = grupo.querySelectorAll("img");
      if (imgs.length < 2) { return; }

      var atual = 0;
      /* troca a cada ~4s, com uma folga aleatória para os cards não
         piscarem todos no mesmo instante */
      setInterval(function () {
        imgs[atual].classList.remove("is-active");
        atual = (atual + 1) % imgs.length;
        imgs[atual].classList.add("is-active");
      }, 3600 + Math.random() * 1400);
    });
  }

  /* -------------------------------------------------------
     LINKS DE WHATSAPP
     ------------------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-zap]"), function (a) {
    var texto = a.getAttribute("data-zap").replace("pelo site", "pelo " + CONFIG.origem);
    if (CAMPANHA && CAMPANHA.cupom) {
      texto += " Vi a promoção " + CAMPANHA.nome + " (cupom " + CAMPANHA.cupom + ").";
    }
    a.href = zap(texto);
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* -------------------------------------------------------
     HEADER + VOLTAR AO TOPO
     ------------------------------------------------------- */
  var header = document.getElementById("header");
  var toTop = document.getElementById("toTop");

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 20);
    if (toTop) toTop.classList.toggle("is-visible", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* -------------------------------------------------------
     MENU MOBILE
     ------------------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var aberto = nav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", aberto);
      navToggle.setAttribute("aria-expanded", String(aberto));
      navToggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
      document.body.classList.toggle("sem-scroll", aberto);
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("sem-scroll");
      }
    });
  }

  /* -------------------------------------------------------
     REVEAL + SCROLLSPY
     ------------------------------------------------------- */
  var reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var obsReveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          obsReveal.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    Array.prototype.forEach.call(reveals, function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 80) + "ms";
      obsReveal.observe(el);
    });

    var spyLinks = Array.prototype.filter.call(
      document.querySelectorAll(".nav__link"),
      function (l) { return (l.getAttribute("href") || "").charAt(0) === "#"; }
    );
    var alvos = spyLinks
      .map(function (l) { return document.querySelector(l.getAttribute("href")); })
      .filter(Boolean);

    if (alvos.length) {
      var obsSpy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          spyLinks.forEach(function (l) {
            l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id);
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      alvos.forEach(function (s) { obsSpy.observe(s); });
    }
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add("is-visible"); });
  }

  /* -------------------------------------------------------
     HORÁRIO — marca o dia de hoje e diz se a loja está aberta
     ------------------------------------------------------- */
  var listaHoras = document.getElementById("horarios");
  var selo = document.getElementById("statusLoja");

  if (listaHoras && selo) {
    var agora = new Date();
    var diaSemana = agora.getDay();                            // 0 = domingo
    var minutos = agora.getHours() * 60 + agora.getMinutes();

    var hoje = listaHoras.querySelector('[data-dia="' + diaSemana + '"]');
    if (hoje) hoje.classList.add("is-today");

    var abre = hoje ? parseInt(hoje.getAttribute("data-abre"), 10) : NaN;
    var fecha = hoje ? parseInt(hoje.getAttribute("data-fecha"), 10) : NaN;
    var aberto = !isNaN(abre) && !isNaN(fecha) && minutos >= abre && minutos < fecha;

    selo.className = "status " + (aberto ? "status--open" : "status--closed");
    selo.innerHTML = '<span class="status__dot"></span>' + (aberto ? "Aberto agora" : "Fechado agora");
    selo.hidden = false;
  }
})();

