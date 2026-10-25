# PKZ Lab & Studio One To One — protótipo do site

Protótipo em **HTML, CSS e JavaScript puros** (vanilla): sem framework, sem biblioteca de JS e sem etapa de build.
Fontes vêm do Google Fonts e o mapa do Google Maps, então é preciso internet para ver tudo como no design.

## Como rodar

Abra `index.html` no navegador (ou use a extensão *Live Server* do VS Code).

## Estrutura

```
index.html            Portal: escolha entre PKZ e One To One (halter arrastável)
404.html              Página de erro
privacidade.html      Política de Privacidade (LGPD)
favicon.svg

landing/              Portal
  style.css             estilos do portal
  script.js             halter, redirecionamento e acessibilidade
  Fotos/                fundos dos painéis (variantes -480/-800/-1280)

PKZ/                  Marca PKZ Lab
  indexPKZ.html         página inicial
  aula-experimental.html  agenda + formulário (envia pelo WhatsApp)
  stylePKZ.css          identidade visual (cores, fontes) da PKZ
  Fotos/                imagens usadas pelas páginas (variantes)

OneToOne/             Marca Studio One To One (mesma estrutura da PKZ)
  indexOTO.html · aula-experimental.html · styleOTO.css · Fotos/

shared/               Código usado pelas duas marcas
  css/
    base.css            estrutura, componentes e responsividade
    cta.css             botões de ação, faixa de conversão e barra fixa mobile
    extras.css          skip-link, FAQ, botões flutuantes
    legal.css           estilos do 404 e da privacidade
  js/
    data.js             FONTE ÚNICA dos dados: WhatsApp, horários, endereço, Instagram
    pagina-marca.js     menu mobile, modal de contato, voltar ao topo
    aula-experimental.js  agenda, validação e envio pelo WhatsApp

fotos-originais/      Fotos em alta resolução (fontes). NÃO são usadas pelo site.
```

Cada página de marca define `<html data-brand="pkz|oto">`; o JS compartilhado lê `data.js` com essa chave.
Ordem dos CSS nas páginas de marca: `base.css` → CSS da marca → `cta.css` (só onde há CTA) → `extras.css`.

**O CSS é mobile first**: o que está fora de `@media` é o layout de celular, e cada `@media (min-width: …)` só acrescenta o que muda em telas maiores (pontos de quebra em 641px, 769px, 861px e 1101px). O menu hambúrguer aparece até 768px; a partir de 769px os links ficam em linha no cabeçalho.

## Atenção

- O número de WhatsApp (`5521000000000`) é **placeholder**. Troque em `shared/js/data.js` (uma vez por marca): os links `wa.me` das páginas levam o atributo `data-whatsapp` e recebem o número de lá. A única cópia escrita à mão fica no `<noscript>` de cada `aula-experimental.html` (sem JavaScript não há como ler o `data.js`).
- `404.html` usa `<base href="/PFEcodigo-prototipo/">` (o nome do repositório no GitHub Pages, que publica em `usuario.github.io/repositorio/`). **Se o repositório novo tiver outro nome, troque** essa linha; senão o 404 aparece sem estilo e com links quebrados. Nesta página não use links só de âncora (`#algo`).
- Mexer em `shared/` afeta as duas marcas: combine antes e teste PKZ e One To One.
- A política de privacidade é um **modelo**; revisar com o responsável legal antes de publicar.

## Imagens

As fotos do site já estão em WebP nos tamanhos `-480`, `-800` e `-1280` (usados no `srcset` das páginas). Para trocar ou adicionar uma foto, exporte nesses três tamanhos e siga o mesmo padrão de `srcset` das imagens existentes.
