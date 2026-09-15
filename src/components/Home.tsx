"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import ViewportScene from "./ViewportScene";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Box,
  Layers3,
  Ruler,
  ShieldCheck,
  MessageCircle,
  Menu,
  X,
  Check,
  Plus,
  Minus,
} from "lucide-react";

import { business, whatsappUrl } from "@/config/business";
const BoxScene = dynamic(() => import("./BoxScene"), {
  ssr: false,
  loading: () => (
    <div className="box-scene">
      <div className="scene-fallback">
        <div className="mini-box">
          <i />
          <b>boxlyne</b>
        </div>
      </div>
    </div>
  ),
});
const DimensionScene = dynamic(() => import("./DimensionScene"), {
  ssr: false,
  loading: () => (
    <div
      className="dimension-scene dimension-loading"
      aria-label="Carregando desenho das medidas da caixa"
    />
  ),
});
type Fields = {
  length: string;
  width: string;
  height: string;
  quantity: string;
  product: string;
  purpose: string;
};
const initial: Fields = {
  length: String(business.products[0].size[0]),
  width: String(business.products[0].size[1]),
  height: String(business.products[0].size[2]),
  quantity: "1000",
  product: business.products[0].title,
  purpose: "",
};
const questions = [
  [
    "Qual é a quantidade mínima de pedido?",
    "A quantidade depende do modelo, das dimensões e da personalização. Informe o volume desejado para receber uma proposta adequada à sua operação.",
  ],
  [
    "Vocês produzem caixas com a minha marca?",
    "Sim. Conte à equipe comercial o formato, a quantidade e como deseja aplicar sua marca. A viabilidade e as opções de impressão serão avaliadas no orçamento.",
  ],
  [
    "Como escolher o tipo de papelão?",
    "Dimensões, peso, empilhamento e condições de transporte orientam a escolha da estrutura. Compartilhe esses detalhes com vendas para avaliar a solução.",
  ],
  [
    "Como funciona a entrega?",
    "Prazo, frete e cobertura são confirmados no orçamento conforme o local de entrega e as características do pedido.",
  ],
];
export default function Home() {
  const root = useRef<HTMLElement>(null);
  const [menu, setMenu] = useState(false);
  const [items, setItems] = useState<(Fields & { id: number })[]>([
    { ...initial, id: 1 },
  ]);
  const [activeItem, setActiveItem] = useState(1);
  const itemSequence = useRef(1);
  const pendingFocus = useRef<string | null>(null);
  const carouselFrame = useRef(0);
  const fields = items.find((item) => item.id === activeItem)!;
  function setFields(update: (previous: Fields) => Fields) {
    setItems((previous) =>
      previous.map((item) =>
        item.id === activeItem ? { ...update(item), id: item.id } : item,
      ),
    );
  }
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>(
    {},
  );
  const [status, setStatus] = useState("");
  const [handoff, setHandoff] = useState("");
  const [activeDimension, setActiveDimension] = useState<
    "length" | "width" | "height"
  >("length");

  const [faq, setFaq] = useState<number | null>(null);
  const [hero3d, setHero3d] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setHero3d(true), 8000);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const counters = new Set<number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.classList.remove("reveal-pending");
          observer.unobserve(el);
          if (el.dataset.count) {
            const value = Number(el.dataset.count);
            const start = performance.now();
            const format = new Intl.NumberFormat("pt-BR");
            const tick = (now: number) => {
              const progress = Math.min((now - start) / 1200, 1);
              el.textContent = format.format(
                Math.round(value * (1 - Math.pow(1 - progress, 3))),
              );
              if (progress < 1) {
                const id = requestAnimationFrame(tick);
                counters.add(id);
              }
            };
            const id = requestAnimationFrame(tick);
            counters.add(id);
          }
        });
      },
      { rootMargin: "0px 0px 60px 0px" },
    );
    root.current
      ?.querySelectorAll<HTMLElement>(".reveal, [data-count]")
      .forEach((el) => {
        if (el.classList.contains("reveal")) el.classList.add("reveal-pending");
        observer.observe(el);
      });
    return () => {
      observer.disconnect();
      counters.forEach(cancelAnimationFrame);
    };
  }, []);
  useEffect(() => {
    if (!menu) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);
  useEffect(() => {
    if (pendingFocus.current) {
      document.getElementById(pendingFocus.current)?.focus();
      pendingFocus.current = null;
    }
  }, [activeItem, errors]);
  useEffect(() => () => cancelAnimationFrame(carouselFrame.current), []);
  function carouselSpeed(element: HTMLElement, rate: number) {
    const animation = element
      .querySelector(".company-track")
      ?.getAnimations()[0];
    if (!animation) return;
    cancelAnimationFrame(carouselFrame.current);
    const startRate = animation.playbackRate;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 650, 1);
      animation.updatePlaybackRate(
        startRate + (rate - startRate) * (1 - Math.pow(1 - progress, 3)),
      );
      if (progress < 1) carouselFrame.current = requestAnimationFrame(tick);
    };
    carouselFrame.current = requestAnimationFrame(tick);
  }
  function chooseItem(id: number) {
    setActiveItem(id);
    setErrors({});
  }
  function addItem() {
    const id = ++itemSequence.current;
    setItems((previous) => [
      ...previous,
      {
        ...initial,
        id,
        length: "",
        width: "",
        height: "",
        quantity: "",
        product: "Sob medida",
        purpose: "",
      },
    ]);
    pendingFocus.current = "length";
    setActiveItem(id);
    setErrors({});
    setHandoff("");
    setStatus("");
  }
  function removeItem() {
    if (items.length === 1) return;
    const index = items.findIndex((item) => item.id === activeItem);
    const remaining = items.filter((item) => item.id !== activeItem);
    const next = remaining[Math.min(index, remaining.length - 1)];
    setItems(remaining);
    setActiveItem(next.id);
    pendingFocus.current = "quote-item-" + next.id;
    setErrors({});
    setHandoff("");
    setStatus("");
  }
  function validate(item: Fields) {
    const next: Partial<Record<keyof Fields, string>> = {};
    (["length", "width", "height", "quantity"] as const).forEach((key) => {
      const n = Number(item[key]);
      if (
        !Number.isFinite(n) ||
        n < (key === "quantity" ? 1 : 0.1) ||
        n > (key === "quantity" ? 10000000 : 300)
      ) {
        next[key] =
          key === "quantity"
            ? "Informe de 1 a 10.000.000 unidades."
            : "Informe de 0,1 a 300 cm.";
      } else if (key === "quantity" && !Number.isInteger(n))
        next[key] = "Informe uma quantidade inteira.";
    });
    if (!item.purpose.trim())
      next.purpose = "Conte qual produto será embalado.";
    return next;
  }
  function change(key: keyof Fields, value: string) {
    setFields((old) => ({ ...old, [key]: value }));
    setErrors((old) => ({ ...old, [key]: undefined }));
    setHandoff("");
    setStatus("");
  }
  function selectProduct(index: number) {
    const p = business.products[index];
    setFields((old) => ({
      ...old,
      product: p.title,
      length: String(p.size[0]),
      width: String(p.size[1]),
      height: String(p.size[2]),
    }));
    setErrors({});
    setHandoff("");
    setStatus("");
    document.getElementById("orcamento")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  function selectPostal(index: number) {
    const p = business.postalSizes[index];
    setFields((old) => ({
      ...old,
      product: "Caixas para Correios",
      length: String(p.size[0]),
      width: String(p.size[1]),
      height: String(p.size[2]),
      purpose: "Envio pelos Correios",
    }));
    setErrors({});
    setStatus("");
    setHandoff("");
    document.getElementById("orcamento")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    for (const [index, item] of items.entries()) {
      const next = validate(item);
      if (Object.keys(next).length) {
        pendingFocus.current = Object.keys(next)[0];
        setActiveItem(item.id);
        setErrors(next);
        setHandoff("");
        setStatus(
          "Revise os campos do tipo " +
            (index + 1) +
            " antes de enviar o orçamento.",
        );
        return;
      }
    }
    setErrors({});
    const message =
      "Olá, " +
      business.name +
      "! Gostaria de solicitar um orçamento de caixas de papelão.\n\n" +
      items
        .map(
          (item, index) =>
            (items.length > 1 ? "TIPO " + (index + 1) + "\n" : "") +
            "Modelo: " +
            item.product +
            "\nMedidas (C × L × A): " +
            item.length +
            " × " +
            item.width +
            " × " +
            item.height +
            " cm\nQuantidade: " +
            Number(item.quantity).toLocaleString("pt-BR") +
            " unidades\nFinalidade: " +
            item.purpose.trim(),
        )
        .join("\n\n");
    const url = whatsappUrl(message);
    setHandoff(url);
    window.open(url, "_blank", "noopener,noreferrer");
    setStatus(
      "Orçamento preparado. Conclua o envio no WhatsApp. Se ele não abriu, use o link abaixo.",
    );
  }
  const labels = { length: "Comprimento", width: "Largura", height: "Altura" };
  return (
    <main ref={root}>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="header">
        <Link href="/" className="logo" aria-label="Boxlyne, início">
          <Box strokeWidth={1.6} />
          {business.name.toLowerCase()}
          <span className="logo-dot">.</span>
        </Link>
        <button
          id="menu-toggle"
          className="menu-toggle"
          onClick={() => setMenu(!menu)}
          aria-expanded={menu}
          aria-controls="navigation"
          aria-label={menu ? "Fechar menu" : "Abrir menu"}
        >
          {menu ? <X /> : <Menu />}
        </button>
        <nav
          id="navigation"
          className={menu ? "nav open" : "nav"}
          aria-label="Navegação principal"
        >
          {[
            ["engenharia", "A caixa por dentro"],
            ["produtos", "Nossas caixas"],
            ["sobre", "Sobre a Boxlyne"],
          ].map(([id, label]) => (
            <a key={id} href={"#" + id} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
          <a
            href="#orcamento"
            className="nav-cta"
            onClick={() => setMenu(false)}
          >
            Solicitar orçamento <ArrowUpRight size={15} />
          </a>
        </nav>
      </header>
      <section className="hero" id="conteudo">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="small-line" />
            ENGENHARIA QUE PROTEGE
          </p>
          <h1>
            Proteção começa
            <br />
            na <span>embalagem.</span>
          </h1>
          <p className="hero-description">
            Por fora, uma caixa.
            <br />
            Por dentro, o cuidado com tudo o que importa.
          </p>
          <div className="hero-actions">
            <a href="#orcamento" className="button">
              Solicitar orçamento <ArrowUpRight size={18} />
            </a>
            <a className="text-link" href="#produtos">
              Conhecer nossas caixas <ArrowRight size={17} />
            </a>
          </div>
          <div className="hero-trust">
            <ShieldCheck size={18} />
            <span>Feita para o seu produto. Pensada para o seu negócio.</span>
          </div>
        </div>
        <div className="hero-art">
          <div className="orbit" />
          <span className="art-label">
            PAPELÃO ONDULADO / PRECISÃO EM CADA DOBRA
          </span>
          <div
            className="hero-scene-loader"
            onPointerEnter={() => setHero3d(true)}
            onPointerDown={() => setHero3d(true)}
          >
            {hero3d ? (
              <BoxScene />
            ) : (
              <div className="box-scene">
                <div className="scene-fallback">
                  <div className="mini-box">
                    <i />
                    <b>boxlyne</b>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="material-label">
            <span className="material-dot" />
            Estrutura inteligente.
            <br />
            <strong>Proteção em todas as faces.</strong>
          </div>
          <span className="interaction-hint">
            Mova o mouse ou arraste com o dedo para girar.
          </span>
        </div>
        <div className="hero-bottom">
          <a href="#engenharia">
            <ArrowDown size={16} />
            Role para descobrir o que há por dentro
          </a>
          <span>DESENVOLVIDA PARA IR ALÉM.</span>
        </div>
      </section>
      <div className="benefit-strip">
        <span>
          <ShieldCheck />
          Proteção do início ao destino
        </span>
        <span>
          <Ruler />
          Medidas que fazem sentido
        </span>
        <span>
          <Layers3 />
          Estrutura para cada operação
        </span>
        <span>
          <Box />
          Sua marca, bem embalada
        </span>
      </div>
      <section className="company-banner" aria-labelledby="companies-title">
        <div className="company-heading">
          <div>
            <p className="eyebrow">BOAS PARCERIAS. BOAS ENTREGAS.</p>
            <h2 id="companies-title">Quem confia na Boxlyne.</h2>
          </div>
        </div>
        <div
          tabIndex={0}
          role="region"
          aria-label="Empresas parceiras"
          className="company-marquee"
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") carouselSpeed(e.currentTarget, 0.25);
          }}
          onPointerLeave={(e) => carouselSpeed(e.currentTarget, 1)}
        >
          <div className="company-track">
            {[0, 1].map((copy) => (
              <ul
                className="company-list"
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
              >
                {business.companies.map((company) => (
                  <li key={company}>
                    <Box size={22} strokeWidth={1.2} aria-hidden="true" />
                    <span>{company}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <p className="company-placeholder">
          Espaço reservado para as empresas parceiras.
        </p>
      </section>
      <section className="engineering section" id="engenharia">
        <div className="section-heading reveal">
          <p className="eyebrow">A CAIXA POR DENTRO</p>
          <h2>
            Simples na forma.
            <br />
            <span>Extraordinária na estrutura.</span>
          </h2>
          <p>
            A força de uma caixa está no que você não vê.
            <br />
            Três camadas trabalhando como uma só.
          </p>
        </div>
        <div className="engineering-scroll">
          <div className="engineering-grid">
            <div className="exploded-art">
              <ViewportScene>
                <BoxScene exploded />
              </ViewportScene>
              <span className="technical-caption">
                CORTE ESTRUTURAL / PAPELÃO ONDULADO
              </span>
            </div>
            <div className="layer-descriptions">
              {[
                [
                  "01",
                  "Face externa",
                  "A primeira linha de proteção.",
                  "Distribui os esforços do manuseio e oferece a superfície para a sua marca.",
                ],
                [
                  "02",
                  "Miolo ondulado",
                  "A resistência vem de dentro.",
                  "A geometria das ondas ajuda a absorver impactos e sustentar a estrutura.",
                ],
                [
                  "03",
                  "Face interna",
                  "Cuidado em contato com o produto.",
                  "Completa a estrutura e cria uma superfície uniforme para acomodar o conteúdo.",
                ],
              ].map(([n, title, sub, text]) => (
                <article key={n} className="layer">
                  <span>{n}</span>
                  <div>
                    <h3>{title}</h3>
                    <strong>{sub}</strong>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="precision section">
        <div className="precision-intro reveal">
          <p className="eyebrow">CADA DETALHE TEM UM PROPÓSITO</p>
          <h2>
            Não é apenas papelão.
            <br />É engenharia
            <br />
            <span>de embalagem.</span>
          </h2>
          <p>
            Material, medidas e formato precisam trabalhar juntos. Desenvolvemos
            a caixa a partir do que ela precisa proteger.
          </p>
        </div>
        <div className="precision-features">
          {[
            [
              ShieldCheck,
              "Resistência na medida certa",
              "Estrutura escolhida conforme peso, empilhamento e transporte.",
            ],
            [
              Layers3,
              "A onda faz a diferença",
              "O perfil do papelão influencia a rigidez e a absorção de impactos.",
            ],
            [
              Ruler,
              "Menos espaço. Mais eficiência.",
              "Dimensões alinhadas ao produto, ao estoque e à sua logística.",
            ],
          ].map(([Icon, title, text]) => {
            const I = Icon as typeof Ruler;
            return (
              <article className="reveal" key={String(title)}>
                <I size={28} strokeWidth={1.3} />
                <h3>{String(title)}</h3>
                <p>{String(text)}</p>
              </article>
            );
          })}
        </div>
      </section>
      <section className="products section" id="produtos">
        <div className="catalog-heading reveal">
          <div>
            <p className="eyebrow">NOSSAS CAIXAS</p>
            <h2>
              Existe uma caixa certa
              <br />
              <span>para o seu próximo passo.</span>
            </h2>
          </div>
          <p>
            Do primeiro envio à operação em escala.
            <br />
            Encontre o ponto de partida para sua solução.
          </p>
        </div>
        <div className="product-grid">
          {business.products.map((p, i) => (
            <article className="product-card reveal" key={p.id}>
              <div className={"product-image " + p.style}>
                <div className="mini-box">
                  <i />
                  <b>{p.style === "print" ? "sua marca" : ""}</b>
                </div>
                <span>{p.dimensions}</span>
              </div>
              <p className="product-tag">{p.tag}</p>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <button
                className="product-action"
                onClick={() => selectProduct(i)}
              >
                Orçar este modelo <ArrowUpRight size={18} />
              </button>
            </article>
          ))}
        </div>
      </section>
      <section className="postal section" id="correios">
        <div className="catalog-heading reveal">
          <div>
            <p className="eyebrow">DO SEU NEGÓCIO PARA TODO O BRASIL</p>
            <h2>
              Caixas para envios
              <br />
              <span>pelos Correios.</span>
            </h2>
          </div>
          <p>
            Fabricamos caixas de papelão para suas postagens.
            <br />
            Escolha um ponto de partida ou peça sob medida.
          </p>
        </div>
        <div className="postal-grid">
          {business.postalSizes.map((p, i) => (
            <article className="postal-card reveal" key={p.name}>
              <div className={"postal-art postal-size-" + i} aria-hidden="true">
                <div className="postal-box">
                  <span
                    className="correios-print"
                    style={{
                      maskImage:
                        "url(" +
                        (process.env.NEXT_PUBLIC_BASE_PATH || "") +
                        "/brands/correios.svg)",
                    }}
                  />
                  <i />
                  <b />
                </div>
              </div>
              <p className="eyebrow">{p.name.toUpperCase()}</p>
              <h3>
                {p.size.join(" × ")} <span>cm</span>
              </h3>
              <p>{p.description}</p>
              <button
                className="product-action"
                type="button"
                onClick={() => selectPostal(i)}
              >
                Orçar esta medida <ArrowUpRight size={18} />
              </button>
            </article>
          ))}
        </div>
        <div className="postal-note">
          <Ruler size={19} />
          <p>
            Comprimento × largura × altura. Medidas iniciais de catálogo;
            confirme o formato e as condições de postagem no orçamento.
          </p>
        </div>
      </section>
      <section className="capacity section" id="sobre">
        <div className="capacity-copy reveal">
          <p className="eyebrow">BOXLYNE. DO PROJETO À ENTREGA.</p>
          <h2>
            Seu produto merece cuidado.
            <br />
            <span>Sua operação, um parceiro.</span>
          </h2>
          <p>
            Transformamos necessidades de embalagem em soluções de papelão. Com
            atenção às medidas, aos materiais e a cada etapa do seu negócio.
          </p>
        </div>
        <div className="stats">
          {business.stats.map((s) => (
            <div key={s.label}>
              <strong>
                {s.prefix}
                <span data-count={s.value}>
                  {s.value.toLocaleString("pt-BR")}
                </span>
                {s.suffix}
              </strong>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
        {business.demo && (
          <p className="demo-note">
            Indicadores demonstrativos para apresentação da Boxlyne.
          </p>
        )}
      </section>
      <section className="quote section" id="orcamento">
        <div className="quote-copy reveal">
          <p className="eyebrow">DO SEU JEITO. NAS SUAS MEDIDAS.</p>
          <h2>
            A próxima caixa
            <br />
            começa <span>com você.</span>
          </h2>
          <p>
            Conte o que você precisa. Nossa equipe ajuda a encontrar a estrutura
            e o formato para sua operação.
          </p>
          <div className="quote-steps">
            <p>
              <Check size={17} />
              Proposta alinhada ao seu produto
            </p>
            <p>
              <Check size={17} />
              Atendimento direto com vendas
            </p>
            <p>
              <Check size={17} />
              Sem compromisso
            </p>
          </div>
          <div className="dimension-guide">
            <p className="eyebrow">ENTENDA SUAS MEDIDAS</p>
            <h3>C × L × A: cada direção tem uma medida.</h3>
            <ViewportScene className="dimension-slot">
              <DimensionScene
                length={fields.length}
                width={fields.width}
                height={fields.height}
                active={activeDimension}
              />
            </ViewportScene>
            <div className="dimension-tabs" aria-label="Explorar as medidas">
              {(["length", "width", "height"] as const).map((axis) => (
                <button
                  type="button"
                  key={axis}
                  className={activeDimension === axis ? "is-active" : ""}
                  aria-pressed={activeDimension === axis}
                  onClick={() => setActiveDimension(axis)}
                >
                  <span>
                    {axis === "length" ? "C" : axis === "width" ? "L" : "A"}
                  </span>
                  {labels[axis]}
                </button>
              ))}
            </div>
            <p className="dimension-explanation" id="dimension-help">
              {activeDimension === "length"
                ? "Comprimento: a medida de uma ponta à outra da base, na direção indicada por C."
                : activeDimension === "width"
                  ? "Largura: a medida transversal da base, na direção indicada por L."
                  : "Altura: a distância da base ao topo da caixa, na direção indicada por A."}{" "}
              Informe as medidas internas, em centímetros. O desenho acompanha
              os valores do formulário.
            </p>
          </div>
        </div>
        <form noValidate onSubmit={submit} className="quote-form">
          <div className="form-heading">
            <h3>Vamos dimensionar sua ideia.</h3>
            <p>
              Informe as medidas internas da caixa, em centímetros. Precisa de
              modelos diferentes? Adicione cada tipo ao mesmo pedido.
            </p>
          </div>
          <div
            className="quote-items"
            aria-label="Tipos de caixas no orçamento"
          >
            <div className="quote-items-heading">
              <strong>
                {items.length}{" "}
                {items.length === 1 ? "tipo de caixa" : "tipos de caixas"}
              </strong>
              <span>Um único orçamento</span>
            </div>
            <div className="quote-item-list">
              {items.map((item, index) => (
                <button
                  type="button"
                  id={"quote-item-" + item.id}
                  key={item.id}
                  aria-pressed={activeItem === item.id}
                  onClick={() => chooseItem(item.id)}
                >
                  <span>
                    Tipo {index + 1} <b>{item.product}</b>
                  </span>
                  <small>
                    {item.length && item.width && item.height
                      ? item.length +
                        " × " +
                        item.width +
                        " × " +
                        item.height +
                        " cm"
                      : "Preencha as medidas"}{" "}
                    ·{" "}
                    {item.quantity
                      ? Number(item.quantity).toLocaleString("pt-BR") + " un."
                      : "Quantidade a definir"}
                  </small>
                </button>
              ))}
            </div>
          </div>
          <div className="quote-current-heading">
            <h4>
              Tipo {items.findIndex((item) => item.id === activeItem) + 1}:{" "}
              {fields.product}
            </h4>
            {items.length > 1 && (
              <button
                type="button"
                className="remove-quote-item"
                onClick={removeItem}
              >
                Remover este tipo <X size={14} />
              </button>
            )}
          </div>
          <div className="dimensions">
            {(["length", "width", "height"] as const).map((key) => (
              <div className="field" key={key}>
                <label htmlFor={key}>{labels[key]}</label>
                <div className="unit-input">
                  <input
                    id={key}
                    type="number"
                    min=".1"
                    max="300"
                    step=".1"
                    inputMode="decimal"
                    value={fields[key]}
                    onChange={(e) => change(key, e.target.value)}
                    aria-invalid={!!errors[key]}
                    onFocus={() => setActiveDimension(key)}
                    aria-describedby={key + "-error dimension-help"}
                  />
                  <span>cm</span>
                </div>
                <p id={key + "-error"} className="field-error">
                  {errors[key]}
                </p>
              </div>
            ))}
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="quantity">Quantidade</label>
              <div className="unit-input">
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max="10000000"
                  step="1"
                  inputMode="numeric"
                  value={fields.quantity}
                  onChange={(e) => change("quantity", e.target.value)}
                  aria-invalid={!!errors.quantity}
                  aria-describedby="quantity-error"
                />
                <span>un.</span>
              </div>
              <p className="field-error" id="quantity-error">
                {errors.quantity}
              </p>
            </div>
            <div className="field">
              <label htmlFor="product">Tipo de caixa</label>
              <select
                id="product"
                value={fields.product}
                onChange={(e) => change("product", e.target.value)}
              >
                <option>Caixas para Correios</option>
                {business.products.map((p) => (
                  <option key={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="purpose">O que você vai embalar?</label>
            <textarea
              id="purpose"
              maxLength={1500}
              rows={3}
              placeholder="Ex.: cosméticos de até 2 kg, para envio por transportadora."
              value={fields.purpose}
              onChange={(e) => change("purpose", e.target.value)}
              aria-invalid={!!errors.purpose}
              aria-describedby="purpose-error"
            />
            <p className="field-error" id="purpose-error">
              {errors.purpose}
            </p>
          </div>
          <button className="add-quote-item" type="button" onClick={addItem}>
            <Plus size={18} />
            Adicionar outro tipo de caixa
          </button>
          <button className="button form-submit" type="submit">
            <MessageCircle size={19} />
            Solicitar orçamento <ArrowUpRight size={18} />
          </button>
          <p className="form-note">
            Todos os tipos de caixas serão enviados juntos na mesma mensagem do
            WhatsApp.
          </p>
          <div role="status" className="form-status">
            {status}
          </div>
          {handoff && (
            <a
              className="text-link"
              target="_blank"
              rel="noopener noreferrer"
              href={handoff}
            >
              Continuar no WhatsApp <ArrowUpRight size={16} />
            </a>
          )}
        </form>
      </section>
      <section className="faq section">
        <div>
          <p className="eyebrow">ANTES DE COMEÇAR</p>
          <h2>
            Algumas respostas.
            <br />
            <span>Outras, a gente constrói junto.</span>
          </h2>
        </div>
        <div className="faq-items">
          {questions.map(([q, a], i) => (
            <article key={q}>
              <h3>
                <button
                  aria-expanded={faq === i}
                  aria-controls={"faq-" + i}
                  onClick={() => setFaq(faq === i ? null : i)}
                >
                  {q}
                  {faq === i ? <Minus size={18} /> : <Plus size={18} />}
                </button>
              </h3>
              <div id={"faq-" + i} hidden={faq !== i}>
                <p>{a}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="final-cta">
        <p className="eyebrow">BOAS ENTREGAS COMEÇAM AQUI.</p>
        <h2>
          Vamos encontrar a embalagem
          <br />
          certa para o seu produto.
        </h2>
        <a
          className="button light"
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
        >
          Falar com vendas pelo WhatsApp <ArrowUpRight size={18} />
        </a>
        <p>{business.response}</p>
      </section>
      <footer className="footer">
        <div>
          <Link className="logo" href="/">
            <Box strokeWidth={1.6} />
            {business.name.toLowerCase()}.
          </Link>
          <p>
            {business.tagline}.<br />
            Cuidado em cada entrega.
          </p>
        </div>
        <div>
          <p className="eyebrow">VAMOS CONVERSAR</p>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            {business.phone}
          </a>
          <a href={"mailto:" + business.email}>{business.email}</a>
          <p>{business.hours}</p>
        </div>
        <div>
          <p className="eyebrow">FEITA PARA IR MAIS LONGE</p>
          <p>{business.address}</p>
          <a href="#orcamento">
            Solicitar orçamento <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {business.name}.
          </span>
          <span>
            {business.demo
              ? "Site demonstrativo • Contatos e dados comerciais fictícios"
              : "Engenharia que protege."}
          </span>
          <a href="#conteudo">Voltar ao topo ↑</a>
        </div>
      </footer>
      <a
        className="floating-whatsapp"
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a Boxlyne pelo WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
    </main>
  );
}
