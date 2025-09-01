'use client';

import React, { useState } from 'react';
import { X, Edit, Plus, User, Phone, Mail, Calendar, MapPin, Briefcase, Heart, Users } from 'lucide-react';
import { Person, Activity } from '../types/FamilyTree';
import { getAgeGroup, getDefaultProfilePic } from '../utils/graphUtils';

interface SidebarProps {
  person: Person | null;
  people: Person[];
  activities: Activity[];
  isOpen: boolean;
  darkMode: boolean;
  onClose: () => void;
  onPersonUpdate: (person: Person) => void;
  onAddRelation: (personId: string, relation: { type: string; name: string; dateOfBirth: string; gender: string }) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  person,
  people,
  activities,
  isOpen,
  darkMode,
  onClose,
  onPersonUpdate,
  onAddRelation
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Person>>({});
  const [addForm, setAddForm] = useState({
    type: 'child',
    name: '',
    dateOfBirth: '',
    gender: 'male'
  });

  React.useEffect(() => {
    if (person) {
      setEditForm({ ...person });
    }
  }, [person]);

  if (!isOpen || !person) return null;

  const age = new Date().getFullYear() - new Date(person.dateOfBirth).getFullYear();
  const ageGroup = getAgeGroup(person.dateOfBirth);
  const personActivities = activities.filter(a => a.personId === person.id);

  const handleSaveEdit = () => {
    if (editForm.name && editForm.dateOfBirth && editForm.gender) {
      onPersonUpdate({ ...person, ...editForm } as Person);
      setIsEditing(false);
    }
  };

  const handleAddRelation = () => {
    if (addForm.name && addForm.dateOfBirth) {
      onAddRelation(person.id, addForm);
      setAddForm({ type: 'child', name: '', dateOfBirth: '', gender: 'male' });
      setShowAddForm(false);
    }
  };

  const getImmediateFamily = () => {
    const family = {
      parents: [] as Person[],
      siblings: [] as Person[],
      spouse: null as Person | null,
      children: [] as Person[]
    };

    // Populate parents
    person.parents.forEach(parentId => {
      const relatedPerson = people.find(p => p.id === parentId);
      if (relatedPerson) {
        family.parents.push(relatedPerson);
      }
    });

    // Populate spouse
    if (person.spouse.length > 0) {
      const spouseId = person.spouse[0]; // Assuming single spouse for simplicity
      const relatedPerson = people.find(p => p.id === spouseId);
      if (relatedPerson) {
        family.spouse = relatedPerson;
      }
    }

    // Populate children
    person.children.forEach(childId => {
      const relatedPerson = people.find(p => p.id === childId);
      if (relatedPerson) {
        family.children.push(relatedPerson);
      }
    });

    // Populate siblings (more complex, requires checking common parents)
    // For now, we can skip this or implement a simpler version if needed

    return family;
  };

  const family = getImmediateFamily();

