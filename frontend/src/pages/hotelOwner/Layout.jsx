import React from 'react'
import NavBar from '../../components/hotelOwner/NavBar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet, Navigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

function Layout() {
  const { isAdmin, isLoaded } = useAppContext();

  // Wait for Clerk to finish loading before deciding
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  // Block non-admin users from accessing the owner panel
  if (!isAdmin) {
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
  )
}

export default Layout