import { Person, Activity } from '../types/FamilyTree';

export const samplePeople: Person[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    dateOfBirth: '1985-03-15',
    location: 'San Francisco, CA',
    profession: 'Software Engineer',
    biography: 'Sarah is a passionate software engineer who loves building innovative applications. She enjoys hiking, photography, and spending time with her family.',
    gender: 'female',
    contactInfo: {
      emails: ['sarah.johnson@email.com', 'sarah@work.com'],
      phones: [
        { number: '+1-555-0123', type: 'mobile' },
        { number: '+1-555-0124', type: 'landline' }
      ],
      address: '123 Tech Street, San Francisco, CA 94105'
    },
    photo: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isMainUser: true,
    relationships: [
      { id: 'r1', type: 'spouse', personId: '2' },
      { id: 'r2', type: 'child', personId: '3' },
      { id: 'r3', type: 'child', personId: '4' },
      { id: 'r4', type: 'parent', personId: '5' },
      { id: 'r5', type: 'parent', personId: '6' }
    ]
  },
  {
    id: '2',
    name: 'Michael Johnson',
    dateOfBirth: '1983-07-22',
    location: 'San Francisco, CA',
    profession: 'Marketing Director',
    biography: 'Michael is a creative marketing professional with over 15 years of experience. He loves cooking, traveling, and coaching his kids\' soccer teams.',
    gender: 'male',
    contactInfo: {
      emails: ['michael.johnson@email.com'],
      phones: [
        { number: '+1-555-0125', type: 'mobile' },
        { number: '+1-555-0126', type: 'fax' }
      ],
      address: '123 Tech Street, San Francisco, CA 94105'
    },
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    relationships: [
      { id: 'r6', type: 'spouse', personId: '1' },
      { id: 'r7', type: 'child', personId: '3' },
      { id: 'r8', type: 'child', personId: '4' }
    ]
  },
  {
    id: '3',
    name: 'Emma Johnson',
    dateOfBirth: '2010-12-08',
    location: 'San Francisco, CA',
    profession: 'Student',
    biography: 'Emma is a bright and curious student who loves art, music, and science. She dreams of becoming a marine biologist.',
    gender: 'female',
    contactInfo: {
      emails: ['emma.johnson@school.edu'],
      phones: [{ number: '+1-555-0127', type: 'mobile' }]
    },
    photo: 'https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    relationships: [
      { id: 'r9', type: 'parent', personId: '1' },
      { id: 'r10', type: 'parent', personId: '2' },
      { id: 'r11', type: 'sibling', personId: '4' }
    ]
  },
  {
    id: '4',
    name: 'Lucas Johnson',
    dateOfBirth: '2013-05-18',
    location: 'San Francisco, CA',
    profession: 'Student',
    biography: 'Lucas is an energetic young boy who loves soccer, video games, and building with Legos. He wants to be a professional soccer player.',
    gender: 'male',
    contactInfo: {
      phones: [{ number: '+1-555-0128', type: 'mobile' }]
    },
    photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    relationships: [
      { id: 'r12', type: 'parent', personId: '1' },
      { id: 'r13', type: 'parent', personId: '2' },
      { id: 'r14', type: 'sibling', personId: '3' }
    ]
  },
  {
    id: '5',
    name: 'Dorothy Williams',
    dateOfBirth: '1960-01-12',
    location: 'Portland, OR',
    profession: 'Retired Teacher',
    biography: 'Dorothy dedicated her life to education, teaching elementary school for 35 years. She enjoys gardening, reading, and spending time with her grandchildren.',
    gender: 'female',
    contactInfo: {
      emails: ['dorothy.williams@email.com'],
      phones: [
        { number: '+1-555-0129', type: 'landline' },
        { number: '+1-555-0130', type: 'mobile' }
      ],
      address: '456 Oak Avenue, Portland, OR 97205'
    },
    photo: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    relationships: [
      { id: 'r15', type: 'child', personId: '1' },
      { id: 'r16', type: 'spouse', personId: '6' }
    ]
  },
  {
    id: '6',
    name: 'Robert Williams',
    dateOfBirth: '1958-09-30',
    deathDate: '2020-03-15',
    location: 'Portland, OR',
    profession: 'Retired Engineer',
    biography: 'Robert was a mechanical engineer who worked on aerospace projects. He was passionate about model trains and woodworking. He passed away peacefully in 2020.',
    gender: 'male',
    contactInfo: {
      emails: ['robert.williams@email.com'],
      phones: [{ number: '+1-555-0131', type: 'landline' }],
      address: '456 Oak Avenue, Portland, OR 97205'
    },
    photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    relationships: [
      { id: 'r17', type: 'child', personId: '1' },
      { id: 'r18', type: 'spouse', personId: '5' }
    ]
  }
];

export const sampleActivities: Activity[] = [
  {
    id: 'a1',
    type: 'added',
    description: 'Added Lucas Johnson to the family tree',
    timestamp: '2024-01-15T10:30:00Z',
    personId: '4'
  },
  {
    id: 'a2',
    type: 'edited',
    description: 'Updated contact information for Sarah Johnson',
    timestamp: '2024-01-14T15:45:00Z',
    personId: '1'
  },
  {
    id: 'a3',
    type: 'relationship_added',
    description: 'Connected Michael and Sarah as spouses',
    timestamp: '2024-01-13T09:20:00Z',
    personId: '2'
  }
];