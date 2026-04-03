import React from "react";
import "./Header.css";

import { UI_CONTENT } from "@/constants/uiContent";

const Header: React.FC = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>{UI_CONTENT.HEADER.TITLE}</h2>
        <p>{UI_CONTENT.HEADER.DESCRIPTION}</p>
        <a href="#explore-menu">{UI_CONTENT.HEADER.BUTTON_TEXT}</a>
      </div>
    </div>
  );
};

export default Header;
