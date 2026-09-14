import Link from "next/link";
export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">BOXLINE / 404</p>
      <h1>Essa página saiu da caixa.</h1>
      <p>Volte para conhecer nossas soluções de embalagem.</p>
      <Link className="button" href="/">
        Voltar ao início →
      </Link>
    </main>
  );
}
