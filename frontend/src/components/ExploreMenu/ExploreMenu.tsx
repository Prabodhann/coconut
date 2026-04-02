import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '@/assets/assets';
import { UI_CONTENT } from '@/constants/uiContent';

interface ExploreMenuProps {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

const ExploreMenu: React.FC<ExploreMenuProps> = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>{UI_CONTENT.EXPLORE_MENU.TITLE}</h1>
      <p className="explore-menu-text">
        {UI_CONTENT.EXPLORE_MENU.DESCRIPTION}
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? 'All' : item.menu_name
                )
              }
              key={index}
              className="explore-menu-list-item"
            >
              <img
                src={item.menu_image}
                className={category === item.menu_name ? 'active' : ''}
                alt=""
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
