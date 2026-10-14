# Mimô Personalizados — site institucional

Site de **lembrancinhas e presentes personalizados** — casamento, padrinhos e
madrinhas, chá, igreja e festa. Funciona como **vitrine e porta de entrada de
pedidos**: o cliente conhece a linha no site e fecha pelo WhatsApp, pela Shopee ou
pelo Instagram.

> **Já são reais:** nome, paleta, WhatsApp, Instagram, loja na Shopee, endereço em
> Olinda/PE e as fotos da linha. **Ainda falta:** CEP, CNPJ, horário de atendimento
> e os preços. Veja [O que trocar antes de publicar](#o-que-trocar-antes-de-publicar).

> **As fotos são mockups**, não registros de entrega — por isso a galeria não traz
> nome de cliente nem data, e o catálogo não afirma nada sobre pedidos já feitos.
> Elas também carregam a marca d'água da ferramenta que as gerou.

HTML, CSS e JavaScript puros. Sem framework, sem build, sem dependência externa:
basta jogar a pasta num servidor.

---

## Índice

1. [Estrutura de arquivos](#estrutura-de-arquivos)
2. [Como abrir e como publicar](#como-abrir-e-como-publicar)
3. [Configuração obrigatória](#configuração-obrigatória)
4. [As três páginas](#as-três-páginas)
5. [Editar o catálogo](#editar-o-catálogo)
6. [Editar a galeria](#editar-a-galeria)
7. [Trocar as fotos](#trocar-as-fotos)
8. [Campanhas sazonais](#campanhas-sazonais)
9. [Criar uma campanha nova](#criar-uma-campanha-nova)
10. [Testar campanhas fora da data](#testar-campanhas-fora-da-data)
11. [Sistema visual (CSS)](#sistema-visual-css)
12. [Horário de atendimento](#horário-de-atendimento)
13. [Acessibilidade e desempenho](#acessibilidade-e-desempenho)
14. [O que trocar antes de publicar](#o-que-trocar-antes-de-publicar)
15. [Checklist de publicação](#checklist-de-publicação)

---

## Estrutura de arquivos

```
projeto_grafica/
├── index.html                 Apresentação (home)
├── produtos/
│   └── index.html             Catálogo, kits e canais de venda
├── contato/
│   └── index.html             "Onde comprar": canais, WhatsApp, loja e horário
├── assets/
│   ├── img/                   30 fotos (900 px, JPG) — a linha, com variações
│   │                          e recortes; a vitrine do hero reaproveita 6 delas
│   ├── css/
│   │   └── style.css          Toda a aparência do site
│   └── js/
│       ├── campanha.js        Decide qual campanha está ativa hoje
│       ├── main.js            Catálogo, galeria, menu, horário
│       └── festa.js           Enfeites sazonais e o presente do canto
└── README.md                  Este arquivo
```

Cada aba é uma pasta com o seu próprio `index.html`, o que dá URLs limpas
(`/produtos/`, `/contato/`). O CSS e o JS são compartilhados pelas três — corrigir
uma cor ou um preço se faz num lugar só.

### Ordem de carregamento dos scripts

| Arquivo | Onde entra | Por quê |
|---|---|---|
| `campanha.js` | no `<head>` | precisa carimbar o tema em `<html>` **antes** de a página desenhar, senão ela pisca na cor errada |
| `main.js` | fim do `<body>` | monta catálogo e galeria, já sabendo se há campanha |
| `festa.js` | depois do `main.js` | desenha os enfeites e o presente |

---

## Como abrir e como publicar

**Para ver no computador:** dê duplo clique em `index.html`. Todos os links são
relativos e explícitos (`produtos/index.html`), então a navegação funciona direto do
disco, sem servidor.

**Para publicar:** envie a pasta inteira para a hospedagem. Funciona em qualquer
servidor estático — Hostinger, Locaweb, Netlify, Vercel, GitHub Pages, um balde S3.
Não há etapa de build.

Se você usar um domínio próprio, atualize as tags `<link rel="canonical">` e
`og:url` no `<head>` das três páginas.

---

## Configuração obrigatória

Abra `assets/js/main.js`. Logo no começo:

```js
var CONFIG = {
  whatsapp: "5581991873132", // DDI + DDD + número, só dígitos
  origem: "site"             // aparece na mensagem, para identificar de onde veio
};
```

É daqui que **todos** os botões de WhatsApp do site tiram o link — inclusive o do
presente sazonal, que lê o mesmo objeto através de `window.MIMO_ZAP`.

O campo `origem` entra na mensagem que o cliente envia ("Vim pelo **site** da
Mimô Personalizados..."). Se um dia você publicar uma segunda versão do site — por exemplo, uma
página só para anúncios pagos — mude para `"anuncio"` e saberá de onde cada pedido
veio sem precisar de ferramenta nenhuma.

> Esse é o **único** lugar com o número. O botão dentro do presente sazonal também
> lê daqui, através de `window.MIMO_ZAP`.

---

## As três páginas

### `index.html` — apresentação

Hero com uma vitrine de seis peças reais revezando dentro de dois anéis que giram,
faixa de compromissos, três pilares, galeria com filtro por ocasião, processo em
cinco passos, comparativo antes/depois, seis ocasiões atendidas, FAQ e chamada final.

A vitrine do hero é só HTML: seis `<img>` dentro de uma `.shots` (a mesma classe dos
cards), escritas direto em `index.html`, dentro de `.hero__visual`. Para trocar quais
peças aparecem ali, edite essa lista de `<img>` — tamanho e proporção (4:5) são
mantidos sozinhos pelo CSS, então qualquer foto de `assets/img/` serve.

### `produtos/index.html` — venda

Catálogo com 14 peças, três kits (com um destacado), os dois canais de venda e um
bloco de condições de pagamento, entrega e garantia.

### `contato/index.html` — onde comprar

Aparece no menu como **"Onde comprar"**, porque é a página que reúne os canais de
venda, não só um formulário de contato. A pasta continua `contato/` — se quiser a URL
batendo com o rótulo, renomeie para `onde-comprar/` e ajuste os links das três
páginas.

Canais de venda, WhatsApp em destaque com Shopee e Instagram ao lado, endereço com
mapa e horário de atendimento. **Não tem formulário** por decisão de projeto: o
caminho é o WhatsApp.

---

## Editar o catálogo

Tudo vem da lista `PRODUTOS`, em `assets/js/main.js`. Os cards se montam sozinhos a
partir dela — você não mexe em HTML.

```js
{
  nome: "Pires personalizado",
  flag: "Mais pedido",        // etiqueta no canto; "" para nenhuma
  hot: true,                  // deixa a etiqueta na cor de destaque
  img: "pires-personalizado.jpg",   // arquivo dentro de assets/img/ — ou uma
                                     // lista; veja "Uma peça, mais de uma foto"
  specs: [                    // três linhas costumam caber bem
    "Cerâmica branca, borda dourada",
    "Nome e data pintados à mão",
    "Avulso ou em jogo de 6"
  ]
}
```

> O exemplo acima é ilustrativo — as 14 peças reais estão logo abaixo, no arquivo.
> Hoje **todas** usam a forma de lista (`img: [...]`), porque todas têm mais de uma
> foto; veja [Uma peça, mais de uma foto](#uma-peça-mais-de-uma-foto).

### Preço e prazo são opcionais

Hoje **nenhuma peça tem preço na lista**, e por isso todo card mostra "Sob
orçamento". Isso é proposital: o valor por unidade muda com a quantidade e com a
personalização, e um número fixo no site criaria discussão no atendimento.

Quando você quiser publicar o preço de alguma peça, acrescente os dois campos:

```js
preco: 89,                    // número puro, sem "R$" e sem aspas
unidade: "/un",               // opcional, aparece colado no preço
prazo: "5 dias úteis"         // opcional; sem ele a linha de prazo some
```

Com `preco` presente, o card volta a mostrar o valor formatado em reais — e passa a
receber o desconto da campanha sazonal automaticamente, com o valor antigo riscado.
Sem `preco`, a campanha ainda pinta o site e dá o cupom, mas não há valor para
descontar no card.

- **Para acrescentar uma peça**, copie um item inteiro e ajuste. O grid se reorganiza
  automaticamente.
- **Para remover**, apague o item (cuidado com a vírgula do item anterior).

---

## Editar a galeria

Mesma lógica, na lista `GALERIA` do `main.js`:

```js
{
  titulo: "Pires personalizado",
  cat: "Lembrancinhas",       // vira botão de filtro automaticamente
  texto: "Cerâmica branca com borda dourada, nome e data pintados à mão.",
  tags: ["Lembrancinha", "Cerâmica"],
  img: "pires-personalizado.jpg"   // mesma regra do catálogo: nome só ou lista
}
```

Os **filtros se montam a partir do campo `cat`**: basta usar uma ocasião nova em
algum item que o botão aparece sozinho. Não há lista de categorias para manter.

Não existe campo de cliente nem de data, de propósito: as fotos são mockups do
produto, e um nome de cliente com data ao lado afirmaria uma entrega que não
aconteceu. Se um dia você fotografar pedidos reais e tiver autorização de uso, aí
vale acrescentar esses campos de volta.

---

## Trocar as fotos

As imagens ficam em `assets/img/`, com o nome que aparece no campo `img`. Para
trocar, basta **substituir o arquivo mantendo o mesmo nome** — nenhum código precisa
mudar.

Se for subir fotos novas, antes de copiar para a pasta:

- **Redimensione para 900 px** no maior lado e salve em JPG com qualidade ~82. As 30
  atuais somam cerca de 3 MB; os originais somavam 75 MB, que deixariam o site lento
  no celular.
- **Prefira enquadramento quadrado.** O card de produto é 1:1 e o da galeria é 4:3,
  os dois com `object-fit: cover` — então a imagem é cortada pelas bordas, nunca
  distorcida, mas um assunto muito perto da borda pode ser cortado.

O caminho das fotos é montado em `main.js` pela função `fotos()`, que descobre
sozinha se a página está na raiz ou numa subpasta. É por isso que a mesma lista serve
a home e à página de produtos.

### Uma peça, mais de uma foto

O campo `img` aceita um nome só (`img: "x.jpg"`) ou uma lista
(`img: ["x.jpg", "x-2.jpg"]`). Com mais de uma foto, o card fica **alternando
sozinho** entre elas, devagar, com um fade suave. Hoje **as 14 peças alternam**,
mas de duas formas diferentes — vale saber qual é qual:

- **5 peças têm uma segunda foto real**, outro ângulo de verdade dos mockups:
  Caixa de joias dos noivos, Copo térmico de padrinho e madrinha (essa tem 4),
  Ecobag, Bóton e Camiseta.
- **9 peças alternam entre a foto inteira e um recorte com zoom** da mesma foto —
  Quebra-cabeça, Quadro do Spotify, Placa de cavalete, Taça gravada, Kit madrinha,
  Pratinhos, Vasinho, Caixa de joias com laço e Copos long drink. Para essas, os
  mockups só traziam um ângulo; em vez de repetir a imagem idêntica (o que seria
  fingir variedade que não existe), o recorte mostra de perto o nome gravado ou a
  arte, a partir do arquivo original em alta resolução — é a mesma foto, outro
  enquadramento, não uma foto inventada.

Se um dia você mandar uma segunda foto de verdade para alguma dessas 9, é só trocar
o arquivo `-2.jpg` dela pela foto nova — o código não muda.

Para acrescentar uma segunda foto a uma peça nova: salve o arquivo em `assets/img/`
(mesmo padrão de tamanho) e troque `img: "arquivo.jpg"` por
`img: ["arquivo.jpg", "arquivo-2.jpg"]` — tanto em `PRODUTOS` quanto em `GALERIA`,
se a peça aparecer nas duas listas. O card já nasce alternando, sem mexer em HTML
ou CSS.

**Nenhuma foto leva `loading="lazy"`.** Pareceu uma boa ideia economizar banda
adiando o carregamento, mas na prática isso é o que faz um card nascer em branco —
seja a primeira foto, que devia aparecer junto com o card, seja a de trás, que
nunca chega a ser buscada quando a vez dela entra no revezamento. Como as 30 fotos
do site juntas pesam poucos MB, carregar tudo de uma vez é a opção mais segura.

> Quem tem "reduzir movimento" ligado no sistema não vê a troca: a primeira foto
> fica parada, do jeito que já era antes desse recurso existir.

---

## Campanhas sazonais

O site muda de cara sozinho em datas comerciais. Quando uma campanha está no ar:

1. **Faixa no topo** com a chamada e um cronômetro regressivo.
2. **Paleta trocada** — o site inteiro acompanha, porque tudo usa variáveis CSS.
3. **Preços recalculados** nos cards, com valor antigo riscado e selo de desconto.
4. **Enfeites animados** na tela (partículas, varal, elemento cruzando a tela).
5. **Presente no canto superior direito** que revela o cupom ao ser clicado.
6. **Mensagens do WhatsApp** passam a citar a campanha e o cupom.

A faixa foi pensada para ficar enxuta de propósito: só o rótulo da campanha, a
chamada e o cronômetro. A data por extenso e o código do cupom ficaram de fora —
o cronômetro já informa quanto tempo falta, e o cupom chega pronto na mensagem do
WhatsApp assim que o cliente clica em qualquer botão do site, sem precisar repetir
na faixa. Quem edita uma campanha ainda escreve `detalhe` no `campanha.js` (data +
cupom por extenso), mas esse campo não aparece mais na faixa — é só um resumo para
quem está lendo o código.

### O cronômetro

Conta até o último segundo do último dia da campanha. Ao chegar a zero, a página
**recarrega sozinha** — e como a campanha já não vale mais, ela volta sem faixa, sem
tema e sem enfeites, pelo próprio funcionamento do `campanha.js`. Nenhum código extra
faz essa "volta ao normal": é consequência natural de `estaAtiva()` não achar mais
nenhuma campanha valendo.

> O cronômetro soma o fuso de Brasília uma vez, no carregamento da página, e usa o
> relógio do navegador para contar os segundos daí em diante — não há requisição ao
> servidor a cada tique. Em compensação, herda o mesmo limite do resto do sistema de
> campanhas: quem atrasa o relógio do computador vê uma contagem errada.
>
> Em modo de teste (`SIMULAR` ou `?campanha=...`), o cronômetro aparece e conta
> normalmente, mas **não recarrega a página ao chegar a zero** — senão o teste
> entraria num laço de recarga infinita.

### Campanhas já cadastradas

A regra é **véspera e dia**: a campanha entra na véspera do feriado e sai no fim do dia.

| Campanha | Período | Desconto | Enfeite | Presente |
|---|---|---|---|---|
| Volta às aulas | 10/01 – 10/02 | 10% | lápis caindo | caderno que abre |
| Dia das Mães | véspera e o 2º domingo de maio | 15% | pétalas | flor que desabrocha |
| Festa junina | 23 e 24/06 (São João) | 10% | milho + varal de bandeirinhas | vara de pescaria |
| Dia dos Pais | véspera e o 2º domingo de agosto | 15% | estrelas douradas | caixa de ferramentas |
| Dia do Cliente | 14 e 15/09 | 15% | confete + flâmulas + aviãozinho | balão que estoura |
| Dia das Crianças | 11 e 12/10 | 12% | bexigas + flâmulas + pipa cruzando a tela | baú de brinquedos |
| Black Friday | véspera e a última sexta de novembro | 20% | etiquetas + faísca varrendo a tela | caixa preta |
| Natal | 24 e 25/12 | 10% | neve + pisca-pisca + trenó | presente com laço |
| Festas de fim de ano | 30/12 – 02/01 | 10% | estrelas douradas + pisca-pisca + cometa | garrafa de espumante |

> A **Volta às aulas** continua com um mês de janela porque não é um feriado: não
> existe "véspera" de volta às aulas. Se quiser apertar, é só mudar `inicio` e `fim`.

Se duas campanhas se sobrepuserem, vale **a que estiver primeiro na lista**.

### Formato das datas

Uma campanha usa **ou** `inicio`/`fim`, **ou** `movel`. Nunca os dois.

| Formato | Significado | Exemplo |
|---|---|---|
| `"MM-DD"` | repete todo ano, sem manutenção | `"12-24"` |
| `"AAAA-MM-DD"` | só naquele ano | `"2026-11-20"` |

Intervalos que viram o ano funcionam (`"12-30"` a `"01-02"`).

Reserve o `AAAA-MM-DD` para uma ação pontual — um aniversário da loja, uma liquidação
de estoque — que deve acontecer **uma vez só** e não se repetir no ano seguinte.

### Feriado que muda de dia todo ano

Dia das Mães, Dia dos Pais e Black Friday não caem numa data fixa: são "o 2º domingo
de maio", "o 2º domingo de agosto" e "a última sexta de novembro". Para essas, no
lugar de `inicio`/`fim`, use `movel` — o dia é calculado na hora, sem manutenção:

```js
movel: { mes: 5,  diaSemana: 0, ocorrencia: 2  }   // 2º domingo de maio
movel: { mes: 11, diaSemana: 5, ocorrencia: -1 }   // última sexta de novembro
```

| Campo | O que é |
|---|---|
| `mes` | 1 a 12 |
| `diaSemana` | 0 = domingo, 1 = segunda … 6 = sábado |
| `ocorrencia` | 1, 2, 3… do início do mês; `-1` = a última, `-2` = a penúltima |
| `antes` | quantos dias antes a campanha entra. Omitido = 1, ou seja, véspera e dia |

Para dar mais fôlego a uma data, aumente o `antes` em vez de mexer na data:
`antes: 6` na Black Friday faz a campanha cobrir a semana inteira até a sexta.

### Fuso horário

A comparação usa o horário de **Brasília**, não o do computador do visitante. Sem
isso, um cliente viajando veria a promoção começar na hora errada.

> **Limite honesto:** a data vem do relógio do visitante. Quem atrasar o relógio do
> computador vê a promoção fora do período. Para decoração, não importa. Como o
> preço final é sempre fechado por você no WhatsApp, o risco é pequeno — mas o
> desconto exibido é **vitrine, não regra de negócio**. Combine internamente que o
> cupom do site vale no atendimento, senão o cliente chega cobrando algo que você
> não reconhece.

---

## Criar uma campanha nova

São dois passos.

### 1. Cadastre a campanha em `assets/js/campanha.js`

```js
{
  slug: "dia-do-consumidor",      // só letras minúsculas e hífen
  nome: "Dia do Consumidor",
  inicio: "03-10",
  fim: "03-17",
  desconto: 12,                   // 0 para campanha só decorativa
  cupom: "CONSUMIDOR12",
  chamada: "Dia do Consumidor: 12% OFF em toda a tabela",
  detalhe: "até 17/03 · cupom CONSUMIDOR12",

  enfeite: {
    particula: "confete",         // floco, etiqueta, petala, confete,
                                  // lapis, milho, estrela, bexiga
    quantidade: 24,
    cores: ["#2fc2ba", "#ffd200", "#f2603f"],
    varal: "flamulas",            // luzes, bandeirinhas, flamulas ou ""
    viajante: "",                 // treno, faixa, pipa, cometa ou ""
    brilho: false                 // faísca varrendo a tela
  },

  caixa: {
    arte: "balao",                // presente, caixa-preta, caderno, flor,
                                  // pescaria, caixa-ferramenta, balao,
                                  // caixa-brinquedo, espumante
    titulo: "Essa é pra você",
    texto: "Toque para ver o que separamos.",
    botao: "Abrir",
    premio: "12% OFF + brinde no pacote",
    cupom: "CONSUMIDOR12"
  }
}
```

### 2. Crie o tema em `assets/css/style.css`

Na seção **CAMPANHAS SAZONAIS**, no topo do arquivo:

```css
:root[data-campanha="dia-do-consumidor"]{
  --deep:#17323f;  --brand:#1f5566;  --brand-2:#2a7489;
  --accent:#39c6c0;  --accent-soft:#d9f4f2;
  --warm:#f2603f;    --warm-soft:#ffe5de;
  --promo-bg:linear-gradient(90deg,#1f5566,#2a7489 55%,#1f5566);
  --promo-ink:#d9f4f2;
}
```

Pronto. Nenhum componente precisa ser tocado: botões, cards, rodapé e selos leem
dessas variáveis.

**Guia rápido das variáveis:**

| Variável | Onde aparece |
|---|---|
| `--deep` | fundos escuros, faixa de compromissos, gradiente dos botões |
| `--brand` / `--brand-2` | links, botão primário, detalhes |
| `--accent` / `--accent-soft` | destaques claros, chips, fundo do dia atual |
| `--warm` / `--warm-soft` | acento quente: selo de desconto, ícones |
| `--promo-bg` / `--promo-ink` | fundo e texto da faixa do topo |

Os nomes são neutros de propósito: cada campanha pinta esses mesmos papéis com a
cor da data, sem que nenhum componente saiba qual é a cor.

### Prêmio: desconto ou brinde?

O presente entrega **o mesmo percentual que a campanha anuncia na faixa do topo**,
acompanhado de um brinde ou vantagem (frete, gravação, item extra). Se a caixa
prometesse 20% enquanto a faixa diz 10%, o cliente chegaria cobrando um número que o
site não mostra. Do jeito atual, a caixa dá sensação de presente sem criar
contradição.

> Enquanto os cards estiverem em "Sob orçamento", o desconto da campanha só aparece
> na faixa do topo e no presente — não há valor no card para riscar. O cupom continua
> valendo no atendimento, e é lá que o percentual entra na conta.

O presente só é oferecido **uma vez por campanha, por navegador** (guardado em
`localStorage`). Depois de resgatado ele continua no canto, com o rótulo "Ver meu
cupom", e reabre direto no código.

---

## Testar campanhas fora da data

Três caminhos, do mais permanente ao mais descartável:

**1. Fixar no código** — em `assets/js/campanha.js`, no topo:

```js
var SIMULAR = "natal";   // "" = funcionamento normal, pela data de hoje
```

Vale para as três páginas e tem precedência sobre tudo.
**Deixe `""` antes de publicar**, senão o site fica eternamente no Natal.

**2. Pela URL** — `index.html?campanha=black-friday`, ou `?campanha=nenhuma` para
desligar. A escolha fica guardada na aba até você fechá-la.

**3. Limpar** — feche a aba, ou use `?campanha=nenhuma`.

Para rever o presente depois de resgatado, limpe o `localStorage` do site no console
do navegador:

```js
Object.keys(localStorage).filter(k => k.startsWith("mimo_")).forEach(k => localStorage.removeItem(k));
```

---

## Sistema visual (CSS)

O arquivo é organizado em blocos comentados, nesta ordem:

```
TOKENS → CAMPANHAS → BASE → BOTÕES → HEADER → HERO → COMPROMISSOS →
SEÇÕES → CARDS → GALERIA → PROCESSO → SEGMENTOS → ANTES/DEPOIS →
PRODUTOS → PLANOS → CANAIS → FAQ → CTA → CONTATO → ENFEITES →
PRESENTE → RODAPÉ → FLUTUANTES → RESPONSIVO
```

### A paleta da marca

As cinco cores da Mimô ficam no topo do `style.css`, com o nome que o cliente usa:

| Token | Cor | Nome |
|---|---|---|
| `--rosa` | `#FADADD` | Rosa Pó Suave |
| `--dourado` | `#C89664` | Dourado Elegante |
| `--marrom` | `#5C3924` | Marrom Sofisticado |
| `--creme` | `#F9F2ED` | Branco Crème |
| `--areia` | `#E8D9CC` | Bege Areia |

Logo abaixo vêm os **papéis** — é deles que os componentes leem, nunca das cinco
acima. Isso é o que permite a uma campanha repintar o site inteiro sem tocar em
nenhum componente:

| Papel | Valor fora de campanha | Vem de |
|---|---|---|
| `--deep` | `#3B2316` | marrom aprofundado, para seções escuras e rodapé |
| `--brand` | `#5C3924` | Marrom Sofisticado |
| `--brand-2` | `#7A4C30` | marrom clareado, para hover e gradiente |
| `--accent` | `#C89664` | Dourado Elegante |
| `--accent-soft` | `#F3E7D8` | dourado diluído, para chips e fundos de ícone |
| `--warm` | `#A45E6A` | rosa aprofundado até ficar legível com texto branco |
| `--warm-soft` | `#FADADD` | Rosa Pó Suave |

O `--warm` existe porque o Rosa Pó puro tem contraste de 1,2:1 com branco — bonito
como fundo, ilegível como cor de texto ou de selo. Onde o rosa precisa carregar
texto (selo de desconto, o "ô" da marca), entra o `--warm`; onde ele é só fundo,
entra o `--warm-soft`.

### Tokens principais

```css
--container: 1140px;   /* largura máxima do conteúdo */
--header-h:  86px;     /* altura do cabeçalho fixo */
--promo-h:   0px;      /* vira 44px quando há campanha; o layout se ajusta sozinho */
--radius:    16px;
```

A variável `--promo-h` é o truque que faz a faixa de campanha caber sem quebrar
nada: o cabeçalho, os heros e o menu do celular já somam essa altura nos seus
cálculos. Se você mudar a altura da faixa, mude só o valor em `:root.has-promo`.

### Classes que se repetem

| Classe | Uso |
|---|---|
| `.container` | centraliza e limita a largura |
| `.section` | espaçamento vertical padrão de seção |
| `.section--tint` | seção com fundo Branco Crème |
| `.section--dark` | seção escura com gradiente |
| `.card` | card branco com barra de gradiente no hover |
| `.work` | card da galeria: foto 4:3 no topo, texto embaixo |
| `.prod` | card do catálogo: foto quadrada, specs, preço, botão |
| `.btn btn--primary` | botão principal |
| `.btn btn--whats` | botão verde do WhatsApp |
| `.eyebrow` | rótulo pequeno em maiúsculas acima do título |
| `.reveal` | entra com fade ao rolar a página |
| `.grad` | texto com gradiente aplicado |

Para que um elemento apareça com animação ao rolar, basta acrescentar `reveal` às
classes dele. O `main.js` cuida do resto.

---

## Horário de atendimento

Na página de contato, a lista de horários é HTML normal (funciona sem JavaScript) e
o `main.js` só acrescenta inteligência:

```html
<li data-dia="1" data-abre="510" data-fecha="1080">
  <span class="d">Segunda-feira</span><span class="h">08h30 — 18h00</span>
</li>
```

- `data-dia`: 0 = domingo, 1 = segunda … 6 = sábado.
- `data-abre` / `data-fecha`: **minutos desde a meia-noite**
  (08h30 = 8 × 60 + 30 = 510; 18h00 = 1080). Dia fechado: omita os dois.

Com isso o site marca o dia de hoje na lista e mostra o selo **Aberto agora** ou
**Fechado agora**. Para mudar o funcionamento, edite o texto visível **e** os
números — eles precisam concordar.

---

## Acessibilidade e desempenho

O que já está resolvido:

- **Teclado**: todo elemento interativo é focável, com contorno visível. O menu do
  celular e o presente respondem a `Enter`/`Espaço`; o painel do presente fecha com
  `Esc`.
- **Leitores de tela**: `aria-label` nos ícones, `aria-current` na página atual,
  `role="dialog"` no painel, enfeites marcados como `aria-hidden`, link "Ir para o
  conteúdo" no início de cada página.
- **Movimento**: quem liga "reduzir movimento" no sistema não vê partículas, trenó
  nem confete, e o painel entra sem animação.
- **Imagens**: 30 fotos ao todo (14 peças, a maioria com uma segunda foto ou um
  recorte) somando cerca de 3 MB — nenhuma leva `loading="lazy"` (ver
  [Uma peça, mais de uma foto](#uma-peça-mais-de-uma-foto) para o porquê). A
  vitrine do hero reaproveita 6 fotos já existentes, não soma arquivos novos; a
  primeira delas vem com `fetchpriority="high"`, por ser a primeira coisa que a
  página mostra. Todas têm `alt` descrevendo a peça, não "foto de produto".
- **Peso**: sem framework e sem biblioteca. Ícones e enfeites são SVG inline. A única
  requisição externa é a fonte Inter, do Google Fonts — se tirá-la, o site cai para
  a fonte do sistema sem quebrar nada.
- **SEO**: títulos e descrições próprios por página, `canonical`, Open Graph e dados
  estruturados `Store` na home.

---

## O que trocar antes de publicar

**Já é real:** nome, paleta, WhatsApp (`5581991873132`), Instagram
(`@mimohpersonalizados`), a loja na Shopee (`mimo_personalizados`), o endereço
(Av. Rubi Vermelho, 30 — Jardim Atlântico, Olinda/PE) e as fotos da linha.

**Já foi removido** por não existir: o TikTok Shop e o telefone fixo. O WhatsApp é o
único canal de voz do site. Se um dia houver TikTok, o CSS do card
(`.channel--tiktok`) continua no `style.css` e a grade `.channels` usa `auto-fit` —
basta recolocar o `<a class="channel channel--tiktok">` nas páginas de produtos e
contato que a grade volta a três colunas sozinha.

Tudo abaixo ainda é exemplo:

| Item | Onde está |
|---|---|
| **CEP** | hoje não aparece em lugar nenhum: tirei o `postalCode` do bloco `Store` em vez de deixar o CEP errado de São Paulo. Para recolocar, acrescente `"postalCode": "531xx-xxx"` ao `address`, e o CEP ao `.map__addr` em `contato/index.html` |
| **Horário de atendimento** | `contato/index.html` (lista `.hours`, com `data-abre`/`data-fecha`) e `openingHours` no bloco `Store` — os dois precisam concordar |
| CNPJ | rodapé das três páginas |
| Preços | campo `preco` em `PRODUTOS` (`main.js`) — hoje todos mostram "Sob orçamento" |
| Mínimos e prazos de cada peça | `specs` e `prazo` em `PRODUTOS` — confira se batem com a sua produção |
| As seis ocasiões da home | seção `#segmentos` em `index.html` — ajuste para o que você realmente atende |
| Horário | `contato/index.html` |
| Domínio `mimopersonalizados.com.br` em `canonical` e `og:url` | `<head>` das três páginas |
| Marca d'água nas fotos | `assets/img/` — trocar pelos arquivos sem marca quando tiver |
| Aviso de protótipo | `.footer__disclaimer`, nas três páginas — **apague** antes de publicar |



---

## Checklist de publicação

- [x] Número do WhatsApp trocado em `main.js` (`CONFIG.whatsapp`)
- [ ] `var SIMULAR = "";` no `campanha.js`
- [ ] Datas das campanhas em `MM-DD` ou `movel` (rodam sozinhas todo ano)
- [x] Links reais de Shopee e Instagram
- [x] Fotos da linha em `assets/img/`
- [x] Endereço real (Olinda/PE)
- [ ] CEP e CNPJ
- [ ] Horário de atendimento conferido na lista `.hours` **e** no `openingHours`
- [ ] Aviso de protótipo removido do rodapé das três páginas
- [ ] Fotos sem marca d'água
- [ ] Mínimos e materiais de cada peça conferidos nos `specs`
- [ ] `canonical` e `og:url` com o domínio real
- [ ] Testado no celular, com o menu aberto e fechado
- [ ] Botões de WhatsApp testados: a mensagem chega preenchida?

---

## Perguntas rápidas

**Dá para ter uma quarta página?**
Crie `nova-pasta/index.html`, copie o `<head>` e o `<header>` de `produtos/index.html`
(que já usa caminhos `../`), acrescente o link na navegação das três páginas e
pronto.

**Dá para o site receber pedidos sem WhatsApp?**
Daria, com um formulário e um backend para receber os envios. A decisão aqui foi o
contrário: tirar o formulário e deixar o WhatsApp como único caminho, porque é onde
o atendimento já acontece.

**Posso desligar as campanhas de vez?**
Esvazie a lista `CAMPANHAS` em `campanha.js`, ou simplesmente não cadastre datas. O
site funciona normalmente sem nenhuma campanha ativa.

