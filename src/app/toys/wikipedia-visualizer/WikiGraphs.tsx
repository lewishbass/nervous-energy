import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ScatterChart,
  Scatter
} from "recharts";

function scientificFormat(value: number) {
  if (value >= 1e9) return (value / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (value >= 1e6) return (value / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (value >= 1e3) return (value / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
  return value.toString();
}

function hist(data: number[], min: number | null = null, max: number | null = null, n_bins: number = 500) {
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

// Async data processing functions
async function processLengthHistogramData(data: number[]): Promise<{ bin: string; count: number }[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let { bin_counts, bin_labels } = hist(data.slice(0, 10000), 0, 4000, 100);
      
      let i = bin_counts.length - 1;
      let total = bin_counts.reduce((a, b) => a + b, 0);
      while (i > 0 && bin_counts[i] < total / (bin_counts.length * 3)) i--;
      i = bin_counts.length - 1;
      bin_counts = bin_counts.slice(0, i);
      bin_labels = bin_labels.slice(0, i);

      const bins: { bin: string; count: number }[] = bin_counts.map((count, index) => ({
        bin: `${Number(bin_labels[index].toFixed(0)).toLocaleString()}`,
        count,
      }));

      resolve(bins);
    }, 0);
  });
}

async function processWordHistogramData(data: any, minLetters: number = 3): Promise<{ word: string; count: number }[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const words: Record<string, number> = {};
      data.forEach((point: [string, number][]) => {
        point.forEach((item: [string, number]) => {
          const key = item[0].toLowerCase();
          if (item[1] > 1) words[key] = (words[key] ?? 0) + item[1];
        });
      });
      console.log("words counted: " + Object.keys(words).length);

      const filtered = Object.entries(words)
        .filter(([word, count]) => count > 200 && word.length > minLetters)
        .map(([word, count]) => ({ word, count }));

      console.log("Words filtered: " + filtered.length);

      const chartData = filtered.sort((a, b) => b.count - a.count).slice(0, 40);
      resolve(chartData);
    }, 0);
  });
}

// Placeholder data
const lengthPlaceholderData = Array.from({ length: 20 }, (_, i) => ({
  bin: `${(i + 1) * 1000}`,
  count: Math.floor(Math.random() * 500) + 100
}));

const wordPlaceholderData = Array.from({ length: 20 }, (_, i) => ({
  word: `word${i + 1}`,
  count: Math.floor(Math.random() * 1000) + 200
}));

