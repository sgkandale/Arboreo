export interface Person {
  id: string;
  name: string;
  dateOfBirth: string;
  deathDate?: string;
  location?: string;
  profession?: string;
  biography?: string;
  gender: 'male' | 'female' | 'trans';
  contactInfo?: {
    emails?: string[];
    phones?: { number: string; type: 'mobile' | 'landline' | 'fax' }[];
    address?: string;
  };
  photo?: string;
  isMainUser?: boolean;
  parents: string[];
  spouse: string[];
  children: string[];
}

export interface FamilyNode extends Person {
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}



export interface Activity {
  id: string;
  type: 'added' | 'edited' | 'relationship_added';
  description: string;
  timestamp: string;
  personId: string;
}

export type AgeGroup = 'infant' | 'kid' | 'adult' | 'senior';

export type ViewMode = 'graph' | 'timeline' | 'generational' | 'dashboard';

export interface Event {
  id: string;
  type: 'birthday' | 'anniversary' | 'memorial';
  title: string;
  date: string;
  personId: string;
  description?: string;
}

export interface FamilyStatistics {
  totalMembers: number;
  livingMembers: number;
  deceasedMembers: number;
  averageAge: number;
  genderDistribution: { male: number; female: number; trans: number };
  ageGroupDistribution: { infant: number; kid: number; adult: number; senior: number };
  commonFirstNames: { name: string; count: number }[];
  commonLastNames: { name: string; count: number }[];
}