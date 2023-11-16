import React, { useRef, useState } from "react";
import { Tabs, Menu } from "antd";
import AccountTableView from "../../pages/Tables/AccountTableView";
import Dashboard from "../../pages/Dashboard";
import Home from "../../pages/Home";

// Example components to render in tabs

const Navbar: React.FC = () => {
  const [activeKey, setActiveKey] = useState("");
  const [items, setItems] = useState([]);
  const newTabIndex = useRef(0);

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const addTab = (label: string, Component: React.ReactNode) => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    setItems([...items, { label, children: Component, key: newActiveKey }]);
    setActiveKey(newActiveKey);
  };

  const onDropdownMenuClick = ({ key, domEvent }) => {
    domEvent.stopPropagation(); // Prevents the navbar menu item click

    let Component;
    switch (key) {
      case "Accounts":
        Component = <AccountTableView />;
        break;
      case "Option2":
        Component = <ComponentTwo />;
        break;
      default:
        Component = <div>Default Content</div>;
    }
    addTab(`${key}`, Component);
  };

  const menu = (
    <Menu onClick={onDropdownMenuClick} className="bg-white">
      <Menu.Item key="Accounts">Accounts View</Menu.Item>
      <Menu.Item key="Option2">Option 2</Menu.Item>
      {/* Add more dropdown items as needed */}
    </Menu>
  );

  return (
    <div className="w-full">
      <Menu mode="horizontal" className="bg-gray-100">
        <Menu.SubMenu key="SubMenu" title="Accounts" popupOffset={[0, 0]}>
          {menu}
        </Menu.SubMenu>
        <Menu.SubMenu key="InstrumentMenu" title="Instruments" popupOffset={[0, 0]}>
          {menu}
        </Menu.SubMenu>
        {/* Add more navbar items as needed */}
      </Menu>

      {items.length === 0 ? (
        <Home />
      ) : (
        <Tabs
          hideAdd
          onChange={onChange}
          activeKey={activeKey}
          type="editable-card"
          onEdit={(targetKey, action) => {
            if (action === "remove") {
              const newPanes = items.filter((pane) => pane.key !== targetKey);
              setActiveKey(newPanes.length ? newPanes[0].key : "");
              setItems(newPanes);
            }
          }}
          items={items}
          className="w-full"
        />
      )}
    </div>
  );
};

export default Navbar;
