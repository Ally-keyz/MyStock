import React from 'react';
import { NavLink } from 'react-router-dom';

const RightSidebar = () => {
  return (
    <div className="w-full sm:w-[200px] bg-gray-100 border-l border-gray-300 p-3">
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-800">Quick Links</h2>
      </div>
      <nav className="space-y-2">
        <NavLink
          to="/profile"
          className="block text-gray-700 hover:bg-gray-200 p-1 rounded"
        >
          Profile
        </NavLink>
        <NavLink
          to="/settings"
          className="block text-gray-700 hover:bg-gray-200 p-1 rounded"
        >
          Settings
        </NavLink>
        <NavLink
          to="/activity"
          className="block text-gray-700 hover:bg-gray-200 p-1 rounded"
        >
          Recent Activity
        </NavLink>
        <NavLink
          to="/help"
          className="block text-gray-700 hover:bg-gray-200 p-1 rounded"
        >
          Help &amp; Support
        </NavLink>
      </nav>
    </div>
  );
};

export default RightSidebar;

