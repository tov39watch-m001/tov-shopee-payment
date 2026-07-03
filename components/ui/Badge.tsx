import { BADGE_COLORS, BADGE_LABELS } from "@/lib/utils";

export function Badge({ badge }: { badge: string }) {
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${BADGE_COLORS[badge] ?? "bg-gray-700 text-white"}`}>
      {BADGE_LABELS[badge] ?? badge}
    </span>
  );
}
