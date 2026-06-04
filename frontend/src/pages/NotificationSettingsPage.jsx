import React from 'react';
import NotificationSettings from '../../components/NotificationSettings';
import { useApp } from '../../store/AppContext';

const NotificationSettingsPage = () => {
  const { user } = useApp();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Please login first</h2>
          <p className="text-gray-600 mt-2">You need to be logged in to access notification settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">⚙️ Settings</h1>
          <p className="text-gray-600 mt-1">Manage your notification preferences</p>
        </div>
        <NotificationSettings />
      </div>
    </div>
  );
};

export default NotificationSettingsPage;