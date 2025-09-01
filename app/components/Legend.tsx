'use client';

import React from 'react';

export const Legend: React.FC = () => {
  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-sm backdrop-blur-sm">
      <h3 className="font-semibold mb-3">Legend</h3>
      
      <div className="space-y-3">
        <div>
          <h4 className="font-medium mb-2">Node Colors (Gender)</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-pink-500"></div>
              <span>Female</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span>Male</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span>Trans</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-black"></div>
              <span>Main User</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Age Groups</h4>
          <div className="space-y-1 text-xs">
            <div>Lighter shade: Infant/Kid</div>
            <div>Darker shade: Adult/Senior</div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Relationship Lines</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-amber-500"></div>
              <span>Spouse</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-emerald-500"></div>
              <span>Parent-Child</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-purple-500"></div>
              <span>Sibling</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};