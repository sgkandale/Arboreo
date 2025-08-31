import React from 'react';
import { Person } from '../types/FamilyTree';
import { getAgeGroup, getDefaultProfilePic } from '../utils/graphUtils';

interface NodeTooltipProps {
  person: Person;
  x: number;
  y: number;
  visible: boolean;
  darkMode: boolean;
}

export const NodeTooltip: React.FC<NodeTooltipProps> = ({ person, x, y, visible, darkMode }) => {
  if (!visible) return null;

  const age = new Date().getFullYear() - new Date(person.dateOfBirth).getFullYear();
  const ageGroup = getAgeGroup(person.dateOfBirth);

  return (
    <div 
      className={`fixed z-50 border rounded-lg shadow-lg p-3 pointer-events-none ${
        darkMode 
          ? 'bg-gray-800 border-gray-600' 
          : 'bg-white border-gray-200'
      }`}
      style={{ 
        left: x + 15, 
        top: y - 10,
        transform: 'translateY(-50%)'
      }}
    >
      <div className="flex items-center space-x-3">
        <img 
          src={person.photo || getDefaultProfilePic(person)} 
          alt={person.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {person.name}
          </h4>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Age: {age}
          </p>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} capitalize`}>
            {ageGroup} • {person.gender}
          </p>
        </div>
      </div>
    </div>
  );
};