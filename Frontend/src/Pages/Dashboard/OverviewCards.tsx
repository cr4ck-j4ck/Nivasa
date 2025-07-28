import React from 'react';
import styles from './overviewCards.module.css';

const OverviewCards: React.FC = () => {
  // Mock data summary
  const totalBookings = 12;
  const upcomingTrips = 3;
  const totalEarnings = 4700.5;
  const unreadMessages = 4;

  return (
    <section className={styles.overview}>
      <div className={styles.card}>
        <h3>Total Bookings</h3>
        <p>{totalBookings}</p>
      </div>
      <div className={styles.card}>
        <h3>Upcoming Trips</h3>
        <p>{upcomingTrips}</p>
      </div>
      <div className={styles.card}>
        <h3>Total Earnings</h3>
        <p>${totalEarnings.toFixed(2)}</p>
      </div>
      <div className={styles.card}>
        <h3>Unread Messages</h3>
        <p>{unreadMessages}</p>
      </div>
    </section>
  );
};

export default OverviewCards;
