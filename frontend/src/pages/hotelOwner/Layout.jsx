import React from 'react';
import NavBar from '../../components/hotelOwner/NavBar';
import Sidebar from '../../components/hotelOwner/Sidebar';
import { Outlet, Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

function Layout() {
  const { isAdmin, hasHotelPermission, isLoaded, checkingPermission } = useAppContext();

  // Wait for Clerk and permission check to finish loading before deciding
  if (!isLoaded || checkingPermission) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 font-medium">
        Loading panel...
      </div>
    );
  }

  // Allow admin and partners with approved hotel posting permission
  if (!isAdmin && !hasHotelPermission) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className='flex flex-col h-screen'>
      <NavBar />
      <div className='flex h-full'>
        <Sidebar />
      </div>
      <div className='flex-1 p-4 pt-10 md:px-10 h-full '>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
