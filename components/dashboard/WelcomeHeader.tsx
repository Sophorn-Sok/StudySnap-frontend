'use client';

import { Zap } from 'lucide-react';

export const WelcomeHeader = () => {
  const userName = 'Hour';
  const meetingsToday = 2;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}!</h1>
      </div>
      <p className="text-gray-600">
        You have {meetingsToday} meeting{meetingsToday > 1 ? 's' : ''} to transcribe today.
      </p>
    </div>
  );
};
