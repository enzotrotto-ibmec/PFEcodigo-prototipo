# Projeto para AC da disciplina Projeto Front-end

## PKZ Lab & One to One

Repositório de organização e centralização do código e da documentação produzidos para o projeto de avaliação AC da disciplina Projeto Front-end, cujo objetivo é desenvolver o novo site da empresa PKZ Lab & One to One.

## Contexto

A PKZ Lab & One to One contratou nossa instituição para reestruturar o site da empresa. Na etapa anterior (AP1), o foco foi o planejamento da proposta de melhoria. Nesta etapa (AC), o foco está na implementação: o trabalho consiste em desenvolver o site em si, utilizando HTML, CSS e JavaScript puro (Vanilla), sem uso de React ou qualquer outro framework/biblioteca de interface.

Ou seja: este repositório reúne o código-fonte do site e a documentação de apoio (Scrum, sistema de agendamento e protótipo atualizado).

## Tecnologias utilizadas

* HTML5: estrutura semântica das páginas
* CSS3: estilização, responsividade e layout (Flexbox/Grid)
* JavaScript (Vanilla): interatividade e manipulação do DOM, sem React nem outros frameworks

## Requisitos da entrega

* Mobile first e responsividade: o CSS é pensado primeiro para telas pequenas e depois expandido para telas maiores, e o site deve funcionar bem em mobile, tablet e desktop
* Menu hambúrguer no mobile, com JavaScript adicionando e removendo uma classe CSS para abrir e fechar o menu (como no exemplo mostrado em sala), e menu completo (sem hambúrguer) no desktop
* Imagens presentes no site e nenhum espaço de imagem vazio ou placeholder: usar o material disponibilizado pelo cliente ou imagens geradas com IA
* Alinhamento e organização do layout: respiro (espaçamento) adequado entre os elementos, sem elementos aglutinados e sem textos colados nas bordas dos elementos pais
* Sistema de agendamento: usa a lógica em JavaScript disponibilizada pelo professor, que pode ser editada à vontade, mas deve ser testada para garantir que as alterações não quebraram a funcionalidade (se quebrar, voltar à versão original). O CSS pode ser alterado livremente
* Publicação no GitHub Pages
* Documentação do repositório referente a esta tarefa, contendo:
   * o Scrum respectivo
   * a questão do agendamento (como o sistema foi incorporado ao site)
   * o protótipo atualizado, incluindo o agendamento

## Estrutura do repositório

```
.
├── index.html                              Portal: escolha entre PKZ e One To One
├── 404.html                                Página de erro (precisa ficar na raiz para o GitHub Pages)
├── pages/
│   ├── pkz.html                            Página inicial da PKZ Lab
│   ├── pkz-aula-experimental.html          Agendamento da aula experimental (PKZ)
│   ├── one-to-one.html                     Página inicial do Studio One To One
│   ├── one-to-one-aula-experimental.html   Agendamento da aula experimental (One To One)
│   └── privacidade.html                    Política de Privacidade (LGPD)
├── css/
│   ├── base.css                            Estrutura e componentes comuns (mobile first)
│   ├── pkz.css                             Identidade visual da PKZ
│   ├── one-to-one.css                      Identidade visual da One To One
│   ├── cta.css                             Botões de ação, faixa de conversão e barra fixa no celular
│   ├── extras.css                          Skip-link, FAQ e botões flutuantes
│   ├── portal.css                          Estilos do portal (index.html)
│   └── legal.css                           Estilos do 404 e da privacidade
├── js/
│   ├── main.js                             Menu hambúrguer, modal de contato, voltar ao topo e links de WhatsApp
│   ├── agendamento.js                      Sistema de agendamento: dias, horários, validação e envio pelo WhatsApp
│   ├── data.js                             Dados do site: WhatsApp, horários, endereço e Instagram
│   └── portal.js                           Halter arrastável do portal e redirecionamento
├── assets/
│   ├── img/
│   │   ├── portal/                         Fundos do portal
│   │   ├── pkz/                            Fotos da PKZ
│   │   └── one-to-one/                     Fotos da One To One
│   └── icons/
│       └── favicon.svg
├── fotos-originais/                        Fotos em alta resolução (fontes); o site não usa
├── docs/                                   (a criar) scrum/ · agendamento/ · prototipo/
└── README.md
```