export const GlobalLengthHistogram: React.FC<{ data: any; clusterData?: any; selectedClusters?: number[] }> = ({ data, clusterData, selectedClusters }) => {
  const [bins, setBins] = useState<{ bin: string; count: number }[]>(lengthPlaceholderData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processData = async () => {
      //setIsLoading(true);
      try {
        let filteredData = data;
        
        // Filter by selected clusters if provided
        if (clusterData && selectedClusters && selectedClusters.length > 0) {
          filteredData = data.filter((_: any, index: number) => 
            selectedClusters.includes(clusterData[index])
          );
        }
        
        const processedBins = await processLengthHistogramData(filteredData);
        setBins(processedBins);
      } catch (error) {
        console.error("Error processing length histogram data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (data && data.length > 0) {
      processData();
    }
  }, [data, clusterData, selectedClusters]);

  return (
    <div style={{ width: "100%", height: 350, padding:"3px"}}>
      <h3 style={{ textAlign: "center", marginBottom: 8, fontWeight: "bold"}}>
        Article Length Histogram {isLoading && <span style={{ fontSize: "0.8em", color: "#666" }}>(Loading...)</span>}
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={bins} barCategoryGap={2} barSize={"100%"}>
          {/* Gradient definition */}
          <defs>
            <linearGradient id="lengthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="-50%" stopColor={isLoading ? "#ccc" : "#4F8EF7"} stopOpacity={isLoading ? 0.5 : 0.9} />
              <stop offset="150%" stopColor={isLoading ? "#eee" : "#A0C4FF"} stopOpacity={isLoading ? 0.3 : 0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bin" angle={-30} textAnchor="end" height={60} label={{ value: "Article Length", position: "insideBottom", offset: 3 }} />
          <YAxis label={{ value: "Count", angle: -90, position: "insideLeft", offset: 10, style: { textAnchor: "middle" } }} tickFormatter={(value) => scientificFormat(value)} />
          <Tooltip
            formatter={(value: any, name: string, props: any) => [
                <>
                  <span style={{ fontWeight: "bold", color: "#000" }}>Count:</span>
                  <span style={{ color: "#4F8EF7" }}> {value.toLocaleString()}</span>
                  <br />
                  <span style={{ fontWeight: "bold", color: "#000" }}>Length:</span>
                  <span style={{ color: "#4F8EF7" }}> {props.payload.bin}</span>
                </>
            ]}
            labelFormatter={() => ""}
          />
          <Bar dataKey="count" fill="url(#lengthGradient)" name="Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const GlobalWordHistogram: React.FC<{ data: any; minLetters?: number }> = ({ data, minLetters = 3 }) => {
  const [chartData, setChartData] = useState<{ word: string; count: number }[]>(wordPlaceholderData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processData = async () => {
      setIsLoading(true);
      try {
        const processedData = await processWordHistogramData(data, minLetters);
        setChartData(processedData);
      } catch (error) {
        console.error("Error processing word histogram data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (data && data.length > 0) {
      processData();
    }
  }, [data, minLetters]);

  return (
    <div style={{ width: "100%", height: 350 , padding:"3px"}}>
      <h3 style={{ textAlign: "center", marginBottom: 8, fontWeight: "bold"}}>
        Most Common Words {isLoading && <span style={{ fontSize: "0.8em", color: "#666" }}>(Loading...)</span>}
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData}>
          {/* Gradient definition */}
          <defs>
            <linearGradient id="wordGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="-50%" stopColor={isLoading ? "#ccc" : "#F78E4F"} stopOpacity={isLoading ? 0.5 : 0.9} />
              <stop offset="150%" stopColor={isLoading ? "#eee" : "#FFD6B0"} stopOpacity={isLoading ? 0.3 : 0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="word" label={{ value: "Word", position: "insideBottom", offset: 3 }} angle={-30} height={40} />
          <YAxis label={{ value: "Count", angle: -90, position: "insideLeft", offset: 10, style: { textAnchor: "middle" } }} tickFormatter={(value) => scientificFormat(value)} width={70} />
          <Tooltip
            formatter={(value: any, name: string, props: any) => [
              <>
                <span style={{ fontWeight: "bold", color: "#000" }}>Count:</span>
                <span style={{ color: "#F78E4F" }}> {value.toLocaleString()}</span>
                <br />
                <span style={{ fontWeight: "bold", color: "#000" }}>Word:</span>
                <span style={{ color: "#F78E4F" }}> {props.payload.word}</span>
              </>
            ]}
            labelFormatter={() => ""}
          />
          <Bar dataKey="count" fill="url(#wordGradient)" name="Frequency" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};


export const GlobalMap: React.FC<{ data: any, mapping_type: "umap" | "tsne" }> = ({ data, mapping_type = "umap" }) => {
  if (!data || !data["x_umap"]) return (<div className="w-full h-full flex items-center justify-center">Loading Data</div>);
  const n_points = 5000;
  const x = ((mapping_type === "umap") ? data["x_umap"] : data["x_tsne"]).slice(0, n_points);
  const y = ((mapping_type === "umap") ? data["y_umap"] : data["y_tsne"]).slice(0, n_points);
  const len = data["text_length"].slice(0, n_points);
  const cluster = data["cluster"].slice(0, n_points);
  const titles = data["title"].slice(0, n_points);

  const x_range = [Math.min(...x), Math.max(...x)];
  const y_range = [Math.min(...y), Math.max(...y)];

  const colors = [
    "#4F8EF7", "#F78E4F", "#A0C4FF", "#FFD6B0", "#43AA8B", "#F94144",
    "#F3722C", "#F9C74F", "#90BE6D", "#577590", "#9D4EDD", "#B5179E"
  ];

  console.log("sliced data " + x.length)

  // Prepare all data points in a single loop
  const scatterData = x && y && x.length === y.length
    ? x.map((val: number, i: number) => ({
        x: val,
        y: y[i],
        title: titles ? titles[i] : "",
        cluster: cluster[i],
        len: len[i],
        color: colors[cluster[i] % colors.length],
        size: len[i] ** 0.3 / 1 + 2
      }))
    : [];

  console.log("scatter data length " + scatterData.length)

  return (
    <div style={{ width: "100%", height: "calc(100% - 100px)", padding: "3px" }}>
      <h3 style={{ textAlign: "center", marginBottom: 8, fontWeight: "bold", fontSize:"1.5em"}}>
        Wikipedia Semantic Embeddings
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart data={scatterData}>
          <XAxis
            type="number"
            dataKey="x"
            name="X"
            domain={x_range}
            hide
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Y"
            domain={y_range}
            hide
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) =>
              active && payload && payload.length ? (
                <div style={{ background: "#fff", border: "1px solid #ccc", padding: 8 }}>
                  <div>
                    <strong>Title:</strong> {payload[0].payload.title}
                  </div>
                  <div>
                    <strong>Cluster:</strong> {payload[0].payload.cluster}
                  </div>
                </div>
              ) : null
            }
          />
          <Scatter
            dataKey="y"
            fill="#8884d8"
            shape={(props: any) => {
              const { cx, cy, payload } = props;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={payload.size}
                  fill={payload.color}
                  fillOpacity={0.7}
                />
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ArticleWordChart: React.FC<{ topWords: [string, number][]; minLetters?: number; onMinLettersChange?: (value: number) => void }> = ({ topWords, minLetters = 3, onMinLettersChange }) => {
  const [localMinLetters, setLocalMinLetters] = useState(minLetters);

  useEffect(() => {
    setLocalMinLetters(minLetters);
  }, [minLetters]);

  if (!topWords || topWords.length === 0) {
    return <div className="w-full h-full flex items-center justify-center">No word data available</div>;
  }

  const chartData = topWords
    .filter(([word, count]) => count > 1 && word.length >= localMinLetters)
    .slice(0, 40)
    .map(([word, count]) => ({ word, count }));

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMinLetters(parseInt(e.target.value));
  };

  const handleSliderRelease = () => {
    if (onMinLettersChange) {
      onMinLettersChange(localMinLetters);
    }
  };

  return (
    <div style={{ width: "100%", height: 350, padding: "3px" }}>
      <h3 style={{ textAlign: "center", marginBottom: 8, fontWeight: "bold" }}>
        Most Common Words in Article
      </h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={chartData}>
          <defs>
            <linearGradient id="articleWordGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="-50%" stopColor="#43AA8B" stopOpacity={0.9} />
              <stop offset="150%" stopColor="#90BE6D" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="word" angle={-30} textAnchor="end" height={60} />
          <YAxis tickFormatter={(value) => scientificFormat(value)} />
          <Tooltip
            formatter={(value: any, name: string, props: any) => [
              <>
                <span style={{ fontWeight: "bold", color: "#000" }}>Count:</span>
                <span style={{ color: "#43AA8B" }}> {value.toLocaleString()}</span>
                <br />
                <span style={{ fontWeight: "bold", color: "#000" }}>Word:</span>
                <span style={{ color: "#43AA8B" }}> {props.payload.word}</span>
              </>
            ]}
            labelFormatter={() => ""}
          />
          <Bar dataKey="count" fill="url(#articleWordGradient)" name="Frequency" />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ padding: "10px", textAlign: "center" }}>
        <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>
          Minimum Letters: {localMinLetters}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={localMinLetters}
          onChange={handleSliderChange}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          style={{ width: "200px" }}
        />
      </div>
    </div>
  );
};