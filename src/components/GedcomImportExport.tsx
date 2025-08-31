import React, { useState } from 'react';
import { Download, Upload, FileText } from 'lucide-react';
import { Person } from '../types/FamilyTree';

interface GedcomImportExportProps {
  people: Person[];
  darkMode: boolean;
  onImport: (people: Person[]) => void;
}

export const GedcomImportExport: React.FC<GedcomImportExportProps> = ({
  people,
  darkMode,
  onImport
}) => {
  const [importing, setImporting] = useState(false);

  const exportToGedcom = () => {
    let gedcom = '0 HEAD\n';
    gedcom += '1 SOUR Family Tree App\n';
    gedcom += '1 GEDC\n';
    gedcom += '2 VERS 5.5.1\n';
    gedcom += '2 FORM LINEAGE-LINKED\n';
    gedcom += '1 CHAR UTF-8\n';

    // Add individuals
    people.forEach((person, index) => {
      gedcom += `0 @I${index + 1}@ INDI\n`;
      gedcom += `1 NAME ${person.name}\n`;
      gedcom += `1 SEX ${person.gender === 'male' ? 'M' : person.gender === 'female' ? 'F' : 'U'}\n`;
      gedcom += `1 BIRT\n`;
      gedcom += `2 DATE ${new Date(person.dateOfBirth).toLocaleDateString()}\n`;
      if (person.location) {
        gedcom += `2 PLAC ${person.location}\n`;
      }
      if (person.deathDate) {
        gedcom += `1 DEAT\n`;
        gedcom += `2 DATE ${new Date(person.deathDate).toLocaleDateString()}\n`;
      }
      if (person.profession) {
        gedcom += `1 OCCU ${person.profession}\n`;
      }
      if (person.biography) {
        gedcom += `1 NOTE ${person.biography}\n`;
      }
    });

    // Add families (simplified)
    const families: { [key: string]: { spouse1: string; spouse2: string; children: string[] } } = {};
    
    people.forEach((person, index) => {
      const spouseRel = person.relationships.find(rel => rel.type === 'spouse');
      if (spouseRel) {
        const spouseIndex = people.findIndex(p => p.id === spouseRel.personId);
        if (spouseIndex !== -1) {
          const familyKey = [index + 1, spouseIndex + 1].sort().join('-');
          if (!families[familyKey]) {
            families[familyKey] = {
              spouse1: `@I${Math.min(index + 1, spouseIndex + 1)}@`,
              spouse2: `@I${Math.max(index + 1, spouseIndex + 1)}@`,
              children: []
            };
          }
        }
      }
    });

    Object.entries(families).forEach(([key, family], familyIndex) => {
      gedcom += `0 @F${familyIndex + 1}@ FAM\n`;
      gedcom += `1 HUSB ${family.spouse1}\n`;
      gedcom += `1 WIFE ${family.spouse2}\n`;
      family.children.forEach(child => {
        gedcom += `1 CHIL ${child}\n`;
      });
    });

    gedcom += '0 TRLR\n';

    const blob = new Blob([gedcom], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'family-tree.ged';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Basic GEDCOM parsing (simplified)
        const lines = content.split('\n');
        const importedPeople: Person[] = [];
        
        let currentPerson: Partial<Person> | null = null;
        
        lines.forEach(line => {
          const trimmed = line.trim();
          if (trimmed.startsWith('0 @I') && trimmed.includes('INDI')) {
            if (currentPerson && currentPerson.name) {
              importedPeople.push({
                id: `imported-${importedPeople.length}`,
                name: currentPerson.name,
                dateOfBirth: currentPerson.dateOfBirth || '1900-01-01',
                gender: currentPerson.gender || 'male',
                location: currentPerson.location,
                profession: currentPerson.profession,
                biography: currentPerson.biography,
                relationships: []
              } as Person);
            }
            currentPerson = {};
          } else if (trimmed.startsWith('1 NAME ')) {
            if (currentPerson) currentPerson.name = trimmed.substring(7);
          } else if (trimmed.startsWith('1 SEX ')) {
            if (currentPerson) {
              const sex = trimmed.substring(6);
              currentPerson.gender = sex === 'M' ? 'male' : sex === 'F' ? 'female' : 'trans';
            }
          } else if (trimmed.startsWith('2 DATE ')) {
            if (currentPerson) {
              const dateStr = trimmed.substring(7);
              try {
                currentPerson.dateOfBirth = new Date(dateStr).toISOString().split('T')[0];
              } catch {
                currentPerson.dateOfBirth = '1900-01-01';
              }
            }
          } else if (trimmed.startsWith('2 PLAC ')) {
            if (currentPerson) currentPerson.location = trimmed.substring(7);
          } else if (trimmed.startsWith('1 OCCU ')) {
            if (currentPerson) currentPerson.profession = trimmed.substring(7);
          } else if (trimmed.startsWith('1 NOTE ')) {
            if (currentPerson) currentPerson.biography = trimmed.substring(7);
          }
        });

        if (currentPerson && currentPerson.name) {
          importedPeople.push({
            id: `imported-${importedPeople.length}`,
            name: currentPerson.name,
            dateOfBirth: currentPerson.dateOfBirth || '1900-01-01',
            gender: currentPerson.gender || 'male',
            location: currentPerson.location,
            profession: currentPerson.profession,
            biography: currentPerson.biography,
            relationships: []
          } as Person);
        }

        if (importedPeople.length > 0) {
          onImport(importedPeople);
        }
      } catch (error) {
        console.error('Error parsing GEDCOM file:', error);
        alert('Error parsing GEDCOM file. Please check the file format.');
      } finally {
        setImporting(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className={`fixed bottom-4 right-4 ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border rounded-lg shadow-lg p-4 z-30`}>
      <div className="flex items-center space-x-2 mb-3">
        <FileText className="w-5 h-5 text-purple-600" />
        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          GEDCOM Import/Export
        </h3>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={exportToGedcom}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
        
        <label className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{importing ? 'Importing...' : 'Import'}</span>
          <input
            type="file"
            accept=".ged,.gedcom"
            onChange={handleImport}
            className="hidden"
            disabled={importing}
          />
        </label>
      </div>
    </div>
  );
};