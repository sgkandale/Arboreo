import React from 'react';
import { X, Calendar, Gift, Heart } from 'lucide-react';
import { Event, Person } from '../types/FamilyTree';

interface EventsSidebarProps {
  events: Event[];
  people: Person[];
  isOpen: boolean;
  darkMode: boolean;
  onClose: () => void;
  onPersonSelect: (person: Person) => void;
}

export const EventsSidebar: React.FC<EventsSidebarProps> = ({
  events,
  people,
  isOpen,
  darkMode,
  onClose,
  onPersonSelect
}) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'birthday': return Gift;
      case 'anniversary': return Heart;
      case 'memorial': return Calendar;
      default: return Calendar;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'birthday': return 'text-green-600';
      case 'anniversary': return 'text-red-600';
      case 'memorial': return 'text-purple-600';
      default: return 'text-blue-600';
    }
  };

  const getTimeRemaining = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
    return `In ${Math.ceil(diffDays / 30)} months`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`fixed left-0 top-0 h-full w-80 ${
      darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    } shadow-xl border-r transform transition-transform duration-300 z-40 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Upcoming Events
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto p-6">
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map(event => {
                const person = people.find(p => p.id === event.personId);
                const Icon = getEventIcon(event.type);
                
                return (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => person && onPersonSelect(person)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        darkMode ? 'bg-gray-700' : 'bg-white'
                      }`}>
                        <Icon className={`w-4 h-4 ${getEventColor(event.type)}`} />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {event.title}
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                          {formatDate(event.date)}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            event.type === 'birthday' ? 'bg-green-100 text-green-700' :
                            event.type === 'anniversary' ? 'bg-red-100 text-red-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {getTimeRemaining(event.date)}
                          </span>
                          {person && (
                            <div className="flex items-center space-x-2">
                              <img
                                src={person.photo || `https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop`}
                                alt={person.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {person.name.split(' ')[0]}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className={`w-12 h-12 mx-auto mb-4 ${
                darkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No upcoming events in the next month
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};