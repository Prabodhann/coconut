import React from "react";
import { NavLink } from "react-router-dom";
import { PlusCircle, ListIcon, ShoppingBag } from "lucide-react";
import { cn } from "../../lib/utils";

import { ADMIN_NAV_LINKS } from "../../constants";

const Sidebar: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "PlusCircle":
        return <PlusCircle size={20} />;
      case "ListIcon":
        return <ListIcon size={20} />;
      case "ShoppingBag":
        return <ShoppingBag size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 pt-[30px] font-medium transition-colors">
      <div className="flex flex-col gap-3 pr-[10px] pl-[10px] lg:pl-[20px]">
        {ADMIN_NAV_LINKS.map((menu, i) => (
          <NavLink
            key={i}
            to={menu.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 py-3 px-4 rounded-md cursor-pointer transition-all duration-200 text-slate-600 dark:text-slate-400 border border-transparent",
                isActive
                  ? "bg-orange-50 dark:bg-orange-500/10 border-orange-300 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 shadow-[inset_3px_0px_0px_rgba(234,88,12,1)]"
                  : "hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200",
              )
            }
          >
            {getIcon(menu.icon)}
            <span className="hidden lg:block text-[15px]">{menu.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
