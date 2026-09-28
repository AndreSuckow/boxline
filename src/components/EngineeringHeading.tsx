"use client";

import { useEffect, useRef } from "react";

const lines = ["Não é apenas papelão.", "É engenharia", "de embalagem."];

export default function EngineeringHeading() {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = heading.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const letters = Array.from(
      el.querySelectorAll<HTMLElement>("[data-letter]"),
    );
    let index = 0;
    let timer = 0;
    let visible = false;
    const tick = () => {
      letters[index++]?.style.removeProperty("visibility");
      if (index < letters.length && visible)
        timer = window.setTimeout(tick, index === lines[0].length ? 1000 : 45);
    };
    const finish = () => {
      if (!reduced.matches) return;
      window.clearTimeout(timer);
      letters.forEach((letter) => letter.style.removeProperty("visibility"));
      index = letters.length;
    };
    if (!reduced.matches)
      letters.forEach((letter) => (letter.style.visibility = "hidden"));
    else index = letters.length;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.6;
        window.clearTimeout(timer);
        if (visible && index < letters.length)
          timer = window.setTimeout(
            tick,
            index === lines[0].length ? 1000 : 45,
          );
      },
      { threshold: [0, 0.6], rootMargin: "-90px 0px 0px" },
    );
    observer.observe(el);
    reduced.addEventListener("change", finish);
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", finish);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <h2 ref={heading} aria-label={lines.join(" ")}>
      {lines.map((line, index) => (
        <span
          key={line}
          aria-hidden="true"
          style={{ color: index === 2 ? undefined : "inherit" }}
        >
          {index > 0 && <br />}
          {Array.from(line).map((letter, i) => (
            <span key={i} data-letter style={{ color: "inherit" }}>
              {letter}
            </span>
          ))}
        </span>
      ))}
    </h2>
  );
}
