import type React from 'react';
import { useState } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import type { MenuItemProps } from '../data/menuData';
import { getMenusBySidebarId, getSidebarLabelById } from '../utils/utils';
import Submenu from './Submenu';

const Menu: React.FC<MenuItemProps> = ({
  isMenuOpen,
  activeItem,
  isSubmenuOpen,
  activeSubmenuItem,
  onSubmenuItemClick,
  onCloseMenu,
  onCloseSubmenu
}) => {
  const [activeMenuItem, setActiveMenuItem] = useState('');

  if (!isMenuOpen || !activeItem) return null;

  const menuItems = getMenusBySidebarId(activeItem);

  const handleClickMenu = (id: string) => {
    setActiveMenuItem(id);
    onSubmenuItemClick(id);
  };

  return (
    <nav
      className={cn(
        'absolute z-10 top-4 left-[18rem] min-h-[calc(100%_-_70px)] max-h-[calc(100%_-_70px)] bg-white shadow-[0px_2px_7px_5px_#00000040] rounded-r-[22px]',
        isSubmenuOpen ? 'min-w-[53.625rem]' : 'min-w-[24.5rem]'
      )}
      style={{ clipPath: 'inset(-10px -10px -10px 0)' }}
      onMouseLeave={onCloseMenu}
    >
      <div className="pl-6 pr-10 pb-10 pt-3 flex absolute w-full h-full overflow-hidden">
        {/* Menu lateral */}
        <div className="w-[24.5rem]">
          <p className="font-semibold text-gray-800 mb-2 text-[2rem] relative after:content-[''] after:absolute after:-bottom-[5px] after:left-0 after:w-[15%] after:h-[5px] after:bg-primary-500">
            {getSidebarLabelById(activeItem)}
          </p>
          <div className="py-3 flex flex-col overflow-y-auto">
            {menuItems.map((item) => {
              const isPendingActive = activeSubmenuItem === item.id;

              const commonClassName = cn(
                'text-xl py-5 text-left pl-10 rounded-[1.25rem] transition-all duration-300 border-b border-gray-100',
                isPendingActive
                  ? 'bg-primary-500 text-white'
                  : 'hover:bg-primary-500 hover:text-white'
              );

              if (item.path) {
                return (
                  <Link to={item.path} key={item.id} className={commonClassName}>
                    {item.label}
                  </Link>
                );
              }

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleClickMenu(item.id)}
                  className={commonClassName}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <Submenu
          isSubmenuOpen={isSubmenuOpen}
          activeMenuItem={activeMenuItem}
          onSubmenuItemClick={onSubmenuItemClick}
          onCloseSubmenu={onCloseSubmenu}
        />
      </div>
    </nav>
  );
};

export default Menu;
