import type { DailyVisit } from "@/lib/stats";

const DAY_KO = ["일", "월", "화", "수", "목", "금", "토"] as const;

function dayLabel(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return DAY_KO[new Date(y, m - 1, d).getDay()];
}

interface VisitorChartProps {
  data: DailyVisit[];
  todayStr: string;
}

const W = 420;
const H = 80;
const PAD = { top: 10, right: 6, bottom: 2, left: 6 };

export default function VisitorChart({ data, todayStr }: VisitorChartProps) {
  if (data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.count), 1);
  const count = data.length;

  const xOf = (i: number) =>
    PAD.left + (i / (count - 1)) * (W - PAD.left - PAD.right);

  const yOf = (val: number) =>
    PAD.top + (1 - val / max) * (H - PAD.top - PAD.bottom);

  const points = data.map((d, i) => ({ x: xOf(i), y: yOf(d.count), ...d }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = [
    `M ${points[0].x} ${H}`,
    ...points.map((p) => `L ${p.x} ${p.y}`),
    `L ${points[points.length - 1].x} ${H}`,
    "Z",
  ].join(" ");

  return (
    <div className="mt-4 w-full">
      <svg
        viewBox={`0 0 ${W} ${H + 22}`}
        className="w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#area-fill)" />

        <path
          d={linePath}
          fill="none"
          stroke="#818cf8"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.75"
        />

        {points.map((p) => {
          const isToday = p.date === todayStr;
          return (
            <g key={p.date}>
              <title>{`${dayLabel(p.date)}: ${p.count.toLocaleString("ko-KR")}명`}</title>
              <circle
                cx={p.x}
                cy={p.y}
                r={isToday ? 3.5 : 2.5}
                fill={isToday ? "#a5b4fc" : "#818cf8"}
                opacity={isToday ? 1 : 0.55}
              />
              <text
                x={p.x}
                y={H + 18}
                textAnchor="middle"
                fontSize="10"
                fill={isToday ? "#a5b4fc" : undefined}
                className={isToday ? undefined : "fill-foreground/25"}
                fontWeight={isToday ? "600" : "400"}
              >
                {dayLabel(p.date)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
