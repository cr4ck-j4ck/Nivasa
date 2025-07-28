import React from 'react';
import { FaCalendarAlt, FaHome, FaDollarSign, FaStar, FaEnvelope, FaCog } from 'react-icons/fa';
import styles from './sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <nav className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <button className={styles.toggleBtn} onClick={toggleSidebar}>
        {isOpen ? '«' : '»'}
      </button>
      <ul className={styles.menuList}>
        <li><FaCalendarAlt /> Bookings</li>
        <li><FaHome /> Listings</li>
        <li><FaDollarSign /> Earnings</li>
        <li><FaStar /> Reviews</li>
        <li><FaEnvelope /> Messages</li>
        <li><FaCog /> Settings</li>
      </ul>
    </nav>
  );
};

export default Sidebar;