  return (
    <div className={`fixed right-0 top-0 h-full w-96 ${
      darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    } shadow-xl border-l transform transition-transform duration-300 z-40 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Person Details
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Profile Header */}
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-4 mb-4">
              {person.photo ? (
                <img
                  src={person.photo}
                  alt={person.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className={`w-20 h-20 rounded-full ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-600'
                } flex items-center justify-center font-semibold text-xl`}>
                  {person.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {person.name}
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Age {age} • {ageGroup}
                </p>
                {person.isMainUser && (
                  <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    Main User
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>
          </div>

          {/* Section 1: Basic Information */}
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
              <User className="w-4 h-4 mr-2" />
              Basic Information
            </h4>
            <div className="space-y-3">
              <div className={`flex items-center space-x-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <Calendar className="w-4 h-4" />
                <div>
                  <span className="font-medium">Born:</span> {new Date(person.dateOfBirth).toLocaleDateString()}
                </div>
              </div>
              {person.deathDate && (
                <div className={`flex items-center space-x-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Calendar className="w-4 h-4" />
                  <div>
                    <span className="font-medium">Died:</span> {new Date(person.deathDate).toLocaleDateString()}
                  </div>
                </div>
              )}
              {person.location && (
                <div className={`flex items-center space-x-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <MapPin className="w-4 h-4" />
                  <div>
                    <span className="font-medium">Location:</span> {person.location}
                  </div>
                </div>
              )}
              {person.profession && (
                <div className={`flex items-center space-x-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Briefcase className="w-4 h-4" />
                  <div>
                    <span className="font-medium">Profession:</span> {person.profession}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
              <Phone className="w-4 h-4 mr-2" />
              Contact Information
            </h4>
            <div className="space-y-3">
              {person.contactInfo?.emails && person.contactInfo.emails.length > 0 && (
                <div>
                  <div className={`flex items-center space-x-2 mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <Mail className="w-4 h-4" />
                    <span className="font-medium">Email:</span>
                  </div>
                  {person.contactInfo.emails.map((email, index) => (
                    <div key={index} className={`ml-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {email}
                    </div>
                  ))}
                </div>
              )}
              
              {person.contactInfo?.phones && person.contactInfo.phones.length > 0 && (
                <div>
                  <div className={`flex items-center space-x-2 mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <Phone className="w-4 h-4" />
                    <span className="font-medium">Phone:</span>
                  </div>
                  {person.contactInfo.phones.map((phone, index) => (
                    <div key={index} className={`ml-6 flex justify-between ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>{phone.number}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {phone.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {person.contactInfo?.address && (
                <div className={`flex items-start space-x-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <div>
                    <span className="font-medium">Address:</span>
                    <div className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {person.contactInfo.address}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Biography */}
          {person.biography && (
            <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
                <Heart className="w-4 h-4 mr-2" />
                Biography
              </h4>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                {person.biography}
              </p>
            </div>
          )}

          {/* Section 4: Immediate Family */}
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
              <Users className="w-4 h-4 mr-2" />
              Immediate Family
            </h4>
            <div className="space-y-4">
              {family.parents.length > 0 && (
                <div>
                  <h5 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    Parents
                  </h5>
                  {family.parents.map(parent => (
                    <div key={parent.id} className={`flex items-center space-x-3 p-2 rounded ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                      {parent.photo ? (
                        <img src={parent.photo} alt={parent.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className={`w-8 h-8 rounded-full ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-600'
                        } flex items-center justify-center text-xs font-medium`}>
                          {parent.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{parent.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {family.spouse && (
                <div>
                  <h5 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    Spouse
                  </h5>
                  <div className={`flex items-center space-x-3 p-2 rounded ${
                    darkMode ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    {family.spouse.photo ? (
                      <img src={family.spouse.photo} alt={family.spouse.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className={`w-8 h-8 rounded-full ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-600'
                      } flex items-center justify-center text-xs font-medium`}>
                        {family.spouse.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{family.spouse.name}</span>
                  </div>
                </div>
              )}

              {family.siblings.length > 0 && (
                <div>
                  <h5 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    Siblings
                  </h5>
                  {family.siblings.map(sibling => (
                    <div key={sibling.id} className={`flex items-center space-x-3 p-2 rounded ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                      {sibling.photo ? (
                        <img src={sibling.photo} alt={sibling.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className={`w-8 h-8 rounded-full ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-600'
                        } flex items-center justify-center text-xs font-medium`}>
                          {sibling.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{sibling.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {family.children.length > 0 && (
                <div>
                  <h5 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    Children
                  </h5>
                  {family.children.map(child => (
                    <div key={child.id} className={`flex items-center space-x-3 p-2 rounded ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                      <img 
                        src={child.photo || getDefaultProfilePic(child)} 
                        alt={child.name} 
                        className="w-8 h-8 rounded-full object-cover" 
                      />
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{child.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Relations Section */}
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Add Family Member
              </h4>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {showAddForm && (
              <div className="space-y-3">
                <select
                  value={addForm.type}
                  onChange={(e) => setAddForm({ ...addForm, type: e.target.value })}
                  className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="child">Child</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="spouse">Spouse</option>
                </select>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Full name"
                />
                <input
                  type="date"
                  value={addForm.dateOfBirth}
                  onChange={(e) => setAddForm({ ...addForm, dateOfBirth: e.target.value })}
                  className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <select
                  value={addForm.gender}
                  onChange={(e) => setAddForm({ ...addForm, gender: e.target.value })}
                  className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="trans">Trans</option>
                </select>
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddRelation}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="p-6">
            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Recent Activity
            </h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {personActivities.length > 0 ? (
                personActivities.map(activity => (
                  <div key={activity.id} className={`flex items-start space-x-3 p-3 rounded-lg ${
                    darkMode ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'added' ? 'bg-green-500' :
                      activity.type === 'edited' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        {activity.description}
                      </p>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  No recent activity
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};