# Casa Bergamota

Projeto conceitual de portfólio (Brunido). Sítio, pessoas, valores e contato são fictícios.

## Conceito

Um almoço por sábado, para dezoito pessoas, debaixo das bergamoteiras. Abre só na safra (abril a setembro) e o cardápio segue o que a árvore entrega na semana. A ação principal é reservar um sábado pelo WhatsApp.

- Plano: Estratégico.
- Gênero: japanese-minimal, com campos laranja grandes a pedido do cliente (o gênero original usa o acento só como marca).
- Paleta: papel `#F6F0E5`, papel 2 `#ECE3D2`, sumi `#2A1F17`, pedra `#675C50`, laranja `#EC7A1F` (campo, texto sumi por cima 5,6:1), laranja profundo `#A8430C` (links sobre papel 5,3:1).
- Tipos: Zen Old Mincho (títulos) e Zen Kaku Gothic New (texto).

## O que o site tem

- **A safra:** régua de 12 meses. Cada círculo mostra quanto a fruta amadureceu e, ao tocar, o painel diz o que vai à mesa naquele mês.
- **A mesa em seis tempos:** um prato dividido em seis fatias que se enche conforme a rolagem passa por cada tempo.
- **Reserva:** escolhe mês, sábado (com lugares restantes e datas lotadas), adultos e crianças, restrições e a Caixa da Estação. Calcula o total e monta a mensagem pronta para o WhatsApp.
- Caixa da Estação, dúvidas frequentes e fecho com chamada.

## Arquivos

- `index.html`, `styles.css`: página completa sem JavaScript.
- `script.js`: safra por mês, reserva e topo.
- `motion.js`: animações com GSAP, ScrollTrigger e Lenis (em `vendor/`), sempre dentro de `gsap.matchMedia` e desligadas com movimento reduzido.

Fotografias via Unsplash, carregadas de images.unsplash.com.
