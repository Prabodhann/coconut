import React from "react";
import { assets } from "@/assets/assets";
import { UI_CONTENT } from "@/constants/uiContent";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full bg-zinc-900 text-zinc-300 pt-20 pb-8" id="footer">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-6">
            <img src={assets.logo} alt="Coconut Logo" className="h-10 w-auto brightness-0 invert opacity-90" />
            <p className="text-zinc-400 max-w-md leading-relaxed">
              {UI_CONTENT.FOOTER.DESCRIPTION}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#facebook" className="bg-zinc-800 p-2.5 rounded-full hover:bg-orange-500 hover:text-white transition-all transform hover:-translate-y-1">
                <img src={assets.facebook_icon} alt="Facebook" className="w-5 h-5 brightness-0 invert" />
              </a>
              <a href="#twitter" className="bg-zinc-800 p-2.5 rounded-full hover:bg-orange-500 hover:text-white transition-all transform hover:-translate-y-1">
                <img src={assets.twitter_icon} alt="Twitter" className="w-5 h-5 brightness-0 invert" />
              </a>
              <a href="#linkedin" className="bg-zinc-800 p-2.5 rounded-full hover:bg-orange-500 hover:text-white transition-all transform hover:-translate-y-1">
                <img src={assets.linkedin_icon} alt="LinkedIn" className="w-5 h-5 brightness-0 invert" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white tracking-wide">{UI_CONTENT.FOOTER.COMPANY_TITLE}</h2>
            <ul className="space-y-3">
              {UI_CONTENT.FOOTER.QUICK_LINKS.map((link, index) => (
                <li key={index}>
                  <a href={`#${link.toLowerCase()}`} className="text-zinc-400 hover:text-orange-500 transition-colors inline-block hover:translate-x-1 transform duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white tracking-wide">{UI_CONTENT.FOOTER.GET_IN_TOUCH_TITLE}</h2>
            <ul className="space-y-3 text-zinc-400">
              <li className="flex items-center gap-3">
                <a href={`tel:${UI_CONTENT.FOOTER.CONTACT.PHONE}`} className="hover:text-orange-500 transition-colors">
                  {UI_CONTENT.FOOTER.CONTACT.PHONE}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <a href={`mailto:${UI_CONTENT.FOOTER.CONTACT.EMAIL}`} className="hover:text-orange-500 transition-colors">
                  {UI_CONTENT.FOOTER.CONTACT.EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center text-zinc-500 text-sm">
          <p>{UI_CONTENT.FOOTER.COPYRIGHT(currentYear)}</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