As fontes vêm do Google Fonts; por isso não há pasta `assets/fonts`.

## Descrição dos entregáveis

**HTML**
Páginas do site estruturadas de forma semântica e acessível.

**CSS**
Estilização com identidade visual consistente, seguindo a abordagem mobile first, com layout responsivo, bom espaçamento entre elementos, menu hambúrguer no mobile e menu completo no desktop.

**JavaScript**
Funcionalidades e interações do site (menu hambúrguer controlado por adição e remoção de classe, sistema de agendamento, validações de formulário, componentes dinâmicos, etc.), implementadas em JavaScript puro, sem frameworks.

**Documentação Scrum (`docs/scrum/`)**
Registro de como a equipe aplicou o Scrum nesta tarefa: papéis (PO, Scrum Master e time), eventos, Definition of Done, Product Backlog priorizado e um arquivo por sprint com Sprint Backlog, Review e Retrospectiva.

**Documentação do agendamento (`docs/agendamento/`)**
Descrição de como o sistema de agendamento foi integrado ao site: onde ele aparece, como funciona para o usuário, quais alterações a equipe fez na lógica em JavaScript fornecida pelo professor, e como foram feitos os testes para garantir que a funcionalidade continuou funcionando.

**Protótipo atualizado (`docs/prototipo/`)**
Protótipo do grupo atualizado para incluir o agendamento, com o link para a ferramenta utilizada (ex: Figma) e/ou capturas de tela.

## Como executar

Por ser um projeto Vanilla, não há etapa de build nem dependências a instalar:

1. Clone o repositório
2. Abra o arquivo `index.html` no navegador (ou use uma extensão como o Live Server do VS Code)

## Publicação

O site é publicado via GitHub Pages.

* Link do site publicado: (adicionar aqui após a publicação)

## Observações técnicas

* **Mobile first:** o que está fora de `@media` nos arquivos CSS é o layout de celular; cada `@media (min-width: …)` só acrescenta o que muda em telas maiores (pontos de quebra em 641px, 769px, 861px e 1101px). O menu hambúrguer aparece até 768px; a partir de 769px os links ficam em linha no cabeçalho.
* **Menu hambúrguer:** `js/main.js` (e `js/agendamento.js`, nas páginas de agendamento) adiciona e remove a classe `nav-open` na lista de links para abrir e fechar o menu.
* **WhatsApp:** o número `5521000000000` é um valor de exemplo. Troque-o em `js/data.js` (uma vez por marca): os links `wa.me` das páginas levam o atributo `data-whatsapp` e recebem o número de lá. A única cópia escrita à mão fica no `<noscript>` de cada página `*-aula-experimental.html` (sem JavaScript não há como ler o `data.js`).
* **404:** `404.html` usa `<base href="/PFEcodigo-prototipo/">`, o nome do repositório no GitHub Pages (que publica em `usuario.github.io/repositorio/`). Se o repositório tiver outro nome, troque essa linha; senão o 404 aparece sem estilo e com links quebrados. Nessa página não use links só de âncora (`#algo`).
* **Imagens:** as fotos do site estão em WebP nos tamanhos `-480`, `-800` e `-1280` (usados no `srcset`). Para trocar ou adicionar uma foto, exporte nesses três tamanhos e siga o mesmo padrão das imagens existentes.
* **Política de privacidade:** é um modelo; revisar com o responsável legal antes de publicar.
* Mexer em `css/base.css`, `css/cta.css`, `css/extras.css` ou nos scripts de `js/` afeta as duas marcas: combine antes e teste PKZ e One To One.

## Nossa equipe

* Alexia Schmid
* Bernardo Gomes
* Bernardo Nemirovsky
* Enzo Trotto
* Gabriel Góis