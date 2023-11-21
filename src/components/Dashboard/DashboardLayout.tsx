import React from 'react';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
  return (
    <div className="h-screen bg-gray-100 flex">

      {/* Sidebar */}
      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 items-center">
            <span className="text-gray-500">Dashboard</span>
            <span>/</span>
            <span className="text-gray-700">User Management</span>
          </div>
          <div className="flex items-center space-x-4">
            <input
              className="border rounded p-1"
              type="text"
              placeholder="Search..."
            />
            <div className="bg-red-500 text-white px-2 py-1 rounded">
              Notifications (3)
            </div>
            <span className="mr-4">Hello, User!</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 space-x-2">
          <span className="bg-blue-600 text-white px-4 py-2 rounded">All</span>
          <span className="bg-gray-300 px-4 py-2 rounded">Active</span>
          <span className="bg-gray-300 px-4 py-2 rounded">Pending</span>
        </div>

        {/* Content */}
        <div className="bg-white p-4 shadow-lg rounded">
        <h1>TESTING - THIS SHOULD BE VISIBLE</h1> {/* Add this for visibility */}
        <DashboardHome />
      </div>
    </div>
    </div>
  );
}

const DashboardHome: React.FC = () => {
    return (
      <div className="p-4">
        {/* Header */}
        <header className="mb-4">
          <h1 className="text-3xl">Welcome, [Username]</h1>
          <p className="text-gray-500">System Status: All good</p>
        </header>
  
        {/* Notifications & Alerts */}
        <div className="mb-4 bg-yellow-100 border border-yellow-500 text-yellow-700 p-4 rounded shadow">
          You have 3 pending tasks. Click here to view.
        </div>
  
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-100 p-4 rounded shadow text-center">
            <p>Total Users</p>
            <p className="text-2xl font-semibold">1,234</p>
          </div>
          {/* ... Repeat for other summary cards */}
        </div>
  
        {/* Recent Activity */}
        <div className="mb-4">
          <h2 className="text-xl mb-2">Recent Activity</h2>
          <ul>
            <li>User XYZ made a transaction...</li>
            {/* ... List other recent activities */}
          </ul>
        </div>
  
        {/* Quick Links/Actions */}
        <div className="mb-4 flex gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow">Add User</button>
          {/* ... Other buttons */}
        </div>
  
        {/* Charts */}
        <div className="mb-4">
          {/* Implement charts using a library like Chart.js or Recharts */}
        </div>
  
        {/* Watch List */}
        <div className="mb-4">
          <h2 className="text-xl mb-2">Watch List</h2>
          <ul>
            <li>Account ABC has suspicious activity...</li>
            {/* ... List other watch items */}
          </ul>
        </div>
  
        {/* News & Updates */}
        <div className="mb-4">
          <h2 className="text-xl mb-2">News & Updates</h2>
          <p>Version 2.0.1 has been deployed with new features...</p>
        </div>
      </div>
    );
  }
  

export default DashboardLayout;

