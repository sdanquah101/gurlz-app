import React from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsCard from '../components/dashboard/StatsCard';
import FeaturedSections from '../components/dashboard/FeaturedSections';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <DashboardHeader />
      <StatsCard />
      <FeaturedSections />
    </div>
  );
}