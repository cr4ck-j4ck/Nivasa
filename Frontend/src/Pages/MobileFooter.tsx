import { FaSearch, FaHeart, FaUserCircle } from 'react-icons/fa';
import { BiMessageSquareDetail } from 'react-icons/bi';
import React from 'react';
interface NavItem {
  name: string;
  icon: React.JSX.Element;
  isActive?: boolean;
}

const MobileBottomNavigation = () => {
  const navItems: NavItem[] = [
    { name: 'Explore', icon: <FaSearch />, isActive: true },
    { name: 'Wishlists', icon: <FaHeart /> },
    { name: 'Trips', icon : <img src="/Nivasa-removebg-preview.png" alt="Nivasa_Logo" className='h-10 -mt-3'/> },
    { name: 'Messages', icon: <BiMessageSquareDetail /> },
    { name: 'Profile', icon: <FaUserCircle /> },
  ];

  return (
    <nav className="mobileBottomNavigation fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50">
      <ul className="flex justify-around items-center py-2">
        {navItems.map((item, index) => (
          <li key={index} className="flex flex-col items-center text-xs">
            <div className={`text-2xl mb-1 ${item.isActive ? 'text-pink-600' : 'text-gray-600'}`}>
              {item.icon}
            </div>
            <span className={`${item.isActive ? 'text-pink-600 font-semibold' : 'text-gray-600'}`}>
              {item.name}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileBottomNavigation;
