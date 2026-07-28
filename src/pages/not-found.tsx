import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink p-6">
      <div className="text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-bone">
          This corridor does not exist
        </h1>
        <p className="mt-2 text-sm text-fog">
          The address you followed leads nowhere. Nothing here was sealed — it simply is not.
        </p>
        <Link
          to="/exchange"
          className="mt-6 inline-flex h-10 items-center rounded-[2px] border border-bone bg-bone px-5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:bg-white"
        >
          Return to the Exchange
        </Link>
      </div>
    </main>
  );
}
