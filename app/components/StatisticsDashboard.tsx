'use client';

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Person } from '../types/FamilyTree';
import { calculateFamilyStatistics } from '../utils/graphUtils';
import { Users, Heart, Calendar } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface StatisticsDashboardProps {
  people: Person[];
  darkMode: boolean;
}

export const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({ people, darkMode }) => {
  const stats = calculateFamilyStatistics(people);

  const genderChartData = {
    labels: ['Male', 'Female', 'Trans'],
    datasets: [
      {
        data: [stats.genderDistribution.male, stats.genderDistribution.female, stats.genderDistribution.trans],
        backgroundColor: ['#3B82F6', '#EC4899', '#16A34A'],
        borderWidth: 0,
      },
    ],
  };

  const ageGroupChartData = {
    labels: ['Infant', 'Kid', 'Adult', 'Senior'],
    datasets: [
      {
        label: 'Family Members',
        data: [
          stats.ageGroupDistribution.infant,
          stats.ageGroupDistribution.kid,
          stats.ageGroupDistribution.adult,
          stats.ageGroupDistribution.senior
        ],
        backgroundColor: ['#FEF3C7', '#FDE68A', '#F59E0B', '#D97706'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#D1D5DB' : '#374151',
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: darkMode ? '#D1D5DB' : '#374151',
        },
        grid: {
          color: darkMode ? '#374151' : '#E5E7EB',
        },
      },
      x: {
        ticks: {
          color: darkMode ? '#D1D5DB' : '#374151',
        },
        grid: {
          color: darkMode ? '#374151' : '#E5E7EB',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#D1D5DB' : '#374151',
        },
      },
    },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
        Family Statistics Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className={`p-6 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Members
              </p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.totalMembers}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className={`p-6 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Living Members
              </p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.livingMembers}
              </p>
            </div>
            <Heart className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className={`p-6 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Average Age
              </p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {Math.round(stats.averageAge)}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className={`p-6 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Gender Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={genderChartData} options={doughnutOptions} />
          </div>
        </div>

        <div className={`p-6 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Age Group Distribution
          </h3>
          <div className="h-64">
            <Bar data={ageGroupChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Name Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Most Common First Names
          </h3>
          <div className="space-y-3">
            {stats.commonFirstNames.map((name, index) => (
              <div key={name.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {name.name}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {name.count} {name.count === 1 ? 'person' : 'people'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Most Common Last Names
          </h3>
          <div className="space-y-3">
            {stats.commonLastNames.map((name, index) => (
              <div key={name.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {name.name}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {name.count} {name.count === 1 ? 'person' : 'people'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};