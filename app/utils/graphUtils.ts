import { Person, FamilyNode, FamilyLink, AgeGroup } from '../types/FamilyTree';

export const getAgeGroup = (dateOfBirth: string): AgeGroup => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  
  if (age < 2) return 'infant';
  if (age < 13) return 'kid';
  if (age < 65) return 'adult';
  return 'senior';
};

export const getNodeColor = (person: Person): string => {
  if (person.isMainUser) return '#000000'; // Black for main user
  
  const ageGroup = getAgeGroup(person.dateOfBirth);
  
  if (person.gender === 'female') {
    switch (ageGroup) {
      case 'infant': return '#FEC7D7';
      case 'kid': return '#F9A8D4';
      case 'adult': return '#EC4899';
      case 'senior': return '#BE185D';
    }
  } else if (person.gender === 'male') {
    switch (ageGroup) {
      case 'infant': return '#BFDBFE';
      case 'kid': return '#93C5FD';
      case 'adult': return '#3B82F6';
      case 'senior': return '#1D4ED8';
    }
  } else { // trans
    switch (ageGroup) {
      case 'infant': return '#DCFCE7';
      case 'kid': return '#BBF7D0';
      case 'adult': return '#16A34A';
      case 'senior': return '#15803D';
    }
  }
  return '#6B7280';
};

export const getLinkColor = (type: string): string => {
  switch (type) {
    case 'spouse': return '#F59E0B';
    case 'parent-child': return '#10B981';
    case 'sibling': return '#8B5CF6';
    default: return '#6B7280';
  }
};

export const buildFamilyGraph = (people: Person[]): { nodes: FamilyNode[], links: FamilyLink[] } => {
  const nodes: FamilyNode[] = people.map(person => ({ ...person }));
  const links: FamilyLink[] = [];

  people.forEach(person => {
    // Add spouse links
    person.spouse.forEach(spouseId => {
      const target = people.find(p => p.id === spouseId);
      if (target) {
        const existingLink = links.find(link => 
          (link.source === person.id && link.target === spouseId && link.type === 'spouse') ||
          (link.source === spouseId && link.target === person.id && link.type === 'spouse')
        );
        if (!existingLink) {
          links.push({ source: person.id, target: spouseId, type: 'spouse' });
        }
      }
    });

    // Add parent-child links
    person.children.forEach(childId => {
      const target = people.find(p => p.id === childId);
      if (target) {
        const existingLink = links.find(link => 
          (link.source === person.id && link.target === childId && link.type === 'parent-child') ||
          (link.source === childId && link.target === person.id && link.type === 'parent-child')
        );
        if (!existingLink) {
          links.push({ source: person.id, target: childId, type: 'parent-child' });
        }
      }
    });

    person.parents.forEach(parentId => {
      const target = people.find(p => p.id === parentId);
      if (target) {
        const existingLink = links.find(link => 
          (link.source === person.id && link.target === parentId && link.type === 'parent-child') ||
          (link.source === parentId && link.target === person.id && link.type === 'parent-child')
        );
        if (!existingLink) {
          links.push({ source: parentId, target: person.id, type: 'parent-child' });
        }
      }
    });
  });

  return { nodes, links };
};

export const findShortestPath = (
  nodes: FamilyNode[], 
  links: FamilyLink[], 
  fromId: string, 
  toId: string
): string[] => {
  const graph = new Map<string, string[]>();
  
  // Build adjacency list
  nodes.forEach(node => graph.set(node.id, []));
  links.forEach(link => {
    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    graph.get(sourceId)?.push(targetId);
    graph.get(targetId)?.push(sourceId);
  });

  // BFS to find shortest path
  const queue: [string, string[]][] = [[fromId, [fromId]]];
  const visited = new Set<string>([fromId]);

  while (queue.length > 0) {
    const [currentId, path] = queue.shift()!;
    
    if (currentId === toId) {
      return path;
    }

    const neighbors = graph.get(currentId) || [];
    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push([neighborId, [...path, neighborId]]);
      }
    }
  }

  return [];
};

export const getDefaultProfilePic = (person: Person): string => {
  const gender = person.gender;
  const ageGroup = getAgeGroup(person.dateOfBirth);
  
  if (gender === 'female') {
    if (ageGroup === 'infant' || ageGroup === 'kid') {
      return 'https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';
    } else if (ageGroup === 'adult') {
      return 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';
    } else {
      return 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';
    }
  } else if (gender === 'male') {
    if (ageGroup === 'infant' || ageGroup === 'kid') {
      return 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';
    } else if (ageGroup === 'adult') {
      return 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';
    } else {
      return 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';
    }
  } else {
    return 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';
  }
};

export const calculateFamilyStatistics = (people: Person[]): FamilyStatistics => {
  const totalMembers = people.length;
  const livingMembers = people.filter(p => !p.deathDate).length;
  const deceasedMembers = people.filter(p => p.deathDate).length;
  
  const ages = people.map(p => {
    const birthYear = new Date(p.dateOfBirth).getFullYear();
    const endYear = p.deathDate ? new Date(p.deathDate).getFullYear() : new Date().getFullYear();
    return endYear - birthYear;
  });
  const averageAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;

  const genderDistribution = people.reduce((acc, p) => {
    acc[p.gender]++;
    return acc;
  }, { male: 0, female: 0, trans: 0 });

  const ageGroupDistribution = people.reduce((acc, p) => {
    const group = getAgeGroup(p.dateOfBirth);
    acc[group]++;
    return acc;
  }, { infant: 0, kid: 0, adult: 0, senior: 0 });

  const firstNames = people.map(p => p.name.split(' ')[0]);
  const firstNameCounts = firstNames.reduce((acc, name) => {
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const commonFirstNames = Object.entries(firstNameCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const lastNames = people.map(p => p.name.split(' ').slice(-1)[0]);
  const lastNameCounts = lastNames.reduce((acc, name) => {
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const commonLastNames = Object.entries(lastNameCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalMembers,
    livingMembers,
    deceasedMembers,
    averageAge,
    genderDistribution,
    ageGroupDistribution,
    commonFirstNames,
    commonLastNames
  };
};

export const generateUpcomingEvents = (people: Person[]): Event[] => {
  const events: Event[] = [];
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  
  people.forEach(person => {
    const birthDate = new Date(person.dateOfBirth);
    const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    const nextYearBirthday = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
    
    const upcomingBirthday = thisYearBirthday >= today ? thisYearBirthday : nextYearBirthday;
    
    if (upcomingBirthday <= nextMonth) {
      const age = upcomingBirthday.getFullYear() - birthDate.getFullYear();
      events.push({
        id: `birthday-${person.id}`,
        type: 'birthday',
        title: `${person.name}'s ${age}${age === 1 ? 'st' : age === 2 ? 'nd' : age === 3 ? 'rd' : 'th'} Birthday`,
        date: upcomingBirthday.toISOString(),
        personId: person.id,
        description: `${person.name} turns ${age}`
      });
    }
  });
  
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};