import React, { useState, useEffect, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";

interface ClusterComparisonProps {
  data: any;
	availableClusters: number[];
	clusterCenters?: { [key: number]: string };
}

function scientificFormat(value: number) {
  if (value >= 1e9) return (value / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (value >= 1e6) return (value / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (value >= 1e3) return (value / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
  return value.toString();
}

function hist(data: number[], min: number | null = null, max: number | null = null, n_bins: number = 50) {
  if (min === null) min = Math.min(...data);
  if (max === null) max = Math.max(...data);
  const range = max - min;
  const bin_counts = Array(n_bins).fill(0);
  data.forEach((val) => {
    const bin = Math.floor(((val - min) / range) * n_bins);
    if (bin >= 0 && bin < n_bins) bin_counts[bin]++;
  });
  const bin_labels = Array(n_bins).fill(0).map((val, indx) => (indx + 1) * (range / n_bins) + min);
  return { bin_counts, bin_labels };
}

const ClusterComparison: React.FC<ClusterComparisonProps> = ({ data, availableClusters, clusterCenters }) => {
  const [leftCluster, setLeftCluster] = useState<number | null>(0);
  const [rightCluster, setRightCluster] = useState<number | null>(1);

  // Set default clusters when available
  useEffect(() => {
    if (availableClusters.length > 0) {
      setLeftCluster(availableClusters[0]);
      setRightCluster(availableClusters[1] || availableClusters[0]);
    }
  }, [availableClusters]);

  // Generate cluster colors
  const getClusterColor = (cluster: number) => {
    const colors = [
      "#4F8EF7", "#F78E4F", "#A0C4FF", "#FFD6B0", "#43AA8B", "#F94144",
      "#F3722C", "#F9C74F", "#90BE6D", "#577590", "#9D4EDD", "#B5179E"
    ];
    return colors[cluster % colors.length];
  };

  // Prepare scatter data for left cluster
  const leftScatterData = useMemo(() => {
    if (!data || leftCluster === null) return [];
    
    const clusterIndices = data.cluster
      .map((cluster: number, index: number) => cluster === leftCluster ? index : -1)
      .filter((index: number) => index !== -1)
      .slice(0, 1000); // Limit for performance

    return clusterIndices.map((index: number) => ({
      x: data.x_tsne[index],
      y: data.y_tsne[index],
      title: data.title[index],
      length: data.text_length[index],
      cluster: data.cluster[index]
    }));
  }, [data, leftCluster]);

  // Prepare scatter data for right cluster
  const rightScatterData = useMemo(() => {
    if (!data || rightCluster === null) return [];
    
    const clusterIndices = data.cluster
      .map((cluster: number, index: number) => cluster === rightCluster ? index : -1)
      .filter((index: number) => index !== -1)
      .slice(0, 1000); // Limit for performance

    return clusterIndices.map((index: number) => ({
      x: data.x_tsne[index],
      y: data.y_tsne[index],
      title: data.title[index],
      length: data.text_length[index],
      cluster: data.cluster[index]
    }));
  }, [data, rightCluster]);

  // Calculate stats for each cluster
  const getClusterStats = (cluster: number | null) => {
    if (!data || cluster === null) return { count: 0, avgLength: 0 };
    
    const clusterData = data.cluster
      .map((c: number, index: number) => c === cluster ? data.text_length[index] : null)
      .filter((length: number | null) => length !== null);
    
    return {
      count: clusterData.length,
      avgLength: clusterData.reduce((a: number, b: number) => a + b, 0) / clusterData.length || 0
    };
  };

  const leftStats = getClusterStats(leftCluster);
  const rightStats = getClusterStats(rightCluster);

  // Add length histogram data for left cluster
  const leftLengthHistogram = useMemo(() => {
    if (!data || leftCluster === null) return [];
    
    const clusterLengths = data.cluster
      .map((cluster: number, index: number) => cluster === leftCluster ? data.text_length[index] : null)
      .filter((length: number | null) => length !== null);
    
    if (clusterLengths.length === 0) return [];
    
    const { bin_counts, bin_labels } = hist(clusterLengths, 0, 4000, 30);
    
    return bin_counts.map((count, index) => ({
      bin: `${Number(bin_labels[index].toFixed(0)).toLocaleString()}`,
      count,
    }));
  }, [data, leftCluster]);

  // Add length histogram data for right cluster
  const rightLengthHistogram = useMemo(() => {
    if (!data || rightCluster === null) return [];
    
    const clusterLengths = data.cluster
      .map((cluster: number, index: number) => cluster === rightCluster ? data.text_length[index] : null)
      .filter((length: number | null) => length !== null);
    
    if (clusterLengths.length === 0) return [];
    
    const { bin_counts, bin_labels } = hist(clusterLengths, 0, 4000, 30);
    
    return bin_counts.map((count, index) => ({
      bin: `${Number(bin_labels[index].toFixed(0)).toLocaleString()}`,
      count,
    }));
  }, [data, rightCluster]);

  // Add word count data for left cluster
  const leftWordData = useMemo(() => {
    if (!data || leftCluster === null || !data.word_counts) return [];
    
    const words: Record<string, number> = {};
    data.cluster.forEach((cluster: number, index: number) => {
      if (cluster === leftCluster && data.word_counts[index]) {
        data.word_counts[index].forEach((item: [string, number]) => {
          const key = item[0].toLowerCase();
          if (item[1] > 1) words[key] = (words[key] ?? 0) + item[1];
        });
      }
    });

    return Object.entries(words)
      .filter(([word, count]) => count > 5 && word.length > 2)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }, [data, leftCluster]);

  // Add word count data for right cluster
  const rightWordData = useMemo(() => {
    if (!data || rightCluster === null || !data.word_counts) return [];
    
    const words: Record<string, number> = {};
    data.cluster.forEach((cluster: number, index: number) => {
      if (cluster === rightCluster && data.word_counts[index]) {
        data.word_counts[index].forEach((item: [string, number]) => {
          const key = item[0].toLowerCase();
          if (item[1] > 1) words[key] = (words[key] ?? 0) + item[1];
        });
      }
    });

    return Object.entries(words)
      .filter(([word, count]) => count > 5 && word.length > 2)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }, [data, rightCluster]);

  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">No data available for cluster comparison</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-center">Cluster Comparison</h2>
      
      <div className="flex-1 flex flex-col xl:flex-row gap-4">
        {/* Left Cluster Panel */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Left Cluster:</label>
            <select
              value={leftCluster || ""}
              onChange={(e) => setLeftCluster(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableClusters.map((cluster) => (
                <option key={cluster} value={cluster}>
                  {clusterCenters ? `Cluster ${cluster} - ${clusterCenters[cluster] || "N/A"}` : `Cluster ${cluster}`}
                </option>
              ))}
            </select>
          </div>

          {leftCluster !== null && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2" style={{ color: getClusterColor(leftCluster) }}>
                Cluster {leftCluster} Statistics
              </h4>
							<div className="text-sm text-gray-600 space-y-1">
								<p>{(() => {
									if (!data || leftCluster === null) return "N/A";
									const firstIndex = data.cluster.findIndex((c: number) => c === leftCluster);
									if (firstIndex === -1) return "N/A";
									return data["cluster_center"][firstIndex] || "N/A";
								})()}</p>
                <p>Articles: {leftStats.count.toLocaleString()}</p>
                <p>Avg Length: {Math.round(leftStats.avgLength).toLocaleString()} chars</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Scatter Plot */}
            <div className="aspect-square">
              <h4 className="text-sm font-medium mb-2">t-SNE Visualization</h4>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={leftScatterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="x" hide />
                  <YAxis type="number" dataKey="y" hide />
                  <Tooltip
                    content={({ active, payload }) =>
                      active && payload && payload.length ? (
                        <div style={{ background: "#fff", border: "1px solid #ccc", padding: 8 }}>
                          <div><strong>Title:</strong> {payload[0].payload.title}</div>
                          <div><strong>Length:</strong> {payload[0].payload.length}</div>
                          <div><strong>Cluster:</strong> {payload[0].payload.cluster}</div>
                        </div>
                      ) : null
                    }
                  />
                  <Scatter
                    dataKey="y"
                    fill={leftCluster !== null ? getClusterColor(leftCluster) : "#ccc"}
                    shape={(props: any) => {
                      const { cx, cy } = props;
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={3}
                          fill={leftCluster !== null ? getClusterColor(leftCluster) : "#ccc"}
                          fillOpacity={0.7}
                        />
                      );
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Length Histogram */}
            <div className="aspect-square">
              <h4 className="text-sm font-medium mb-2">Article Length Distribution</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leftLengthHistogram}>
                  <defs>
                    <linearGradient id="leftLengthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="-50%" stopColor={leftCluster !== null ? getClusterColor(leftCluster) : "#ccc"} stopOpacity={0.9} />
                      <stop offset="150%" stopColor={leftCluster !== null ? getClusterColor(leftCluster) : "#ccc"} stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bin" angle={-45} textAnchor="end" height={60} fontSize={10} />
                  <YAxis tickFormatter={(value) => scientificFormat(value)} fontSize={10} />
                  <Tooltip
                    formatter={(value: any, name: string, props: any) => [
                      <>
                        <span style={{ fontWeight: "bold", color: "#000" }}>Count:</span>
                        <span> {value.toLocaleString()}</span>
                        <br />
                        <span style={{ fontWeight: "bold", color: "#000" }}>Length:</span>
                        <span> {props.payload.bin}</span>
                      </>
                    ]}
                    labelFormatter={() => ""}
                  />
                  <Bar dataKey="count" fill="url(#leftLengthGradient)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Word Count Chart */}
            <div className="aspect-square lg:col-span-2">
              <h4 className="text-sm font-medium mb-2">Most Common Words</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leftWordData}>
                  <defs>
                    <linearGradient id="leftWordGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="-50%" stopColor={leftCluster !== null ? getClusterColor(leftCluster) : "#ccc"} stopOpacity={0.9} />
                      <stop offset="150%" stopColor={leftCluster !== null ? getClusterColor(leftCluster) : "#ccc"} stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="word" angle={-45} textAnchor="end" height={60} fontSize={10} />
                  <YAxis tickFormatter={(value) => scientificFormat(value)} fontSize={10} />
                  <Tooltip
                    formatter={(value: any, name: string, props: any) => [
                      <>
                        <span style={{ fontWeight: "bold", color: "#000" }}>Count:</span>
                        <span> {value.toLocaleString()}</span>
                        <br />
                        <span style={{ fontWeight: "bold", color: "#000" }}>Word:</span>
                        <span> {props.payload.word}</span>
                      </>
                    ]}
                    labelFormatter={() => ""}
                  />
                  <Bar dataKey="count" fill="url(#leftWordGradient)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Cluster Panel */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Right Cluster:</label>
            <select
              value={rightCluster || ""}
              onChange={(e) => setRightCluster(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a cluster...</option>
              {availableClusters.map((cluster) => (
                <option key={cluster} value={cluster}>
                  {clusterCenters ? `Cluster ${cluster} - ${clusterCenters[cluster] || "N/A"}` : `Cluster ${cluster}`}
                </option>
              ))}
            </select>
          </div>

          {rightCluster !== null && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2" style={{ color: getClusterColor(rightCluster) }}>
                Cluster {rightCluster} Statistics
              </h4>
							<div className="text-sm text-gray-600 space-y-1">
								<p>{(() => {
									if (!data || rightCluster === null) return "N/A";
									const firstIndex = data.cluster.findIndex((c: number) => c === rightCluster);
									if (firstIndex === -1) return "N/A";
									return data["cluster_center"][firstIndex] || "N/A";
								})()}</p>
                <p>Articles: {rightStats.count.toLocaleString()}</p>
								<p>Avg Length: {Math.round(rightStats.avgLength).toLocaleString()} chars</p>
								
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Scatter Plot */}
            <div className="aspect-square">
              <h4 className="text-sm font-medium mb-2">t-SNE Visualization</h4>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={rightScatterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="x" hide />
                  <YAxis type="number" dataKey="y" hide />
                  <Tooltip
                    content={({ active, payload }) =>
                      active && payload && payload.length ? (
                        <div style={{ background: "#fff", border: "1px solid #ccc", padding: 8 }}>
                          <div><strong>Title:</strong> {payload[0].payload.title}</div>
                          <div><strong>Length:</strong> {payload[0].payload.length}</div>
                          <div><strong>Cluster:</strong> {payload[0].payload.cluster}</div>
                        </div>
                      ) : null
                    }
                  />
                  <Scatter
                    dataKey="y"
                    fill={rightCluster !== null ? getClusterColor(rightCluster) : "#ccc"}
                    shape={(props: any) => {
                      const { cx, cy } = props;
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={3}
                          fill={rightCluster !== null ? getClusterColor(rightCluster) : "#ccc"}
                          fillOpacity={0.7}
                        />
                      );
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Length Histogram */}
            <div className="aspect-square">
              <h4 className="text-sm font-medium mb-2">Article Length Distribution</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rightLengthHistogram}>
                  <defs>
                    <linearGradient id="rightLengthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="-50%" stopColor={rightCluster !== null ? getClusterColor(rightCluster) : "#ccc"} stopOpacity={0.9} />
                      <stop offset="150%" stopColor={rightCluster !== null ? getClusterColor(rightCluster) : "#ccc"} stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bin" angle={-45} textAnchor="end" height={60} fontSize={10} />
                  <YAxis tickFormatter={(value) => scientificFormat(value)} fontSize={10} />
                  <Tooltip
                    formatter={(value: any, name: string, props: any) => [
                      <>
                        <span style={{ fontWeight: "bold", color: "#000" }}>Count:</span>
                        <span> {value.toLocaleString()}</span>
                        <br />
                        <span style={{ fontWeight: "bold", color: "#000" }}>Length:</span>
                        <span> {props.payload.bin}</span>
                      </>
                    ]}
                    labelFormatter={() => ""}
                  />
                  <Bar dataKey="count" fill="url(#rightLengthGradient)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Word Count Chart */}
            <div className="aspect-square lg:col-span-2">
              <h4 className="text-sm font-medium mb-2">Most Common Words</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rightWordData}>
                  <defs>
                    <linearGradient id="rightWordGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="-50%" stopColor={rightCluster !== null ? getClusterColor(rightCluster) : "#ccc"} stopOpacity={0.9} />
                      <stop offset="150%" stopColor={rightCluster !== null ? getClusterColor(rightCluster) : "#ccc"} stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="word" angle={-45} textAnchor="end" height={60} fontSize={10} />
                  <YAxis tickFormatter={(value) => scientificFormat(value)} fontSize={10} />
                  <Tooltip
                    formatter={(value: any, name: string, props: any) => [
                      <>
                        <span style={{ fontWeight: "bold", color: "#000" }}>Count:</span>
                        <span> {value.toLocaleString()}</span>
                        <br />
                        <span style={{ fontWeight: "bold", color: "#000" }}>Word:</span>
                        <span> {props.payload.word}</span>
                      </>
                    ]}
                    labelFormatter={() => ""}
                  />
                  <Bar dataKey="count" fill="url(#rightWordGradient)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClusterComparison;
