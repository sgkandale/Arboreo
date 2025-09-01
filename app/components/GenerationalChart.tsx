'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Person } from '../types/FamilyTree';
import { getNodeColor, getDefaultProfilePic } from '../utils/graphUtils';

interface GenerationalChartProps {
  people: Person[];
  darkMode: boolean;
  onPersonSelect: (person: Person) => void;
}

export const GenerationalChart: React.FC<GenerationalChartProps> = ({
  people,
  darkMode,
  onPersonSelect
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person>(
    people.find(p => p.isMainUser) || people[0]
  );

  const getAncestors = (person: Person, generations: number = 4): Person[][] => {
    const result: Person[][] = [[person]];
    let currentGeneration = [person];

    for (let gen = 1; gen <= generations; gen++) {
      const nextGeneration: Person[] = [];
      
      currentGeneration.forEach(p => {
        const parents = p.relationships
          .filter(rel => rel.type === 'parent')
          .map(rel => people.find(parent => parent.id === rel.personId))
          .filter(Boolean) as Person[];
        
        nextGeneration.push(...parents);
      });

      if (nextGeneration.length === 0) break;
      result.push(nextGeneration);
      currentGeneration = nextGeneration;
    }

    return result;
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);
    
    svg.selectAll('*').remove();
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    
    svg.attr('width', width).attr('height', height);

    const generations = getAncestors(selectedPerson);
    
    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const g = svg.append('g');

    // Draw connections
    const links = g.append('g').attr('class', 'links');
    
    generations.forEach((generation, genIndex) => {
      if (genIndex === 0) return; // Skip root person
      
      const prevGeneration = generations[genIndex - 1];
      
      generation.forEach(person => {
        // Find children in previous generation
        const children = prevGeneration.filter(child =>
          child.relationships.some(rel => rel.type === 'parent' && rel.personId === person.id)
        );
        
        children.forEach(child => {
          const childAngle = prevGeneration.length === 1 ? 0 : 
            (prevGeneration.indexOf(child) / (prevGeneration.length - 1) - 0.5) * Math.PI;
          const childRadius = genIndex * 120;
          const childX = centerX + Math.sin(childAngle) * childRadius;
          const childY = centerY - Math.cos(childAngle) * childRadius;
          
          const parentAngle = generation.length === 1 ? 0 :
            (generation.indexOf(person) / (generation.length - 1) - 0.5) * Math.PI;
          const parentRadius = (genIndex + 1) * 120;
          const parentX = centerX + Math.sin(parentAngle) * parentRadius;
          const parentY = centerY - Math.cos(parentAngle) * parentRadius;
          
          links.append('line')
            .attr('x1', childX)
            .attr('y1', childY)
            .attr('x2', parentX)
            .attr('y2', parentY)
            .attr('stroke', '#10B981')
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.6);
        });
      });
    });

    // Draw nodes
    generations.forEach((generation, genIndex) => {
      generation.forEach((person, personIndex) => {
        const angle = generation.length === 1 ? 0 : 
          (personIndex / (generation.length - 1) - 0.5) * Math.PI;
        const radius = genIndex * 120;
        const x = centerX + Math.sin(angle) * radius;
        const y = centerY - Math.cos(angle) * radius;

        // Node circle
        const nodeGroup = g.append('g')
          .attr('transform', `translate(${x}, ${y})`)
          .style('cursor', 'pointer');

        nodeGroup.append('circle')
          .attr('r', genIndex === 0 ? 35 : 25)
          .attr('fill', getNodeColor(person))
          .attr('stroke', '#fff')
          .attr('stroke-width', 3)
          .on('click', () => onPersonSelect(person))
          .on('mouseover', function() {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('r', genIndex === 0 ? 40 : 30);
          })
          .on('mouseout', function() {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('r', genIndex === 0 ? 35 : 25);
          });

        // Profile image
        if (person.photo || true) {
          const imageUrl = person.photo || getDefaultProfilePic(person);
          nodeGroup.append('image')
            .attr('href', imageUrl)
            .attr('x', genIndex === 0 ? -30 : -20)
            .attr('y', genIndex === 0 ? -30 : -20)
            .attr('width', genIndex === 0 ? 60 : 40)
            .attr('height', genIndex === 0 ? 60 : 40)
            .attr('clip-path', `circle(${genIndex === 0 ? 30 : 20}px at center)`)
            .style('pointer-events', 'none');
        }

        // Name label
        nodeGroup.append('text')
          .text(person.name.split(' ')[0])
          .attr('text-anchor', 'middle')
          .attr('dy', genIndex === 0 ? 50 : 40)
          .attr('font-size', genIndex === 0 ? '14px' : '12px')
          .attr('font-weight', '500')
          .attr('fill', darkMode ? '#D1D5DB' : '#374151');

        // Generation label
        if (genIndex > 0) {
          nodeGroup.append('text')
            .text(`Gen ${genIndex}`)
            .attr('text-anchor', 'middle')
            .attr('dy', genIndex === 0 ? 65 : 55)
            .attr('font-size', '10px')
            .attr('fill', darkMode ? '#9CA3AF' : '#6B7280');
        }
      });
    });

  }, [selectedPerson, people, darkMode, onPersonSelect]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Generational Chart
          </h2>
          <select
            value={selectedPerson.id}
            onChange={(e) => {
              const person = people.find(p => p.id === e.target.value);
              if (person) setSelectedPerson(person);
            }}
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
              darkMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {people.map(person => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>
        <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Showing ancestors of {selectedPerson.name}
        </p>
      </div>
      
      <div ref={containerRef} className="flex-1 relative">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
};