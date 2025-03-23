import React, { useMemo } from 'react';
import {
  Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, ReferenceLine, Line, ComposedChart
} from 'recharts';

// Normal distribution function for overlay
const normalDistribution = (x: number, mean: number, stdDev: number): number => {
  const variance = stdDev * stdDev;
  return (1 / (Math.sqrt(2 * Math.PI * variance))) * 
    Math.exp(-Math.pow(x - mean, 2) / (2 * variance));
};

// Vertical Histogram component
const VerticalHistogram: React.FC<{
  histogramData: number[];
  mean: number;
  variance: number;
  min: number;
  max: number;
  histogramMin: number;
  histogramMax: number;
  histogramBuckets: number;
}> = ({ 
  histogramData, 
  mean, 
  variance, 
  min, 
  max, 
  histogramMin, 
  histogramMax, 
  histogramBuckets 
}) => {
  // Memoize chart data calculations to prevent recalculation on every render
	const { chartData, maxCount } = useMemo(() => {
    const bucketSize = (histogramMax - histogramMin) / histogramBuckets;
    const data = histogramData.map((count, index) => {
      const bucketStart = histogramMin + index * bucketSize;
      const bucketCenter = bucketStart + bucketSize / 2;
      return {
        bucket: bucketCenter.toFixed(4),
        count: count,
        // Normal distribution point for overlay
        normal: normalDistribution(bucketCenter, mean, Math.sqrt(variance)) * Math.max(...histogramData) / 
          normalDistribution(mean, mean, Math.sqrt(variance))
      };
    });
    
    // Find the max value for setting scale
    const maxVal = Math.max(...histogramData, 0.001);
    
    return { chartData: data, maxCount: maxVal };
  }, [histogramData, mean, variance, histogramMin, histogramMax, histogramBuckets]);

  return (
    <ResponsiveContainer  height={"100%"} width={"100%"}>
            <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                layout="vertical"
            >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.5} />
                <XAxis
                    type="number"
                    domain={[0, maxCount * 1.1]}
                    hide={true}
                    tickCount={3}
                    tickFormatter={(value) => value.toFixed(2)}
                />
                <YAxis 
                    dataKey="bucket" 
                    type="number" 
                    hide={true}
                    domain={[min, max]} 
                    scale="linear"
                    tickCount={5}
                    tickFormatter={(value) => value.toString()}
                    allowDataOverflow={true}
                />
                <Bar 
                    dataKey="count" 
                    fill="#8884d8" 
                    name="Activations" 
                    isAnimationActive={false}
                />
                <Line 
                    type="monotone" 
                    dataKey="normal" 
                    stroke="#ff7300" 
                    strokeWidth={2} 
                    dot={false} 
                    name="Normal" 
                    isAnimationActive={false}
                />
                <ReferenceLine y={0} stroke="gray" strokeWidth={1}>
                </ReferenceLine>
            </ComposedChart>
    </ResponsiveContainer>
  );
};

export default VerticalHistogram;