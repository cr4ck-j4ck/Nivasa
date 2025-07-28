import React from 'react';
import styles from './quickactions.module.css';

const QuickActions: React.FC = () => {
  return (
    <section className={styles.section}>
      <h2>Quick Actions</h2>
      <div className={styles.buttons}>
        <button className={styles.primaryBtn}>Add New Listing</button>
        <button className={styles.secondaryBtn}>View Messages</button>
        <button className={styles.secondaryBtn}>Update Profile</button>
      </div>
    </section>
  );
};

export default QuickActions;
