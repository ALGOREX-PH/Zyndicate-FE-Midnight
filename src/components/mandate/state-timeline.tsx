import type { MandateState } from "../../api/schemas";
import { STATE_META } from "../ui/state-pill";
import { Stepper, type Step } from "../ui/stepper";

const MAIN_PATH: MandateState[] = [
  "draft",
  "open_for_bids",
  "bidding_closed",
  "awarded",
  "in_execution",
  "submitted",
  "accepted",
  "settled",
];

/** The 11-state machine as a visual stepper, including branch states. */
export function StateTimeline({ state }: { state: MandateState }) {
  const steps: Step[] = [];
  const mainIndex = MAIN_PATH.indexOf(state);

  if (mainIndex >= 0) {
    for (let i = 0; i < MAIN_PATH.length; i++) {
      const s = MAIN_PATH[i]!;
      steps.push({
        id: s,
        label: STATE_META[s].label,
        status: i < mainIndex ? "done" : i === mainIndex ? "current" : "upcoming",
      });
    }
  } else if (state === "disputed" || state === "resolved") {
    // the dispute froze the flow after submission
    const frozenAt = MAIN_PATH.indexOf("submitted");
    for (let i = 0; i <= frozenAt; i++) {
      const s = MAIN_PATH[i]!;
      steps.push({ id: s, label: STATE_META[s].label, status: "done" });
    }
    steps.push({
      id: "disputed",
      label: STATE_META.disputed.label,
      status: state === "disputed" ? "halt" : "done",
    });
    if (state === "resolved") {
      steps.push({ id: "resolved", label: STATE_META.resolved.label, status: "current" });
    } else {
      steps.push({ id: "resolved", label: STATE_META.resolved.label, status: "upcoming" });
    }
  } else {
    // cancelled — the path stopped where it stood
    steps.push({ id: "draft", label: STATE_META.draft.label, status: "done" });
    steps.push({ id: "cancelled", label: STATE_META.cancelled.label, status: "halt" });
  }

  return (
    <div className="overflow-x-auto pb-1" aria-label="Mandate lifecycle">
      <Stepper steps={steps} className="flex-nowrap" />
    </div>
  );
}
