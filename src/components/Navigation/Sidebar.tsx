import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineCaretDown, AiOutlineCaretUp, AiOutlineHome, AiOutlineUser, AiOutlineBook, AiOutlineTransaction, AiOutlineBarChart, AiOutlineShoppingCart } from "react-icons/ai"; // Example icon imports

interface DropdownItemProps {
  title: string;
  items: string[];
  icon: React.ElementType; // New property for the icon component
}

const DropdownItem: React.FC<DropdownItemProps & { route?: string }> = ({
  title,
  items,
  icon: Icon, // Destructure and rename for JSX
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
    <li className="mb-1">
      <button
        aria-expanded={isOpen}
        className="w-full text-left hover:bg-gray-300 bg-gray-200 px-3 py-2 rounded flex items-center transition duration-150 ease-in-out"
        onClick={handleNavigationAndToggle}
      >
        <Icon className="mr-2" /> {/* Icon */}
        {title}
        <span className="ml-auto">{isOpen ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}</span>
      </button>
      {isOpen && (
        <ul className="pl-6 mt-1">
          {items.map((item) => (
            <li key={item} className="hover:bg-gray-300 py-1 transition duration-150 ease-in-out">
              <button
                className="w-full text-left text-gray-700"
                onClick={() => navigate(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

interface SidebarItemProps {
  title: string;
  icon: React.ElementType; // New property for the icon component
  route?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ title, icon: Icon, route }) => { // Destructure and rename for JSX
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === route;

  const handleNavigation = () => {
    if (route) {
      navigate(route);
    }
  };

  const activeClass = isActive ? "bg-gray-300" : "";
  const itemClass = `mb-1 hover:bg-gray-300 w-full text-gray-700 px-3 py-2 rounded flex items-center transition duration-150 ease-in-out ${activeClass}`;

  return (
    <li className={itemClass} onClick={handleNavigation}>
      <Icon className="mr-2" /> {/* Icon */}
      {title}
    </li>
  );
};

interface MenuItem {
  title: string;
  icon: React.ElementType; // New property for the icon component
  dropdownItems?: string[];
  route?: string;
}

const Sidebar = () => {
  const menuItems: MenuItem[] = [
    { title: "Dashboard", icon: AiOutlineHome, route: "/home" },
    {
      title: "User Management",
      icon: AiOutlineUser,
      dropdownItems: ["Add User", "List Users"],
      route: "/users",
    },
    { title: "Accounts", icon: AiOutlineBook, route: "/accounts" },
    { title: "Transactions", icon: AiOutlineTransaction, route: "/transactions" },
    { title: "Instruments", icon: AiOutlineBarChart, route: "/instruments" },
    { title: "Orders", icon: AiOutlineShoppingCart, route: "/orders" },
    // ... add more menu items with their respective icons and routes
  ];

  return (
    <aside className="w-64 bg-gray-100 text-gray-700 shadow p-4">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-center">Thyra Securities</h1>
      </div>
      <ul>
        {menuItems.map((item) =>
          item.dropdownItems ? (
            <DropdownItem
              key={item.title}
              title={item.title}
              items={item.dropdownItems}
              icon={item.icon}
              route={item.route}
            />
          ) : (
            <SidebarItem
              key={item.title}
              title={item.title}
              icon={item.icon}
              route={item.route}
            />
          )
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
