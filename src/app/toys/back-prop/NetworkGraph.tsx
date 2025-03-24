'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'input' | 'hidden' | 'output' | 'loss';
}

interface Link {
  source: string;
  target: string;
  weight?: string;
}

const NetworkGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up network structure
    const width = 700;  // Increased from 500
    const height = 100; // Increased from 50
    
    // Define nodes: input, function nodes, and loss
    const nodes: Node[] = [
      // Input
      { id: 'x', x: 0+50, y: height/2, label: 'x', type: 'input' },
      
      // First function
      { id: 'f1', x: 150+50, y: height/2, label: 'f₁', type: 'hidden' },
      
      // Second function
      { id: 'f2', x: 300+50, y: height/2, label: 'f₂', type: 'hidden' },
      
      // Third function
      { id: 'f4', x: 450+50, y: height/2, label: 'g₄', type: 'output' },
      
      // Loss function
      { id: 'loss', x: 600+50, y: height/2, label: 'L', type: 'loss' }
    ];
    
    // Define links between nodes
    const links: Link[] = [
      // x to f1
      { source: 'x', target: 'f1', weight: 'θ₁' },
      
      // f1 to f2
      { source: 'f1', target: 'f2', weight: 'θ₂' },
      
      // f2 to f4
      { source: 'f2', target: 'f4', weight: 'θ₃' },
      
      // f4 to loss
      { source: 'f4', target: 'loss' }
    ];

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto;');

    // Add links
    svg.selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d) => {
        const source = nodes.find(n => n.id === d.source)!;
        const target = nodes.find(n => n.id === d.target)!;
        return `M${source.x},${source.y} C${(source.x + target.x) / 2},${source.y} ${(source.x + target.x) / 2},${target.y} ${target.x},${target.y}`;
      })
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', 2.5)  // Increased from 2.5
      .attr('opacity', 1);

    // Add weight labels
    svg.selectAll('.weight-label')
      .data(links.filter(l => l.weight))
      .enter()
      .append('text')
      .attr('class', 'weight-label')
      .attr('x', (d) => {
        const source = nodes.find(n => n.id === d.source)!;
        const target = nodes.find(n => n.id === d.target)!;
        return (source.x + target.x) / 2;
      })
      .attr('y', (d) => {
        const source = nodes.find(n => n.id === d.source)!;
        const target = nodes.find(n => n.id === d.target)!;
        return (source.y + target.y) / 2 - 10;  // Adjusted for larger font
      })
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--fg)')
      .attr('font-size', '24px')  // Increased from 10px
      .text(d => d.weight || '');

    // Add nodes
    const nodeGroups = svg.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Node circles with different styles based on type
    nodeGroups.append('circle')
      .attr('r', d => d.type === 'loss' ? 25 : 20)  // Increased from 15/12
      .attr('fill', d => {
        switch(d.type) {
          case 'input': return 'var(--khg)';
          case 'hidden': return 'var(--khb)';
          case 'output': return 'var(--khp)';
          case 'loss': return 'var(--khr)';
          default: return 'var(--fg)';
        }
      })
      .attr('stroke', 'var(--fg)')
      .attr('stroke-width', 2);  // Increased from 1

    // Node labels
    nodeGroups.append('text')
      .attr('dy', '.3em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '24px')  // Increased from 10px
      .text(d => d.label);

  }, []);

  return (
    <div className="network-graph">
      <svg ref={svgRef} width="100%" height="300" className="mx-auto"></svg>
    </div>
  );
};

export default NetworkGraph;
