'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Label,
} from 'recharts';

/* ── Types ── */

export interface PlotLine {
  /** Human-readable label shown in the legend */
  label: string;
  /** Pure function mapping x → y */
  fn: (x: number) => number;
  /** Stroke color (CSS color string) */
  color?: string;
  /** Stroke dash pattern, e.g. "5 5" for dashed */
  dash?: string;
  strokeWidth?: number;
}

export interface PlotPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

export interface LecturePlotProps {
  /** Array of line series to draw */
  lines: PlotLine[];
  /** X-axis domain [min, max] */
  xDomain?: [number, number];
  /** Y-axis domain [min, max] */
  yDomain?: [number, number];
  /** Number of sample points per line (higher = smoother curves) */
  samples?: number;
  /** Optional reference/intersection dots */
  points?: PlotPoint[];
  /** Axis labels */
  xLabel?: string;
  yLabel?: string;
  /** Caption displayed below the chart */
  caption?: string;
  /** Show the grid */
  grid?: boolean;
  /** Chart height in pixels (scroll mode) */
  height?: number;
  className?: string;
}

/* ── Constants ── */

const DEFAULT_COLORS = [
  '#6366f1', // indigo
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#3b82f6', // blue
  '#ec4899', // pink
];

const DEFAULT_X: [number, number] = [-5, 5];
const DEFAULT_Y: [number, number] = [-5, 5];

/* ── Tooltip ── */

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="lecture-plot-tooltip">
      <p className="lecture-plot-tooltip-x">x = {Number(label).toFixed(2)}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.stroke }}>
          {p.name}: {Number(p.value).toFixed(3)}
        </p>
      ))}
    </div>
  );
}

/* ── Main component ── */

function LecturePlot({
  lines,
  xDomain = DEFAULT_X,
  yDomain = DEFAULT_Y,
  samples = 200,
  points = [],
  xLabel,
  yLabel,
  caption,
  grid = true,
  height = 300,
  className = '',
}: LecturePlotProps) {
  const [xMin, xMax] = xDomain;
  const [yMin, yMax] = yDomain;

  /** Build the recharts data array: one object per x sample with a key per line */
  const data = useMemo(() => {
    const step = (xMax - xMin) / (samples - 1);
    return Array.from({ length: samples }, (_, i) => {
      const x = xMin + i * step;
      const row: Record<string, number> = { x };
      lines.forEach((line, li) => {
        const y = line.fn(x);
        // Clamp to domain so off-screen values don't explode the chart
        row[`line_${li}`] = isFinite(y) ? Math.max(yMin - 1, Math.min(yMax + 1, y)) : NaN;
      });
      return row;
    });
  }, [lines, xMin, xMax, yMin, yMax, samples]);

  const tickCount = 6;

  return (
    <div className={`lecture-plot-wrapper ${className}`.trim()}>
      {/* Inner container scoped to the chart width so the legend stays inside */}
      <div className="lecture-plot-inner">
        {/* Custom legend overlay — top-right corner */}
        <div className="lecture-plot-legend">
          {lines.map((line, li) => (
            <div key={li} className="lecture-plot-legend-row">
              <span
                className="lecture-plot-legend-swatch"
                style={{
                  background: line.color ?? DEFAULT_COLORS[li % DEFAULT_COLORS.length],
                  borderStyle: line.dash ? 'dashed' : 'solid',
                }}
              />
              <span className="lecture-plot-legend-label">{line.label}</span>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={height} className="lecture-plot-container">
				
        <LineChart data={data} margin={{ top: 20, right: 30, bottom: 6, left: 6 }}>
          {grid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.2)"
            />
          )}
          {/* Zero axes */}
          <ReferenceLine x={0} stroke="rgba(148,163,184,0.45)" strokeWidth={1} />
          <ReferenceLine y={0} stroke="rgba(148,163,184,0.45)" strokeWidth={1} />

          <XAxis
            dataKey="x"
            type="number"
            domain={[xMin, xMax]}
            tickCount={tickCount}
            tickFormatter={(v) => Number(v).toFixed(Number.isInteger(v) ? 0 : 1)}
            stroke="rgba(148,163,184,0.6)"
            tick={{ fill: 'rgba(148,163,184,0.9)', fontSize: 11 }}
            allowDataOverflow
          >
            {xLabel && (
              <Label value={xLabel} position="insideBottom" offset={0} fill="rgba(148,163,184,0.9)" fontSize={12} />
            )}
          </XAxis>

          <YAxis
            type="number"
            domain={[yMin, yMax]}
            tickCount={tickCount}
            tickFormatter={(v) => Number(v).toFixed(Number.isInteger(v) ? 0 : 1)}
            stroke="rgba(148,163,184,0.6)"
            tick={{ fill: 'rgba(148,163,184,0.9)', fontSize: 11 }}
            allowDataOverflow
            width={36}
          >
            {yLabel && (
              <Label value={yLabel} position="insideLeft" angle={-90} offset={16} fill="rgba(148,163,184,0.9)" fontSize={12} style={{ textAnchor: 'middle' }} />
            )}
          </YAxis>

          <Tooltip content={<CustomTooltip />} />

          {lines.map((line, li) => (
            <Line
              key={li}
              type="monotone"
              dataKey={`line_${li}`}
              name={`line_${li}`}
              stroke={line.color ?? DEFAULT_COLORS[li % DEFAULT_COLORS.length]}
              strokeWidth={line.strokeWidth ?? 2.5}
              strokeDasharray={line.dash}
              dot={false}
              isAnimationActive={false}
              connectNulls={false}
            />
          ))}

          {/* Reference dots (intersections, special points) */}
          {points.map((pt, pi) => (
            <ReferenceDot
              key={pi}
              x={pt.x}
              y={pt.y}
              r={6}
              fill={pt.color ?? '#f59e0b'}
              stroke="#fff"
              strokeWidth={2}
              label={pt.label ? { value: pt.label, position: 'top', fill: pt.color ?? '#f59e0b', fontSize: 18 } : undefined}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      </div>
      {caption && <p className="lecture-caption">{caption}</p>}
    </div>
  );
}

export { LecturePlot };
export default LecturePlot;
