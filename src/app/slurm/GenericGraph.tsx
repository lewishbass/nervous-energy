// GenericGraph.tsx
// Typescript next.js tailwind react css
// Takes data and parameters, and renders a graph using recharts
// input
//  - type: 'line' | 'bar' | 'scatter' | 'heatmap' | 'histogram'
//  - title: string
//  - units: string
//  - colors: [string]
//  - lables: [string]
//  - data: [{x: number, y: number}]
//  - xlabel: string
//  - ylabel: string

import React, { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Tooltip, Legend, Cell
} from 'recharts';
import Enumber from '@/scripts/enumber';

interface DataPoint {
  x: number;
  y: number;
}

type ChartType = 'line' | 'bar' | 'scatter' | 'heatmap' | 'histogram';

interface GenericGraphProps {
	type?: ChartType;
	title?: string;
	units?: string;
	colors?: string[];
	labels?: string[];
	data: DataPoint[];
	xlabel?: string;
	ylabel?: string;
	maxDataPoints?: number; // Limit for sliding window
	isLiveData?: boolean; // Flag to optimize for live updates
	keys?: string[]; // For multi-series data (y0, y1, y2, etc.)
}

const GenericGraph: React.FC<GenericGraphProps> = ({
	type = 'line',
	title = '',
	units = '',
  colors = [''],
	labels = ['Data'],
	data,
	xlabel = 'X',
	ylabel = 'Y',
	maxDataPoints = 1000,
	isLiveData = false,
	keys = undefined
}) => {
  // Memoize chart data processing with sliding window for live data
  const processedData = useMemo(() => {
    let workingData = data;
    
    // Apply sliding window for live data
    if (isLiveData && data.length > maxDataPoints) {
      workingData = data.slice(-maxDataPoints);
    }
    
    if (type === 'histogram') {
      // Convert data to histogram buckets
      const values = workingData.map(d => d.y);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const buckets = 20;
      const bucketSize = (max - min) / buckets;
      
      const histogram = new Array(buckets).fill(0);
      values.forEach(value => {
        const bucketIndex = Math.min(Math.floor((value - min) / bucketSize), buckets - 1);
        histogram[bucketIndex]++;
      });
      
      return histogram.map((count, index) => ({
        x: min + (index + 0.5) * bucketSize,
        y: count
      }));
    }
    
    return workingData;
  }, [data, type, isLiveData, maxDataPoints]);

	// Generate a random color with 100% brightness, 75% saturation, random hue
	function getRandomColor() {
		const hue = Math.floor(Math.random() * 360);
		return `hsl(${hue}, 75%, 50%)`;
	}

	// Generate multiple random colors for multi-series
	function getRandomColors(count: number) {
		return Array.from({ length: count }, (_, i) => {
			const hue = (i* 360 / count) % 360;
			return `hsl(${hue}, 75%, 62%)`;
		});
	}

  const defaultColor = (colors[0] && typeof colors[0] === 'string') ? colors[0] : getRandomColor();
  const seriesCount = keys ? keys.length : 1;
  const seriesColors = colors.length >= seriesCount && colors[0] && typeof colors[0] === 'string'
    ? colors.slice(0, seriesCount).map(c => c || getRandomColor())
    : getRandomColors(seriesCount);

  // Memoize chart components to prevent unnecessary re-renders
  const memoizedChart = useMemo(() => {
    const commonProps = {
      data: processedData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    // Tooltip Tailwind classes
    const tooltipClass = "bg2 tc2 rounded-lg border-none outline-none shadow";

    // Custom tooltip content to set text color per series
    function CustomTooltip({ active, payload, label }: any) {
      if (!active || !payload || payload.length === 0) return null;
      return (
        <div className={tooltipClass + " p-2"}>
          <div className="font-semibold mb-1">{Enumber(label)}</div>
          {payload.map((entry: any, idx: number) => (
            <div
              key={entry.dataKey || idx}
              style={{ color: entry.color || seriesColors[idx] }}
              className="font-mono"
            >
              {labels[idx] || entry.name || 'Value'}: {Enumber(entry.value)} {units}
            </div>
          ))}
        </div>
      );
    }

    switch (type) {
      case 'line':
        return (
					<LineChart {...commonProps}>
					<CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
					<XAxis 
						dataKey="x" 
						label={{ value: xlabel, position: 'insideBottom', offset: -10 }}
						domain={isLiveData ? ['dataMin', 'dataMax'] : undefined}
						tickFormatter={Enumber}
					/>
					<YAxis 
						label={{ value: ylabel, angle: -90, position: 'insideLeft' }}
						domain={isLiveData ? ['dataMin', 'dataMax'] : undefined}
						tickFormatter={Enumber}
					/>
					<Tooltip 
						content={CustomTooltip}
					/>
					{(!isLiveData || seriesCount > 1) && <Legend />}
					{keys ? (
						keys.map((key, index) => (
							<Line 
								key={key}
								type="monotone" 
								dataKey={key} 
								stroke={seriesColors[index]}
								strokeWidth={2}
								dot={false}
								name={labels[index] || `Series ${index + 1}`}
								isAnimationActive={!isLiveData}
								connectNulls={false}
							/>
						))
					) : (
						<Line 
							type="monotone" 
							dataKey="y" 
							stroke={seriesColors[0]}
							strokeWidth={2}
							dot={false}
							name={labels[0] || 'Data'}
							isAnimationActive={!isLiveData}
						/>
					)}
					</LineChart>
        );

      case 'bar':
      case 'histogram':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
            <XAxis 
              dataKey="x" 
              label={{ value: xlabel, position: 'insideBottom', offset: -10 }}
							tickFormatter={Enumber}
            />
            <YAxis 
              label={{ value: ylabel, angle: -90, position: 'insideLeft' }}
							tickFormatter={Enumber}
            />
            <Tooltip 
              content={CustomTooltip}
            />
            <Legend />
            {keys ? (
							keys.map((key, index) => (
								<Bar 
									key={key}
									dataKey={key} 
									fill={seriesColors[index]}
									name={labels[index] || `Series ${index + 1}`}
									isAnimationActive={!isLiveData}
								/>
							))
						) : (
							<Bar 
								dataKey="y" 
								fill={seriesColors[0]}
								name={labels[0] || 'Data'}
								isAnimationActive={!isLiveData}
							>
								{processedData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={seriesColors[index % seriesColors.length]} />
								))}
							</Bar>
						)}
          </BarChart>
        );

      case 'scatter':
        // Custom small circle shape for scatter points
        const SmallCircle = (props: any) => {
          const { cx, cy, fill } = props;
          return <circle cx={cx} cy={cy} r={3} fill={fill} />;
        };
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
            <XAxis 
              dataKey="x" 
              type="number"
              label={{ value: xlabel, position: 'insideBottom', offset: -10 }}
              domain={isLiveData ? ['dataMin', 'dataMax'] : undefined}
              tickFormatter={Enumber}
            />
            <YAxis 
              label={{ value: ylabel, angle: -90, position: 'insideLeft' }}
              domain={isLiveData ? ['dataMin', 'dataMax'] : undefined}
              tickFormatter={Enumber}
            />
            <Tooltip 
              content={CustomTooltip}
            />
            {(!isLiveData || seriesCount > 1) && <Legend />}
            {keys ? (
              keys.map((key, index) => (
                <Scatter
                  key={key}
                  data={processedData}
                  dataKey={key}
                  fill={seriesColors[index]}
                  name={labels[index] || `Series ${index + 1}`}
                  isAnimationActive={!isLiveData}
                  shape={SmallCircle}
                />
              ))
            ) : (
              <Scatter
                data={processedData}
                dataKey="y"
                fill={seriesColors[0]}
                name={labels[0] || 'Data'}
                isAnimationActive={!isLiveData}
                shape={SmallCircle}
              />
            )}
          </ScatterChart>
        );

      case 'heatmap':
        // Simple heatmap representation using bars with color intensity
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
            <XAxis 
              dataKey="x" 
              label={{ value: xlabel, position: 'insideBottom', offset: -10 }}
							tickFormatter={Enumber}
            />
            <YAxis 
              label={{ value: ylabel, angle: -90, position: 'insideLeft' }}
							tickFormatter={Enumber}
            />
            <Tooltip 
              content={CustomTooltip}
            />
            <Bar 
              dataKey="y" 
              name={labels[0] || 'Intensity'}
              isAnimationActive={!isLiveData}
            >
              {processedData.map((entry, index) => {
                const intensity = entry.y / Math.max(...processedData.map(d => d.y));
                const color = `rgba(${parseInt(defaultColor.slice(1, 3), 16)}, ${parseInt(defaultColor.slice(3, 5), 16)}, ${parseInt(defaultColor.slice(5, 7), 16)}, ${intensity})`;
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  }, [processedData, type, xlabel, ylabel, labels, units, seriesColors, isLiveData, keys, seriesCount]);

  return (
    <div className="w-full h-full">
      {title && (
        <h3 className="tc2 text-lg font-semibold text-center mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height="90%">
        {memoizedChart}
      </ResponsiveContainer>
    </div>
  );
};

export default GenericGraph;
export type { DataPoint, ChartType };