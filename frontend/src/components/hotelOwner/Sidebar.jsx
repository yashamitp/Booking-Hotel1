import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";

function Sidebar() {
  const sidebarLinks = [
    { name: "Dashboard", path: "/owner", icon: assets.dashboardIcon },
    { name: "Add Hotel", path: "/owner/add-hotel", icon: assets.addIcon },
    { name: "Add Room", path: "/owner/add-room", icon: assets.addIcon },
    { name: "List Room", path: "/owner/list-room", icon: assets.listIcon },
  ];

  return (
    <div className="md:w-64 w-16 border-r h-full text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
      {sidebarLinks.map((item, index) => (
        <NavLink
          to={item.path}
          key={index}
          end={item.path === "/owner"}
          className={({ isActive }) =>
            `flex items-center py-3 px-4 md:px-8 gap-3 transition-all duration-200 ${
              isActive
                ? "bg-blue-100 border-r-4 border-blue-500"
                : "hover:bg-gray-100"
            }`
          }
        >
          <img src={item.icon} alt="" className="min-h-6 min-w-6" />
          <p className="md:block hidden text-center">{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
}

export default Sidebar;