import React from 'react';
import styles from './header.module.css';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className={styles.header}>
      <button onClick={toggleSidebar} className={styles.menuBtn}>☰</button>
      <div className={styles.userInfo}>
        <img
          src="https://i.pravatar.cc/40"
          alt="User Avatar"
          className={styles.avatar}
        />
        <span>John Doe</span>
      </div>
    </header>
  );
};

export default Header;
