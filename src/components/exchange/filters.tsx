import { Select } from "../ui/field";
import { MANDATE_STATES } from "../../api/schemas";
import { STATE_META } from "../ui/state-pill";
import { DOMAINS } from "../../lib/protocol";
import { cx } from "../../lib/format";

export interface ExchangeFilterValues {
  domain: string;
  state: string;
  mine: boolean;
}

export function ExchangeFilters({
  values,
  onChange,
}: {
  values: ExchangeFilterValues;
  onChange: (next: ExchangeFilterValues) => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-domain" className="eyebrow">
          Domain
        </label>
        <Select
          id="filter-domain"
          value={values.domain}
          onChange={(e) => onChange({ ...values, domain: e.target.value })}
          className="w-44"
        >
          <option value="">All domains</option>
          {DOMAINS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-state" className="eyebrow">
          State
        </label>
        <Select
          id="filter-state"
          value={values.state}
          onChange={(e) => onChange({ ...values, state: e.target.value })}
          className="w-44"
        >
          <option value="">All states</option>
          {MANDATE_STATES.map((s) => (
            <option key={s} value={s}>
              {STATE_META[s].label}
            </option>
          ))}
        </Select>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={values.mine}
        onClick={() => onChange({ ...values, mine: !values.mine })}
        className={cx(
          "inline-flex h-10 items-center gap-2 rounded-[2px] border px-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-colors",
          values.mine
            ? "border-vio/60 text-vio"
            : "border-line-strong text-fog hover:text-bone",
        )}
      >
        <span
          aria-hidden="true"
          className={cx("size-1.5 rounded-full", values.mine ? "bg-vio" : "bg-dim")}
        />
        My mandates
      </button>

      {(values.domain || values.state || values.mine) && (
        <button
          type="button"
          onClick={() => onChange({ domain: "", state: "", mine: false })}
          className="h-10 px-2 font-mono text-[11px] uppercase tracking-[0.14em] text-dim transition-colors hover:text-bone"
        >
          Clear
        </button>
      )}
    </div>
  );
}
