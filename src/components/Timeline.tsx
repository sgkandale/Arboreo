import React from 'react';
import { Person } from '../types/FamilyTree';
import { getDefaultProfilePic } from '../utils/graphUtils';

interface TimelineProps {
  people: Person[];
  darkMode: boolean;
  onPersonSelect: (person: Person) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ people, darkMode, onPersonSelect }) => {
  const sortedPeople = [...people].sort((a, b) => 
    new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAge = (dateOfBirth: string) => {
    return new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
        Family Timeline
      </h2>
      
      <div className="space-y-6">
        {sortedPeople.map((person, index) => (
          <div 
            key={person.id}
            className={`flex items-center space-x-6 p-4 rounded-lg shadow-sm border transition-shadow cursor-pointer ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-gray-900/20' 
                : 'bg-white border-gray-200 hover:shadow-md'
            }`}
            onClick={() => onPersonSelect(person)}
          >
            <div className="flex-shrink-0">
              <img
                src={person.photo || getDefaultProfilePic(person)}
                alt={person.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {person.name}
                    {person.isMainUser && (
                      <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        You
                      </span>
                    )}
                  </h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Born {formatDate(person.dateOfBirth)} • Age {getAge(person.dateOfBirth)}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    person.gender === 'female' ? 'bg-pink-100 text-pink-700' :
                    person.gender === 'male' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {person.gender}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};