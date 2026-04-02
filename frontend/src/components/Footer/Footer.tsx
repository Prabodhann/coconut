import React from "react";
import "./Footer.css";
import { assets } from "@/assets/assets";
import { UI_CONTENT } from "@/constants/uiContent";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <p>{UI_CONTENT.FOOTER.DESCRIPTION}</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>{UI_CONTENT.FOOTER.COMPANY_TITLE}</h2>
          <ul>
            {UI_CONTENT.FOOTER.QUICK_LINKS.map((link, index) => (
              <li key={index}>{link}</li>
            ))}
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>{UI_CONTENT.FOOTER.GET_IN_TOUCH_TITLE}</h2>
          <ul>
            <li>{UI_CONTENT.FOOTER.CONTACT.PHONE}</li>
            <li>{UI_CONTENT.FOOTER.CONTACT.EMAIL}</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        {UI_CONTENT.FOOTER.COPYRIGHT(currentYear)}
      </p>
    </div>
  );
};

export default Footer;
