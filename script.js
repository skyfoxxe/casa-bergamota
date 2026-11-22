/* Casa Bergamota · comportamento (sem dependências).
   A página fica completa sem este arquivo; aqui entram a safra por mês e a reserva. */
(() => {
  "use strict";

  const WA_NUMBER = "5565999999999";
  const PRICE_ADULT = 290;
  const PRICE_KID = 145;
  const PRICE_BOX = 160;
  const SEATS = 18;

  const brl = (n) => "R$ " + n.toLocaleString("pt-BR");

  /* ---------- Safra: dados por mês ---------- */
  const MONTHS = [
    { short: "jan", name: "Janeiro", r: 0.1, open: false, stage: "fruto verde",
      title: "Fruto verde, do tamanho de uma noz.",
      dishes: ["O pomar descansa. A cozinha também.", "Voltamos em abril."] },
    { short: "fev", name: "Fevereiro", r: 0.2, open: false, stage: "fruto verde",
      title: "A fruta engorda com a chuva de verão.",
      dishes: ["Mês de adubar e roçar.", "Reservas de abril abrem em março."] },
    { short: "mar", name: "Março", r: 0.38, open: false, stage: "mudando de cor",
      title: "As primeiras cascas começam a amarelar.",
      dishes: ["Rafael testa o cardápio da safra.", "Reservas de abril já estão abertas."] },
    { short: "abr", name: "Abril", r: 0.62, open: true, stage: "abertura",
      title: "Bergamota-cravo começando, limão-cravo no ponto.",
      dishes: ["Pão de fermentação natural com manteiga de limão-cravo", "Abóbora assada com mel do pomar", "Pudim de leite com raspa de bergamota"] },
    { short: "mai", name: "Maio", r: 0.84, open: true, stage: "quase lá",
      title: "A fruta já solta da casca. O doce ainda sobe.",
      dishes: ["Caldo de mandioquinha com azeite de laranja", "Frango caipira com bergamota e alecrim", "Bolo de fubá com calda cítrica"] },
    { short: "jun", name: "Junho", r: 1, open: true, stage: "auge",
      title: "Bergamota-cravo no ponto, kinkan começando.",
      dishes: ["Salada de folhas com gomos de bergamota e queijo fresco", "Porco assado no forno a lenha com laranja-pera", "Bolo molhado de laranja com calda de kinkan"] },
    { short: "jul", name: "Julho", r: 1, open: true, stage: "auge",
      title: "Ponkan e kinkan juntas. O mês mais frio e mais doce.",
      dishes: ["Pinhão na brasa com raspa de ponkan", "Costela no forno a lenha com laranja e cachaça", "Kinkan em calda com creme de nata"] },
    { short: "ago", name: "Agosto", r: 0.8, open: true, stage: "fim da bergamota",
      title: "Últimas bergamotas, laranja-lima chegando.",
      dishes: ["Salada de laranja-lima com cebola roxa e hortelã", "Galinhada com açafrão da horta", "Torta de laranja-lima"] },
    { short: "set", name: "Setembro", r: 0.6, open: true, stage: "fechamento",
      title: "Laranja-pera e limão-siciliano fecham a safra.",
      dishes: ["Peixe de rio com manteiga de limão-siciliano", "Arroz de forno com laranja-pera", "Sorvete de limão batido no pilão"] },
    { short: "out", name: "Outubro", r: 0.3, open: false, stage: "florada",
      title: "Flor de laranjeira. O pomar inteiro cheira a flor.",
      dishes: ["Mês de florada, sem almoço.", "As abelhas trabalham por nós."] },
    { short: "nov", name: "Novembro", r: 0.15, open: false, stage: "fruto novo",
      title: "Os frutos novos aparecem no lugar da flor.",
      dishes: ["O pomar descansa.", "Reservas da próxima safra abrem em março."] },
    { short: "dez", name: "Dezembro", r: 0.05, open: false, stage: "fruto novo",
      title: "Frutinhos do tamanho de uma ervilha.",
      dishes: ["O pomar descansa.", "Caixa da Estação também pausa até abril."] }
  ];

  const monthsEl = document.querySelector("[data-months]");
  const panel = document.querySelector("[data-month-panel]");
  const today = new Date();

  function renderPanel(i) {
    const m = MONTHS[i];
    const status = m.open ? "Sábados abertos" : "Sem almoço neste mês";
    panel.innerHTML =
      '<div class="mp-state">' +
        '<p class="mp-kicker">' + m.name + " · " + m.stage + "</p>" +
        '<h3 class="mp-title">' + m.title + "</h3>" +
        '<p class="mp-status">' + status + "</p>" +
      "</div>" +
      '<ul class="mp-dishes">' +
        m.dishes.map((d) => "<li" + (m.open ? "" : ' class="rest"') + ">" + d + "</li>").join("") +
      "</ul>";
    panel.setAttribute("aria-labelledby", "mes-" + i);
    document.dispatchEvent(new CustomEvent("bergamota:month", { detail: { index: i } }));
  }

  function selectMonth(i, focus) {
    monthsEl.querySelectorAll(".month").forEach((b, j) => {
      const on = i === j;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    renderPanel(i);
  }

  if (monthsEl && panel) {
    monthsEl.innerHTML = MONTHS.map((m, i) =>
      '<button class="month' + (m.open ? " is-open" : "") + '" type="button" role="tab" id="mes-' + i + '"' +
        ' aria-selected="false" tabindex="-1" aria-label="' + m.name + ", " + m.stage + (m.open ? ", sábados abertos" : "") + '">' +
        '<span class="disc"><span class="fill" style="--r:' + m.r + '"></span></span>' +
        '<span class="m-name">' + m.short + "</span>" +
        '<span class="m-open" aria-hidden="true"></span>' +
      "</button>"
    ).join("");

    monthsEl.addEventListener("click", (e) => {
      const b = e.target.closest(".month");
      if (!b) return;
      selectMonth([...monthsEl.children].indexOf(b));
    });
    monthsEl.addEventListener("keydown", (e) => {
      const keys = { ArrowRight: 1, ArrowLeft: -1, Home: "first", End: "last" };
      if (!(e.key in keys)) return;
      e.preventDefault();
      const cur = [...monthsEl.children].findIndex((b) => b.getAttribute("aria-selected") === "true");
      let next = keys[e.key] === "first" ? 0 : keys[e.key] === "last" ? 11 : (cur + keys[e.key] + 12) % 12;
      selectMonth(next, true);
    });
    // Começa no mês atual se for safra; fora dela, mostra junho (o auge)
    const now = today.getMonth();
    selectMonth(MONTHS[now].open ? now : 5);
  }

  /* ---------- Reserva ---------- */
  const planner = document.querySelector("[data-planner]");
  if (!planner) return;

  const resMonths = planner.querySelector("[data-res-months]");
  const resDays = planner.querySelector("[data-res-days]");
  const resHint = planner.querySelector("[data-res-hint]");
  const seatsHint = planner.querySelector("[data-seats-hint]");
  const sumDate = planner.querySelector("[data-sum-date]");
  const sumLines = planner.querySelector("[data-sum-lines]");
  const totalEl = planner.querySelector("[data-total]");
  const wa = planner.querySelector("[data-wa]");
  const err = planner.querySelector("[data-error]");
  const caixa = planner.querySelector("[data-caixa]");

  // Próxima safra: abril a setembro. Fora dela, mostramos a do ano seguinte.
  const m0 = today.getMonth();
  const seasonYear = m0 > 8 ? today.getFullYear() + 1 : today.getFullYear();
  const OPEN = [3, 4, 5, 6, 7, 8];

  // Lugares restantes: número fixo por data (site conceito), junho mais cheio
  function seatsLeft(d) {
    const seed = (d.getDate() * 37 + d.getMonth() * 11 + d.getFullYear()) % 19;
    const full = d.getMonth() === 5 ? seed < 9 : seed < 3;
    return full ? 0 : Math.max(2, (seed % 15) + 2);
  }

  function saturdays(month) {
    const out = [];
    const d = new Date(seasonYear, month, 1);
    while (d.getDay() !== 6) d.setDate(d.getDate() + 1);
    while (d.getMonth() === month) {
      if (d >= new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)) {
        out.push({ date: new Date(d), left: seatsLeft(d) });
      }
      d.setDate(d.getDate() + 7);
    }
    return out;
  }

  const state = { month: null, day: null, left: SEATS, adults: 2, kids: 0 };

  resMonths.innerHTML = OPEN.map((m) => {
    const has = saturdays(m).length > 0;
    return '<button type="button" class="chip" data-m="' + m + '" aria-pressed="false"' + (has ? "" : " disabled") + ">" +
      MONTHS[m].name + "</button>";
  }).join("");

  function fmtDate(d) {
    return d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  }

  function renderDays() {
    if (state.month === null) return;
    const list = saturdays(state.month);
    resDays.innerHTML = list.map((s, i) => {
      const label = s.date.getDate() + " de " + MONTHS[state.month].name.toLowerCase();
      const note = s.left === 0 ? "lotado" : s.left <= 5 ? "restam " + s.left : s.left + " lugares";
      return '<button type="button" class="chip" data-d="' + i + '" aria-pressed="false"' +
        (s.left === 0 ? " disabled" : "") + ">" + label + "<small>" + note + "</small></button>";
    }).join("");
    resDays._list = list;
    const free = list.filter((s) => s.left > 0).length;
    resHint.textContent = free === 0
      ? "Este mês lotou. Veja o mês seguinte ou peça a Caixa da Estação."
      : free + (free === 1 ? " sábado com lugar." : " sábados com lugar.");
  }

  resMonths.addEventListener("click", (e) => {
    const b = e.target.closest("[data-m]");
    if (!b) return;
    state.month = Number(b.dataset.m);
    state.day = null;
    state.left = SEATS;
    resMonths.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
    renderDays();
    update();
  });

  resDays.addEventListener("click", (e) => {
    const b = e.target.closest("[data-d]");
    if (!b || b.disabled) return;
    const s = resDays._list[Number(b.dataset.d)];
    state.day = s.date;
    state.left = s.left;
    resDays.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
    // Se o grupo for maior que os lugares, ajusta para caber
    while (state.adults + state.kids > state.left) {
      if (state.kids > 0) state.kids--; else state.adults--;
    }
    err.hidden = true;
    update();
  });

  planner.addEventListener("click", (e) => {
    const b = e.target.closest("[data-step]");
    if (!b) return;
    const k = b.dataset.step;
    const dir = Number(b.dataset.dir);
    const min = k === "adults" ? 1 : 0;
    const next = state[k] + dir;
    if (next < min) return;
    if (dir > 0 && state.adults + state.kids >= Math.min(8, state.left)) return;
    state[k] = next;
    update();
  });

  planner.addEventListener("change", update);

  let shownTotal = 0;
  function setTotal(value) {
    const ev = new CustomEvent("bergamota:total", { detail: { from: shownTotal, to: value }, cancelable: true });
    const handled = !document.dispatchEvent(ev);
    if (!handled) totalEl.textContent = brl(value);
    shownTotal = value;
  }

  function update() {
    planner.querySelector('[data-out="adults"]').textContent = state.adults;
    planner.querySelector('[data-out="kids"]').textContent = state.kids;
    const cap = Math.min(8, state.left);
    const people = state.adults + state.kids;
    planner.querySelectorAll('[data-step][data-dir="1"]').forEach((b) => (b.disabled = people >= cap));
    planner.querySelector('[data-step="adults"][data-dir="-1"]').disabled = state.adults <= 1;
    planner.querySelector('[data-step="kids"][data-dir="-1"]').disabled = state.kids <= 0;
    seatsHint.textContent = state.day
      ? "Este sábado tem " + state.left + (state.left === 1 ? " lugar livre." : " lugares livres.") + (cap === 8 && state.left > 8 ? " Grupos acima de 8 pessoas, fale direto conosco." : "")
      : "Até 8 pessoas por reserva.";

    const diets = [...planner.querySelectorAll('input[name="diet"]:checked')].map((i) => i.value);
    const box = caixa.checked;
    const total = state.adults * PRICE_ADULT + state.kids * PRICE_KID + (box ? PRICE_BOX : 0);

    sumDate.textContent = state.day ? fmtDate(state.day) : "Nenhum sábado escolhido";
    const lines = [
      [state.adults + (state.adults === 1 ? " adulto" : " adultos"), brl(state.adults * PRICE_ADULT)]
    ];
    if (state.kids) lines.push([state.kids + (state.kids === 1 ? " criança" : " crianças"), brl(state.kids * PRICE_KID)]);
    if (box) lines.push(["Caixa da Estação", brl(PRICE_BOX)]);
    if (diets.length) lines.push(["Restrições", diets.join(", ")]);
    sumLines.innerHTML = lines.map((l) => "<div><dt>" + l[0] + "</dt><dd>" + l[1] + "</dd></div>").join("");
    setTotal(total);

    const msg = [
      "Olá! Quero reservar o almoço da Casa Bergamota.",
      "Data: " + (state.day ? fmtDate(state.day) : "a combinar"),
      "Adultos: " + state.adults + (state.kids ? " · Crianças: " + state.kids : ""),
      diets.length ? "Restrições: " + diets.join(", ") : "Sem restrições alimentares",
      box ? "Quero levar uma Caixa da Estação." : "",
      "Total estimado: " + brl(total)
    ].filter(Boolean).join("\n");
    wa.href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
    wa.classList.toggle("is-waiting", !state.day);
  }

  wa.addEventListener("click", (e) => {
    if (state.day) return;
    e.preventDefault();
    err.hidden = false;
    resMonths.querySelector(".chip:not(:disabled)")?.focus();
  });

  update();

  /* ---------- Topo: fundo conforme a seção ---------- */
  const top = document.querySelector("[data-top]");
  const fields = [...document.querySelectorAll(".field")];
  function onScroll() {
    const y = 40;
    const onField = fields.some((f) => {
      const r = f.getBoundingClientRect();
      return r.top <= y && r.bottom >= y;
    });
    top.classList.toggle("is-on-field", onField);
    top.classList.toggle("is-solid", !onField && window.scrollY > 10);
    top.classList.toggle("is-at-top", window.scrollY < 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
