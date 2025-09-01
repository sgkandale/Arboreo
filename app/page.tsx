"use client";

import { useCallback, useEffect, useState } from 'react';
import NodeSetupDialog from './components/NodeSetupDialog';
import { Activity, Person, ViewMode } from './types/FamilyTree';
import { generateUpcomingEvents } from './utils/graphUtils';
import { requestNotificationPermission, scheduleEventNotifications } from './utils/notifications';
import { Timeline } from './components/Timeline';
import { GenerationalChart } from './components/GenerationalChart';
import Setup from './components/Setup';
import Login from './components/Login';
import { Header } from './components/Header';
import { Sidebar } from 'lucide-react';
import { EventsSidebar } from './components/EventsSidebar';
import { FamilyGraph } from './components/FamilyGraph';
import { Legend } from './components/Legend';
import { StatisticsDashboard } from './components/StatisticsDashboard';
import useToast from './hooks/useToast';
import Toast from './components/Toast';
import useGedcom from './hooks/useGedcom';

export default function HomePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [eventsSidebarOpen, setEventsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [darkMode, setDarkMode] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<Person | null>(null);
  const [showNodeSetupDialog, setShowNodeSetupDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast, toastMessage, show, hide } = useToast();
  const { importing, exportToGedcom, triggerImport } = useGedcom(people, (importedPeople) => {
    setPeople(prev => [...prev, ...importedPeople]);
    const newActivity = {
      id: uuidv4(),
      type: 'added' as const,
      description: `Imported ${importedPeople.length} family members from GEDCOM file`,
      timestamp: new Date().toISOString(),
      personId: importedPeople[0]?.id || ''
    };
    setActivities(prev => [newActivity, ...prev]);
  });

  const handleLogin = async (username: string) => {
    try {
      setLoggedIn(true);
      const res = await fetch(`/api/user?username=${username}`);
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      const { user, person } = await res.json();
      setCurrentUser(user);
      if (!person) {
        setShowNodeSetupDialog(true);
      }
    } catch (error) {
      show((error as Error).message);
    }
  };

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const res = await fetch('/api/setup/status');
        const { setupComplete, needsMigration } = await res.json();
        if (needsMigration) {
          const migrationRes = await fetch('/api/migrations/run', { method: 'POST' });
          if (!migrationRes.ok) {
            const { error, stdout, stderr } = await migrationRes.json();
            console.error("Migration failed:", error, "stdout:", stdout, "stderr:", stderr);
            throw new Error(error);
          }
        }
        setSetupComplete(setupComplete);
      } catch (error) {
        show((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    checkSetup();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/family');
          if (!response.ok) {
            const { error } = await response.json();
            throw new Error(error);
          }
          const data = await response.json();
          setPeople(data.people);
          setActivities(data.activities);
        } catch (error) {
          show((error as Error).message);
        }
      };
      fetchData();
    }
  }, [loggedIn]);

  const upcomingEvents = generateUpcomingEvents(people);

  // Request notification permission on app load
  useEffect(() => {
    if (people.length > 0) {
      requestNotificationPermission().then(granted => {
        if (granted) {
          scheduleEventNotifications(upcomingEvents, people);
        }
      });
    }
  }, [people, upcomingEvents]);

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
      parents: [],
      spouse: [],
      children: [],
    };

    // Update existing person's relationships
    setPeople(prev => {
      const updated = prev.map(p => {
        if (p.id === personId) {
          const updatedPerson = { ...p };
          if (relation.type === 'child') {
            updatedPerson.children = [...updatedPerson.children, newPersonId];
            newPerson.parents = [...newPerson.parents, personId];
          } else if (relation.type === 'parent') {
            updatedPerson.parents = [...updatedPerson.parents, newPersonId];
            newPerson.children = [...newPerson.children, personId];
          } else if (relation.type === 'spouse') {
            updatedPerson.spouse = [...updatedPerson.spouse, newPersonId];
            newPerson.spouse = [...newPerson.spouse, personId];
          }
          return updatedPerson;
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

  

  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && (sidebarOpen || eventsSidebarOpen)) {
      handleCloseSidebar();
      handleCloseEventsSidebar();
    }
  }, [sidebarOpen, eventsSidebarOpen, handleCloseSidebar, handleCloseEventsSidebar]);

  const handleNodeSave = async (person: Person) => {
    try {
      const res = await fetch('/api/family/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(person),
      });

      if (res.ok) {
        setShowNodeSetupDialog(false);
        const fetchData = async () => {
          const response = await fetch('/api/family');
          const data = await response.json();
          setPeople(data.people);
        };
        fetchData();
      } else {
        const { error } = await res.json();
        throw new Error(error);
      }
    } catch (error) {
      show((error as Error).message);
    }
  };

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

  const handleLogout = useCallback(() => {
    setLoggedIn(false);
    setPeople([]);
    setActivities([]);
    setSelectedPerson(null);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!setupComplete) {
    return <Setup onSetupComplete={(username) => { 
      setSetupComplete(true);
      handleLogin(username); 
    }} />;
  }

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

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
        onLogout={handleLogout}
        onImport={triggerImport}
        onExport={exportToGedcom}
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

        

        {showNodeSetupDialog && currentUser && (
          <NodeSetupDialog user={currentUser} onSave={handleNodeSave} />
        )}
      </div>
      <Toast message={toastMessage} show={showToast} onClose={hide} />
    </div>
  );
}
