'use client';

import { useState } from 'react';
import { Person } from '../types/FamilyTree';

interface NodeSetupDialogProps {
  user: Person;
  onSave: (person: Person) => void;
}

export default function NodeSetupDialog({ user, onSave }: NodeSetupDialogProps) {
  const [person, setPerson] = useState<Person>(user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(person);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Setup Your Node</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={person.name}
                onChange={(e) => setPerson({ ...person, name: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                value={person.gender}
                onChange={(e) => setPerson({ ...person, gender: e.target.value as 'male' | 'female' | 'trans' })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="trans">Trans</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateOfBirth">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={person.dateOfBirth}
                onChange={(e) => setPerson({ ...person, dateOfBirth: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deathDate">
                Date of Death
              </label>
              <input
                id="deathDate"
                type="date"
                value={person.deathDate || ''}
                onChange={(e) => setPerson({ ...person, deathDate: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={person.location || ''}
                onChange={(e) => setPerson({ ...person, location: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profession">
                Profession
              </label>
              <input
                id="profession"
                type="text"
                value={person.profession || ''}
                onChange={(e) => setPerson({ ...person, profession: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="biography">
              Biography
            </label>
            <textarea
              id="biography"
              value={person.biography || ''}
              onChange={(e) => setPerson({ ...person, biography: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
              Photo URL
            </label>
            <input
              id="photo"
              type="text"
              value={person.photo || ''}
              onChange={(e) => setPerson({ ...person, photo: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-end">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
