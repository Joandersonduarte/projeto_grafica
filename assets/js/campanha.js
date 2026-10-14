/* =========================================================
   MIMÔ PERSONALIZADOS — CAMPANHAS SAZONAIS

   Carregado no <head>, ANTES do corpo da página, para que o tema
   seja carimbado em <html> sem a página piscar na cor errada.

   Para criar uma campanha, basta acrescentar um item na lista
   abaixo. Nada mais no site precisa mudar.

   Datas aceitas:
     "MM-DD"       → repete todo ano  (ex.: "12-01")
     "AAAA-MM-DD"  → só naquele ano   (ex.: "2026-11-20")
   Um intervalo pode virar o ano ("12-26" a "01-05").

   Para feriado que muda de dia a cada ano, use "movel" no lugar de
   inicio/fim — o dia é calculado na hora, sem manutenção:

     movel: { mes: 5, diaSemana: 0, ocorrencia: 2 }   2º domingo de maio
     movel: { mes: 11, diaSemana: 5, ocorrencia: -1 } última sexta de novembro

     mes         1 a 12
     diaSemana   0 = domingo, 1 = segunda … 6 = sábado
     ocorrencia  1, 2, 3… a contar do início do mês;
                 -1 = a última, -2 = a penúltima
     antes       quantos dias antes do feriado a campanha entra.
                 Omitido = 1, ou seja, véspera e dia.

   Cada campanha tem três partes:
     tema     → as cores (ficam no style.css, por data-campanha)
     enfeite  → a decoração animada da tela (festa.js)
     caixa    → o presente que abre ao entrar no site (festa.js)
   ========================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     SIMULAÇÃO — para ver uma campanha fora da data dela.
     Vale para o site inteiro (apresentação, produtos e contato).

       ""              → funcionamento normal, pela data de hoje
       "natal"         → força o Natal
       "black-friday"  → força a Black Friday
       (qualquer slug da lista abaixo)

     Deixe "" antes de publicar o site.
     --------------------------------------------------------- */
  var SIMULAR = "";

  var CAMPANHAS = [
    {
      /* última sexta de novembro — calculada a cada ano */
      slug: "black-friday",
      nome: "Black Friday",
      movel: { mes: 11, diaSemana: 5, ocorrencia: -1 },
      desconto: 20,
      cupom: "BLACK20",
      chamada: "Black Friday na Mimô: 20% OFF em toda a tabela",
      detalhe: "só hoje e amanhã · cupom BLACK20",
      enfeite: {
        particula: "etiqueta",          // etiquetas de preço caindo
        quantidade: 18,
        cores: ["#f2c744", "#e8d9a0", "#8a7a3c"],
        brilho: true,                   // faísca atravessando a tela
        varal: ""
      },
      caixa: {
        arte: "caixa-preta",
        titulo: "A caixa preta está aberta",
        texto: "Toque para descobrir o desconto desta Black Friday.",
        botao: "Abrir agora",
        premio: "20% OFF em toda a tabela + brinde surpresa no pacote",
        cupom: "BLACK20"
      }
    },
    {
      slug: "natal",
      nome: "Natal",
      inicio: "12-24",          /* véspera e dia */
      fim: "12-25",
      desconto: 10,
      cupom: "NATAL10",
      chamada: "Brinde de Natal pronto a tempo: 10% OFF",
      detalhe: "véspera e Natal · cupom NATAL10",
      enfeite: {
        particula: "floco",
        quantidade: 30,
        cores: ["#ffffff", "#e3f3ff", "#c8e6ff"],
        varal: "luzes",                 // pisca-pisca sob o cabeçalho
        viajante: "treno"               // trenó cruzando a tela
      },
      caixa: {
        arte: "presente",
        titulo: "Tem um presente pra você",
        texto: "Toque no laço para abrir e ver o que caiu na sua meia.",
        botao: "Abrir presente",
        premio: "10% OFF no pedido + 50 cartões de visita de brinde",
        cupom: "NATAL10"
      }
    },
    {
      /* a virada: entra no dia 30 e sai no dia 2, atravessando o ano */
      slug: "fim-de-ano",
      nome: "Festas de fim de ano",
      inicio: "12-30",
      fim: "01-02",
      desconto: 10,
      cupom: "VIRADA10",
      chamada: "Festas de fim de ano: 10% OFF em brinde, calendário e cartão",
      detalhe: "de 30/12 a 02/01 · cupom VIRADA10",
      enfeite: {
        particula: "estrela",
        quantidade: 26,
        cores: ["#e8c86a", "#f8efd6", "#ffffff", "#b9d9ff"],
        varal: "luzes",                 // pisca-pisca sob o cabeçalho
        viajante: "cometa",             // estrela cadente atravessando a tela
        brilho: true                    // faísca varrendo, como um fogo distante
      },
      caixa: {
        arte: "espumante",
        titulo: "Um brinde ao seu próximo ano",
        texto: "Toque na rolha e veja o que separamos para a virada.",
        botao: "Estourar",
        premio: "10% OFF + calendário de parede personalizado de brinde",
        cupom: "VIRADA10"
      }
    },
    {
      slug: "volta-as-aulas",
      nome: "Volta às aulas",
      inicio: "01-10",
      fim: "02-10",
      desconto: 10,
      cupom: "AULAS10",
      chamada: "Volta às aulas: 10% OFF em etiqueta, caderno e adesivo",
      detalhe: "até 10/02 · cupom AULAS10",
      enfeite: {
        particula: "lapis",
        quantidade: 16,
        cores: ["#ffc93c", "#ef5b2b", "#3366cc"],
        varal: ""
      },
      caixa: {
        arte: "caderno",
        titulo: "Abra o caderno",
        texto: "Tem um recado escrito na primeira página.",
        botao: "Abrir caderno",
        premio: "10% OFF + etiquetas escolares com o nome do aluno de brinde",
        cupom: "AULAS10"
      }
    },
    {
      /* 2º domingo de maio — calculado a cada ano */
      slug: "dia-das-maes",
      nome: "Dia das Mães",
      movel: { mes: 5, diaSemana: 0, ocorrencia: 2 },
      desconto: 15,
      cupom: "MAES15",
      chamada: "Dia das Mães: 15% OFF em caneca, camiseta e cartão",
      detalhe: "véspera e Dia das Mães · cupom MAES15",
      enfeite: {
        particula: "petala",
        quantidade: 24,
        cores: ["#f3a7c5", "#d8486b", "#ffd9e6"],
        varal: ""
      },
      caixa: {
        arte: "flor",
        titulo: "Uma flor pra quem cuida",
        texto: "Toque para a flor abrir e ver o seu desconto.",
        botao: "Ver a flor abrir",
        premio: "15% OFF + cartão escrito à mão junto do pedido",
        cupom: "MAES15"
      }
    },
    {
      /* véspera e dia de São João, a data forte do arraiá */
      slug: "festa-junina",
      nome: "Festa junina",
      inicio: "06-23",
      fim: "06-24",
      desconto: 10,
      cupom: "ARRAIA10",
      chamada: "Arraiá chegando: 10% OFF em copo, caneca e lembrancinha",
      detalhe: "23 e 24/06 · cupom ARRAIA10",
      enfeite: {
        particula: "milho",
        quantidade: 18,
        cores: ["#f0b429", "#c03221", "#2f8f4e"],
        varal: "bandeirinhas"           // varal de bandeirinhas no topo
      },
      caixa: {
        arte: "pescaria",
        titulo: "Pescaria da sorte",
        texto: "Toque na vara e veja o que você fisgou no arraiá.",
        botao: "Pescar",
        premio: "10% OFF + 100 bandeirolas de brinde no pedido",
        cupom: "ARRAIA10"
      }
    },
    {
      /* 2º domingo de agosto — calculado a cada ano */
      slug: "dia-dos-pais",
      nome: "Dia dos Pais",
      movel: { mes: 8, diaSemana: 0, ocorrencia: 2 },
      desconto: 15,
      cupom: "PAIS15",
      chamada: "Dia dos Pais: 15% OFF em caneca, camiseta e quadro",
      detalhe: "véspera e Dia dos Pais · cupom PAIS15",
      enfeite: {
        particula: "estrela",
        quantidade: 20,
        cores: ["#d9a441", "#f0d9a7", "#336088"],
        varal: ""
      },
      caixa: {
        arte: "caixa-ferramenta",
        titulo: "Abra a caixa de ferramentas",
        texto: "Tem desconto guardado na gaveta de cima.",
        botao: "Abrir a caixa",
        premio: "15% OFF + gravação do nome no brinde, sem cobrar a mais",
        cupom: "PAIS15"
      }
    },
    {
      slug: "dia-das-criancas",
      nome: "Dia das Crianças",
      inicio: "10-11",
      fim: "10-12",
      desconto: 12,
      cupom: "CRIANCAS12",
      chamada: "Dia das Crianças: 12% OFF em lembrancinha, adesivo e convite",
      detalhe: "11 e 12/10 · cupom CRIANCAS12",
      enfeite: {
        particula: "bexiga",
        quantidade: 22,
        cores: ["#ff5c8a", "#ffc93c", "#4a63d8", "#2fc2ba"],
        varal: "flamulas",
        viajante: "pipa"                // pipa cruzando o céu da página
      },
      caixa: {
        arte: "caixa-brinquedo",
        titulo: "Tem brinquedo nesse baú",
        texto: "Toque na tampa e veja o que guardamos para o Dia das Crianças.",
        botao: "Abrir o baú",
        premio: "12% OFF + 50 adesivos infantis de brinde no pedido",
        cupom: "CRIANCAS12"
      }
    },
    {
      /* véspera e Dia do Cliente (15/09) */
      slug: "dia-do-cliente",
      nome: "Dia do Cliente",
      inicio: "09-14",
      fim: "09-15",
      desconto: 15,
      cupom: "CLIENTE15",
      chamada: "Dia do Cliente: 15% OFF em toda a tabela",
      detalhe: "14 e 15/09 · cupom CLIENTE15",
      enfeite: {
        particula: "confete",
        quantidade: 34,
        cores: ["#7139ad", "#2fc2ba", "#f2603f", "#ffd200"],
        varal: "flamulas",
        viajante: "faixa"               // aviãozinho puxando um "obrigado"
      },
      caixa: {
        arte: "balao",
        titulo: "Essa semana é sua",
        texto: "Toque no balão para estourar e ver o agrado.",
        botao: "Estourar o balão",
        premio: "15% OFF em toda a tabela + brinde surpresa no pacote",
        cupom: "CLIENTE15"
      }
    }
  ];

  /* ---------- data de hoje no fuso de Brasília ---------- */
  function hojeEmSaoPaulo() {
    var d = new Date();
    try {
      /* ignora o fuso do computador do visitante */
      d = new Date(d.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    } catch (e) { /* navegador antigo: usa o fuso local mesmo */ }
    var agora = new Date(d.getTime());   /* com hora, para o cronômetro */
    d.setHours(0, 0, 0, 0);              /* sem hora, para comparar datas */
    var mm = ("0" + (d.getMonth() + 1)).slice(-2);
    var dd = ("0" + d.getDate()).slice(-2);
    return { ano: String(d.getFullYear()), md: mm + "-" + dd, data: d, agora: agora };
  }

  /* ---------- em que dia cai o feriado móvel neste ano? ----------
     Ex.: { mes:5, diaSemana:0, ocorrencia:2 } → 2º domingo de maio.
     Ocorrência negativa conta do fim do mês: -1 é a última. */
  function dataMovel(regra, ano) {
    var mes = regra.mes - 1;

    if (regra.ocorrencia > 0) {
      var primeiro = new Date(ano, mes, 1);
      var ateOdia = (regra.diaSemana - primeiro.getDay() + 7) % 7;
      return new Date(ano, mes, 1 + ateOdia + (regra.ocorrencia - 1) * 7);
    }

    var ultimo = new Date(ano, mes + 1, 0);          /* dia 0 do mês seguinte */
    var desdeOdia = (ultimo.getDay() - regra.diaSemana + 7) % 7;
    return new Date(ano, mes, ultimo.getDate() - desdeOdia + (regra.ocorrencia + 1) * 7);
  }

  /* ---------- a campanha está valendo hoje? ---------- */
  function estaAtiva(c, hoje) {
    /* feriado móvel: resolve o dia deste ano e abre a janela para trás */
    if (c.movel) {
      var alvo = dataMovel(c.movel, Number(hoje.ano));
      var antes = c.movel.antes == null ? 1 : c.movel.antes;
      var abre = new Date(alvo.getTime());
      abre.setDate(abre.getDate() - antes);
      return hoje.data >= abre && hoje.data <= alvo;
    }

    var anual = c.inicio.length === 5;

    if (!anual) {
      /* data fechada: compara AAAA-MM-DD direto, em ordem alfabética mesmo */
      var hojeCompleto = hoje.ano + "-" + hoje.md;
      return hojeCompleto >= c.inicio && hojeCompleto <= c.fim;
    }

    /* data anual: compara só MM-DD */
    if (c.inicio <= c.fim) {
      return hoje.md >= c.inicio && hoje.md <= c.fim;
    }
    /* intervalo que vira o ano, ex.: 26/12 a 05/01 */
    return hoje.md >= c.inicio || hoje.md <= c.fim;
  }

  /* ---------- em que instante exato a campanha acaba? ----------
     Sempre no último milissegundo do dia de "fim", na hora de Brasília.
     É daqui que o cronômetro da faixa tira o tempo restante. */
  function fimDaCampanha(c, hoje) {
    var ano = Number(hoje.ano);
    var fim;

    if (c.movel) {
      fim = dataMovel(c.movel, ano);
    } else if (c.fim.length === 10) {
      /* "AAAA-MM-DD": o ano vem escrito na própria data */
      var p = c.fim.split("-");
      fim = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    } else {
      var mes = Number(c.fim.slice(0, 2)) - 1;
      var dia = Number(c.fim.slice(3, 5));

      /* Num intervalo que vira o ano (12-30 a 01-02), quem está em
         dezembro vê o fim no ano seguinte; quem já está em janeiro
         vê o fim neste mesmo ano. Sem isso o cronômetro de 31/12
         marcaria quase um ano inteiro. */
      if (c.inicio > c.fim && hoje.md >= c.inicio) { ano += 1; }
      fim = new Date(ano, mes, dia);
    }

    fim.setHours(23, 59, 59, 999);
    return fim;
  }

  var hoje = hojeEmSaoPaulo();
  var ativa = null;

  /* Permite testar fora da data, sem esperar o feriado chegar:
       index.html?campanha=black-friday   → liga
       index.html?campanha=nenhuma        → desliga
     A escolha fica guardada na aba até fechar o navegador. */
  var forcada = (location.search.match(/[?&]campanha=([a-z0-9-]+)/i) || [])[1];
  try {
    if (forcada) { sessionStorage.setItem("mimo_campanha", forcada); }
    else { forcada = sessionStorage.getItem("mimo_campanha") || ""; }
  } catch (e) { /* sessionStorage bloqueado: segue sem memória */ }

  /* a simulação fixada no topo do arquivo tem a palavra final */
  if (SIMULAR) { forcada = SIMULAR; }

  if (forcada === "nenhuma") { forcada = "__off__"; }

  if (forcada) {
    ativa = CAMPANHAS.filter(function (c) { return c.slug === forcada; })[0] || null;
  } else {
    for (var i = 0; i < CAMPANHAS.length; i++) {
      if (estaAtiva(CAMPANHAS[i], hoje)) { ativa = CAMPANHAS[i]; break; }
    }
  }

  /* carimba o tema antes de a página desenhar */
  if (ativa) {
    document.documentElement.setAttribute("data-campanha", ativa.slug);
    document.documentElement.classList.add("has-promo");

    /* o cronômetro da faixa precisa de duas coisas daqui:
         fimEm   → o instante de término, para contar para trás
         forcada → se a campanha foi ligada à mão (SIMULAR ou ?campanha=),
                   o cronômetro aparece mas NÃO recarrega a página no zero,
                   senão o modo de teste entraria em recarga infinita */
    ativa.fimEm = fimDaCampanha(ativa, hoje);
    ativa.agoraEm = hoje.agora;
    ativa.forcada = Boolean(forcada);
  }

  window.MIMO_CAMPANHA = ativa;   /* main.js e festa.js leem isto */
})();
