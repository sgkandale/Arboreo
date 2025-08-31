import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { FamilyGraph } from './components/FamilyGraph';
import { Sidebar } from './components/Sidebar';
import { Timeline } from './components/Timeline';
import { GenerationalChart } from './components/GenerationalChart';
import { StatisticsDashboard } from './components/StatisticsDashboard';
import { EventsSidebar } from './components/EventsSidebar';
import { GedcomImportExport } from './components/GedcomImportExport';
import { Legend } from './components/Legend';
import { Person, ViewMode } from './types/FamilyTree';
import { samplePeople, sampleActivities } from './data/familyData';
import { generateUpcomingEvents } from './utils/graphUtils';
import { requestNotificationPermission, scheduleEventNotifications } from './utils/notifications';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [people, setPeople] = useState<Person[]>(samplePeople);
  const [activities, setActivities] = useState(sampleActivities);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [eventsSidebarOpen, setEventsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [darkMode, setDarkMode] = useState(false);

  const upcomingEvents = generateUpcomingEvents(people);

  // Request notification permission on app load
  useEffect(() => {
    requestNotificationPermission().then(granted => {
      if (granted) {
        scheduleEventNotifications(upcomingEvents, people);
      }
    });
  }, [people]);

  const handlePersonSelect = useCallback((person: Person) => {
    setSelectedPerson(person);
    setSidebarOpen(true);
    setEventsSidebarOpen(false);
  }, []);

  const handlePersonUpdate = useCallback((updatedPerson: Person) => {
    setPeople(prev => prev.map(p => p.id === updatedPerson.id ? updatedPerson : p));
    setSelectedPerson(updatedPerson);
    
    // Add activity
    const newActivity = {
      id: uuidv4(),
      type: 'edited' as const,
      description: `Updated information for ${updatedPerson.name}`,
      timestamp: new Date().toISOString(),
      personId: updatedPerson.id
    };
    setActivities(prev => [newActivity, ...prev]);
  }, []);

  const handleAddRelation = useCallback((personId: string, relation: { 
    type: string; 
    name: string; 
    dateOfBirth: string; 
    gender: string 
  }) => {
    const newPersonId = uuidv4();
    const relationshipId = uuidv4();
    const reverseRelationshipId = uuidv4();

    // Create new person
    const newPerson: Person = {
      id: newPersonId,
      name: relation.name,
      dateOfBirth: relation.dateOfBirth,
      gender: relation.gender as 'male' | 'female' | 'trans',
      relationships: [
        {
          id: reverseRelationshipId,
          type: relation.type === 'child' ? 'parent' : 
                relation.type === 'parent' ? 'child' :
                relation.type,
          personId: personId
        } as any
      ]
    };

    // Update existing person's relationships
    setPeople(prev => {
      const updated = prev.map(p => {
        if (p.id === personId) {
          return {
            ...p,
            relationships: [
              ...p.relationships,
              {
                id: relationshipId,
                type: relation.type,
                personId: newPersonId
              } as any
            ]
          };
        }
        return p;
      });
      return [...updated, newPerson];
    });

    // Add activity
    const newActivity = {
      id: uuidv4(),
      type: 'added' as const,
      description: `Added ${relation.name} as ${relation.type}`,
      timestamp: new Date().toISOString(),
      personId: newPersonId
    };
    setActivities(prev => [newActivity, ...prev]);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
    setSelectedPerson(null);
  }, []);

  const handleCloseEventsSidebar = useCallback(() => {
    setEventsSidebarOpen(false);
  }, []);

  const handleEventsToggle = useCallback(() => {
    setEventsSidebarOpen(!eventsSidebarOpen);
    if (!eventsSidebarOpen) {
      setSidebarOpen(false);
    }
  }, [eventsSidebarOpen]);

  const handleGedcomImport = useCallback((importedPeople: Person[]) => {
    setPeople(prev => [...prev, ...importedPeople]);
    
    const newActivity = {
      id: uuidv4(),
      type: 'added' as const,
      description: `Imported ${importedPeople.length} family members from GEDCOM file`,
      timestamp: new Date().toISOString(),
      personId: importedPeople[0]?.id || ''
    };
    setActivities(prev => [newActivity, ...prev]);
  }, []);

  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && (sidebarOpen || eventsSidebarOpen)) {
      handleCloseSidebar();
      handleCloseEventsSidebar();
    }
  }, [sidebarOpen, eventsSidebarOpen, handleCloseSidebar, handleCloseEventsSidebar]);

  const renderMainContent = () => {
    switch (viewMode) {
      case 'timeline':
        return (
          <Timeline
            people={people}
            darkMode={darkMode}
            onPersonSelect={handlePersonSelect}
          />
        );
      case 'generational':
        return (
          <GenerationalChart
            people={people}
            darkMode={darkMode}
            onPersonSelect={handlePersonSelect}
          />
        );
      case 'dashboard':
        return (
          <StatisticsDashboard
            people={people}
            darkMode={darkMode}
          />
        );
      default:
        return (
          <>
            <FamilyGraph
              people={people}
              searchTerm={searchTerm}
              darkMode={darkMode}
              onPersonSelect={handlePersonSelect}
            />
            <Legend />
          </>
        );
    }
  };

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
        onEventsToggle={handleEventsToggle}
      />
      
      <div 
        className="flex-1 relative overflow-hidden"
        onClick={handleBackgroundClick}
      >
        {renderMainContent()}
        
        <Sidebar
          person={selectedPerson}
          people={people}
          activities={activities}
          isOpen={sidebarOpen}
          darkMode={darkMode}
          onClose={handleCloseSidebar}
          onPersonUpdate={handlePersonUpdate}
          onAddRelation={handleAddRelation}
        />

        <EventsSidebar
          events={upcomingEvents}
          people={people}
          isOpen={eventsSidebarOpen}
          darkMode={darkMode}
          onClose={handleCloseEventsSidebar}
          onPersonSelect={handlePersonSelect}
        />

        <GedcomImportExport
          people={people}
          darkMode={darkMode}
          onImport={handleGedcomImport}
        />
      </div>
    </div>
  );
}

export default App;