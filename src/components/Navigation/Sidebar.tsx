import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface DropdownItemProps {
  title: string;
  items: string[];
}

const DropdownItem: React.FC<DropdownItemProps & { route?: string }> = ({
  title,
  items,
  route,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigationAndToggle = () => {
    setIsOpen(!isOpen);
    if (route) {
      navigate(route);
    }
  };

  return (
    <li className="mb-2 relative group">
      <button
        className="w-full text-left hover:bg-blue-500 px-2 py-1 rounded flex justify-between items-center"
        onClick={handleNavigationAndToggle}
      >
        {title}
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      <ul className={`dropdown-content ${isOpen ? "open" : ""}`}>
        {items.map((item) => (
          <li key={item} className="hover:bg-gray-200 px-2 py-1">
            {item}
          </li>
        ))}
      </ul>
    </li>
  );
};

interface SidebarItemProps {
  title: string;
  route?: string; // <-- Add this
}

const SidebarItem: React.FC<SidebarItemProps> = ({ title, route }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === route;

  const handleNavigation = () => {
    if (route) {
      navigate(route);
    }
  };

  const activeClass = isActive ? "bg-slate-700" : "";
  const itemClass = `mb-2 hover:bg-gray-500 w-full text-white px-2 py-1 ${activeClass}`;

  return (
    <li className={itemClass} onClick={handleNavigation}>
      {title}
    </li>
  );
};

interface MenuItem {
  title: string;
  dropdownItems?: string[];
  route?: string; // <-- Add this
}

const Sidebar = () => {
  const menuItems: MenuItem[] = [
    { title: "Dashboard", route: "/home" }, // example
    {
      title: "User Management",
      dropdownItems: ["Add User", "List Users"],
      route: "/users",
    },
    { title: "Accounts", route: "/accounts" }, // example
    { title: "Transactions", route: "/transactions" }, // example
    { title: "Instruments", route: "/instruments" }, // example
    // ... add more menu items with their respective routes
  ];

  return (
    <aside className="w-64 bg-slate-800 text-white shadow-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Thyra Securities</h1>
      </div>
      <ul>
        {menuItems.map((item) =>
          item.dropdownItems ? (
            <DropdownItem
              key={item.title}
              title={item.title}
              items={item.dropdownItems}
              route={item.route} // <-- this was missing
            />
          ) : (
            <SidebarItem
              key={item.title}
              title={item.title}
              route={item.route}
            />
          )
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
