import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import OverviewCards from './OverviewCards';
import UpcomingTrips from './UpcomingTrips';
import ActiveListings from './ActiveListings';
import EarningsChart from './EarningsChart';
import ReviewsList from './ReviewList';
import QuickActions from './QuickActions';

import styles from './dashboard.module.css';  // CSS Modules, optional

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock user data and other data here or fetch from API
  // For brevity, you’ll see some mocked in subcomponents

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className={`${styles.dashboardContainer}`}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={styles.mainContent}>
        <Header toggleSidebar={toggleSidebar} />
        <div className={styles.contentArea}>
          <OverviewCards />
          <QuickActions />
          <UpcomingTrips />
          <ActiveListings />
          <EarningsChart />
          <ReviewsList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
