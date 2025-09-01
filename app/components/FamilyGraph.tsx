'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Person, FamilyNode, FamilyLink } from '../types/FamilyTree';
import { buildFamilyGraph, getNodeColor, getLinkColor, findShortestPath } from '../utils/graphUtils';
import { NodeTooltip } from './NodeTooltip';

interface FamilyGraphProps {
  people: Person[];
  searchTerm: string;
  darkMode: boolean;
  onPersonSelect: (person: Person) => void;
}

export const FamilyGraph: React.FC<FamilyGraphProps> = ({ 
  people, 
  searchTerm, 
  darkMode,
  onPersonSelect 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    person: Person;
    x: number;
    y: number;
    visible: boolean;
  }>({ person: people[0], x: 0, y: 0, visible: false });
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);
    
    // Clear previous content
    svg.selectAll('*').remove();
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    svg.attr('width', width).attr('height', height);

    const { nodes, links } = buildFamilyGraph(people);
    
    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Main group for all graph elements
    const g = svg.append('g');

    // Create force simulation
    const simulation = d3.forceSimulation<FamilyNode>(nodes)
      .force('link', d3.forceLink<FamilyNode, FamilyLink>(links)
        .id(d => d.id)
        .distance(150)
        .strength(0.8))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(35))
      .force('y', d3.forceY<FamilyNode>()
        .y(d => {
          const birthYear = new Date(d.dateOfBirth).getFullYear();
          const minYear = Math.min(...nodes.map(n => new Date(n.dateOfBirth).getFullYear()));
          const maxYear = Math.max(...nodes.map(n => new Date(n.dateOfBirth).getFullYear()));
          const yearRange = maxYear - minYear || 1;
          return ((birthYear - minYear) / yearRange) * (height - 200) + 100;
        })
        .strength(0.5));

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', d => getLinkColor(d.type))
      .attr('stroke-width', 3)
      .attr('stroke-opacity', 0.8);

    // Create nodes
    const node = g.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 25)
      .attr('fill', d => getNodeColor(d))
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .style('cursor', 'pointer')
      .style('filter', d => searchTerm && d.name.toLowerCase().includes(searchTerm.toLowerCase()) 
        ? 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.8))' : 'none');

    // Add labels
    const labels = g.append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text(d => d.name.split(' ')[0])
      .attr('text-anchor', 'middle')
      .attr('dy', 40)
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('fill', darkMode ? '#D1D5DB' : '#374151');

    // Add drag behavior
    const drag = d3.drag<SVGCircleElement, FamilyNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        
        // Add stretch effect
        d3.select(event.sourceEvent.target)
          .transition()
          .duration(200)
          .attr('r', 30)
          .transition()
          .duration(200)
          .attr('r', 25);
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag);

    // Add mouse events
    node
      .on('mouseover', (event, d) => {
        const [x, y] = d3.pointer(event, document.body);
        setTooltip({
          person: d,
          x,
          y,
          visible: true
        });
      })
      .on('mouseout', () => {
        setTooltip(prev => ({ ...prev, visible: false }));
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        onPersonSelect(d);
        
        // Find and highlight shortest path from main user
        const mainUser = nodes.find(n => n.isMainUser);
        if (mainUser && mainUser.id !== d.id) {
          const path = findShortestPath(nodes, links, mainUser.id, d.id);
          setHighlightedPath(path);
          
          // Remove highlight after 3 seconds
          setTimeout(() => setHighlightedPath([]), 3000);
        }
      });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as FamilyNode).x!)
        .attr('y1', d => (d.source as FamilyNode).y!)
        .attr('x2', d => (d.target as FamilyNode).x!)
        .attr('y2', d => (d.target as FamilyNode).y!);

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);

      labels
        .attr('x', d => d.x!)
        .attr('y', d => d.y!);
    });

    // Update link highlighting based on path
    link.attr('stroke-opacity', d => {
      if (highlightedPath.length === 0) return 0.8;
      
      const sourceId = typeof d.source === 'string' ? d.source : d.source.id;
      const targetId = typeof d.target === 'string' ? d.target : d.target.id;
      
      for (let i = 0; i < highlightedPath.length - 1; i++) {
        if ((highlightedPath[i] === sourceId && highlightedPath[i + 1] === targetId) ||
            (highlightedPath[i] === targetId && highlightedPath[i + 1] === sourceId)) {
          return 1;
        }
      }
      return 0.3;
    });

    // Cleanup function
    return () => {
      simulation.stop();
    };
  }, [people, searchTerm, highlightedPath, darkMode, onPersonSelect]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg ref={svgRef} className="w-full h-full"></svg>
      <NodeTooltip
        person={tooltip.person}
        x={tooltip.x}
        y={tooltip.y}
        visible={tooltip.visible}
        darkMode={darkMode}
      />
    </div>
  );
};