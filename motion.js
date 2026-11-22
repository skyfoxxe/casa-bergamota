/* Casa Bergamota · movimento (plano Estratégico)
   GSAP + ScrollTrigger + Lenis, sempre dentro de gsap.matchMedia.
   Sem JS ou com movimento reduzido, a página já está completa e parada. */
(() => {
  "use strict";
  if (!window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  const EASE_OUT = "expo.out";    // entradas: rápido no começo, cauda longa
  const EASE_SOFT = "power3.out"; // revelações de seção

  /* Quebra um título em linhas reais (pelo offsetTop de cada palavra) */
  function splitLines(el) {
    const text = el.textContent.trim().replace(/\s+/g, " ");
    el.setAttribute("aria-label", text);
    el.innerHTML = text.split(" ").map((w) => '<span class="w">' + w + "</span>").join(" ");
    const words = [...el.querySelectorAll(".w")];
    const lines = [];
    let top = null;
    words.forEach((w) => {
      if (w.offsetTop !== top) { lines.push([]); top = w.offsetTop; }
      lines[lines.length - 1].push(w.textContent);
    });
    el.innerHTML = lines.map((l) => '<span class="ln" aria-hidden="true"><span>' + l.join(" ") + "</span></span>").join("");
    return [...el.querySelectorAll(".ln > span")];
  }

  const mm = gsap.matchMedia();

  mm.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 900px) and (prefers-reduced-motion: no-preference)"
    },
    (ctx) => {
      const { motion, desktop } = ctx.conditions;
      if (!motion) return;
      document.documentElement.classList.add("js-motion");

      /* Rolagem suave */
      let lenis = null;
      if (window.Lenis) {
        lenis = new window.Lenis({ duration: 1.1, anchors: { offset: -72 } });
        lenis.on("scroll", ScrollTrigger.update);
        const raf = (t) => lenis.raf(t * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
        ctx.add(() => () => { gsap.ticker.remove(raf); lenis.destroy(); });
      }

      /* 1 · Abertura: selo, linhas do título, foto que se abre de baixo para cima */
      const hero = gsap.timeline({ defaults: { ease: EASE_OUT } });
      hero
        .from(".top .seal", { scale: 0.6, rotation: -90, opacity: 0, duration: 0.9 }, 0)
        .from(".top .brand-name, .top .nav, .top .top-cta", { opacity: 0, y: -8, duration: 0.6, stagger: 0.05 }, 0.1)
        .from(".hero-title .line > span", { yPercent: 110, duration: 1.1, stagger: 0.09 }, 0.15)
        .from(".hero-photo .frame", { clipPath: "inset(100% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" }, 0.2)
        .from(".hero-photo img", { scale: 1.18, duration: 1.6 }, 0.2)
        .from("[data-hero-item]", { opacity: 0, y: 14, duration: 0.8, stagger: 0.08 }, 0.55)
        .from(".vertical", { opacity: 0, y: 20, duration: 0.9 }, 0.9);

      /* Foto da abertura desce devagar com a rolagem (só desktop) */
      if (desktop) {
        gsap.to(".hero-photo .frame", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 }
        });
      }

      /* Títulos grandes entram linha a linha (depois das fontes, para medir as linhas certas) */
      ctx.add("splitLines", () => {
        document.querySelectorAll("[data-lines]").forEach((el) => {
          const lines = splitLines(el);
          gsap.from(lines, {
            yPercent: 110,
            duration: 1,
            ease: EASE_OUT,
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 82%", once: true }
          });
        });
        ScrollTrigger.refresh();
      });
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => ctx.splitLines && ctx.splitLines());

      /* Revelação padrão das seções */
      gsap.utils.toArray("[data-rise]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 18,
          duration: 0.9,
          ease: EASE_SOFT,
          scrollTrigger: { trigger: el, start: "top 86%", once: true }
        });
      });

      /* 3 · A safra: as frutas amadurecem uma por uma quando a régua aparece */
      gsap.from(".month .fill", {
        yPercent: 100,
        duration: 1.1,
        ease: "power2.out",
        stagger: 0.07,
        scrollTrigger: { trigger: ".months", start: "top 80%", once: true }
      });

      /* Troca de mês: o painel desliza 8px e aparece. Curto, porque é repetido */
      const onMonth = () => {
        gsap.fromTo(
          ".month-panel > *",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.32, ease: "power2.out", stagger: 0.05, overwrite: true }
        );
      };
      document.addEventListener("bergamota:month", onMonth);
      ctx.add(() => () => document.removeEventListener("bergamota:month", onMonth));

      /* 4 · A mesa: o prato vai sendo servido, um tempo por fatia */
      const mesa = document.querySelector("[data-mesa]");
      const tempos = gsap.utils.toArray(".tempo");
      const wedges = gsap.utils.toArray("[data-wedge]");
      const num = document.querySelector("[data-plate-num]");
      if (mesa && tempos.length && wedges.length) {
        gsap.set(wedges, { scale: 0.001, transformOrigin: "0px 0px" });
        if (desktop) mesa.classList.add("is-tracking");
        const setActive = (i) => {
          tempos.forEach((t, j) => t.classList.toggle("is-active", j === i));
          if (num) num.textContent = String(i + 1);
        };
        setActive(0);
        tempos.forEach((t, i) => {
          ScrollTrigger.create({
            trigger: t,
            start: desktop ? "top 58%" : "top 80%",
            end: "bottom 58%",
            onEnter: () => {
              setActive(i);
              gsap.to(wedges.slice(0, i + 1), { scale: 1, duration: 0.7, ease: EASE_OUT, stagger: 0.04, overwrite: true });
            },
            onEnterBack: () => setActive(i),
            onLeaveBack: () => {
              if (i === 0) return;
              setActive(i - 1);
              gsap.to(wedges.slice(i), { scale: 0.001, duration: 0.45, ease: "power2.out", overwrite: true });
            }
          });
        });
        ctx.add(() => () => mesa.classList.remove("is-tracking"));
      }

      /* Foto da mesa abre de lado (segunda e última revelação por recorte) */
      gsap.from(".mesa-photo img", {
        clipPath: "inset(0% 100% 0% 0%)",
        duration: 1.3,
        ease: "expo.inOut",
        scrollTrigger: { trigger: ".mesa-photo", start: "top 80%", once: true }
      });

      /* 6 · Reserva: o total conta até o novo valor */
      const totalEl = document.querySelector("[data-total]");
      const onTotal = (e) => {
        if (!totalEl) return;
        e.preventDefault();
        const proxy = { v: e.detail.from };
        gsap.to(proxy, {
          v: e.detail.to,
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
          onUpdate: () => { totalEl.textContent = "R$ " + Math.round(proxy.v).toLocaleString("pt-BR"); }
        });
      };
      document.addEventListener("bergamota:total", onTotal);
      ctx.add(() => () => document.removeEventListener("bergamota:total", onTotal));

      /* Selo do rodapé gira para o lugar uma vez */
      gsap.from(".seal-foot", {
        rotation: -120,
        scale: 0.7,
        opacity: 0,
        duration: 1,
        ease: EASE_OUT,
        scrollTrigger: { trigger: ".foot", start: "top 92%", once: true }
      });

      /* Recalcula depois de fontes e imagens */
      const refresh = () => ScrollTrigger.refresh();
      document.fonts && document.fonts.ready.then(refresh);
      window.addEventListener("load", refresh, { once: true });

      return () => document.documentElement.classList.remove("js-motion");
    }
  );
})();
