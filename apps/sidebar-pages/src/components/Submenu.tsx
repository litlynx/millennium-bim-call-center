import type React from 'react';
import { Link } from 'react-router';
import type { SubmenuItemProps } from '../data/menuData';
import { getSubmenuLinksBySubmenuId, getSubmenusByMenuId } from '../utils/utils';

const Submenu: React.FC<SubmenuItemProps> = ({
  isSubmenuOpen,
  activeMenuItem,
  onSubmenuItemClick,
  onCloseSubmenu
}) => {
  if (!isSubmenuOpen || !activeMenuItem) return null;

  const submenus = getSubmenusByMenuId(activeMenuItem);

  return (
    <div
      className="w-[28rem] pl-6 mt-14 overflow-y-auto scroll-custom-bar h-[calc(100%_-_70px)]"
      role="menu"
      tabIndex={-1}
      onMouseLeave={onCloseSubmenu}
    >
      {submenus.map((submenu) => {
        const submenuLinks = getSubmenuLinksBySubmenuId(submenu.id);

        return (
          <div key={submenu.id}>
            <p className="uppercase p-4 bg-gray-100 rounded-lg text-gray-800 opacity-60 m-0 font-semibold">
              {submenu.label}
            </p>
            <div className="flex flex-col overflow-y-auto">
              {submenuLinks.map((link) => (
                <Link
                  to={link.path}
                  key={link.id}
                  onClick={() => onSubmenuItemClick(link.id)}
                  className="group flex flex-col justify-center font-medium text-xl py-5 text-left pl-10 rounded-[1.25rem] border-b border-gray-100 hover:bg-primary-500 hover:text-white active:bg-primary-500 active:text-white transition-all duration-300"
                >
                  {link.label}
                  {link.description && (
                    <span className="font-medium text-gray-800 group-hover:text-white text-xs">
                      {link.description}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Submenu;
