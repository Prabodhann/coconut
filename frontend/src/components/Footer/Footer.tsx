import React from "react";
import { assets } from "@/assets/assets";
import { UI_CONTENT } from "@/constants/uiContent";
import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { toast } from "react-toastify";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleSocialClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info(UI_CONTENT.FOOTER.SOCIAL_TOAST, {
      position: "bottom-center",
      autoClose: 5000,
      icon: <span>🚀</span>,
    });
  };

  return (
    <footer
      className="w-full bg-zinc-950 text-zinc-300 pt-16 pb-8 border-t border-zinc-900"
      id="footer"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Mission */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold tracking-tighter text-white">
                {UI_CONTENT.FOOTER.BRAND}
              </span>
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              {UI_CONTENT.FOOTER.MISSION_STATEMENT}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <SocialIcon
                icon={
                  <img
                    src={assets.facebook_icon}
                    className="w-5 h-5 brightness-0 invert"
                    alt="Facebook"
                  />
                }
                onClick={handleSocialClick}
              />
              <SocialIcon
                icon={
                  <img
                    src={assets.twitter_icon}
                    className="w-5 h-5 brightness-0 invert"
                    alt="Twitter"
                  />
                }
                onClick={handleSocialClick}
              />
              <SocialIcon
                icon={
                  <img
                    src={assets.linkedin_icon}
                    className="w-5 h-5 brightness-0 invert"
                    alt="LinkedIn"
                  />
                }
                onClick={handleSocialClick}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">
              {UI_CONTENT.FOOTER.NAVIGATION_TITLE}
            </h2>
            <ul className="space-y-3">
              <FooterLink href="/" label={UI_CONTENT.NAVBAR.HOME} />
              <FooterLink href="#explore-menu" label={UI_CONTENT.NAVBAR.MENU} />
              <FooterLink href="#app-download" label={UI_CONTENT.NAVBAR.MOBILE_APP} />
              <FooterLink
                href="#"
                label="About the Developer"
                onClick={(e) => {
                  e.preventDefault();
                  toast.success(UI_CONTENT.FOOTER.DEV_CREDIT_TOAST, {
                    position: "bottom-center",
                  });
                }}
              />
            </ul>
          </div>

          {/* Policies & Delivery */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">
              {UI_CONTENT.FOOTER.RESOURCES_TITLE}
            </h2>
            <ul className="space-y-3">
              <FooterLink
                href="#"
                label="Delivery Policy"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info(UI_CONTENT.FOOTER.DELIVERY_DISCLAIMER_TOAST, {
                    icon: <span>🥘</span>,
                  });
                }}
              />
              <FooterLink
                href="#"
                label="Privacy Policy"
                onClick={(e) => {
                  e.preventDefault();
                  toast.success(UI_CONTENT.FOOTER.PRIVACY_POLICY_TOAST, {
                    icon: <span>🔐</span>,
                  });
                }}
              />
              <FooterLink
                href="#"
                label="Terms of Service"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info(UI_CONTENT.FOOTER.TERMS_TOAST);
                }}
              />
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">
              {UI_CONTENT.FOOTER.GET_IN_TOUCH_TITLE}
            </h2>
            <p className="text-zinc-500 text-sm">
              {UI_CONTENT.FOOTER.NEWSLETTER_DESC}
            </p>
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-xl">
              <input
                type="email"
                placeholder={UI_CONTENT.FOOTER.NEWSLETTER_PLACEHOLDER}
                className="bg-transparent border-none focus:ring-0 text-sm px-3 w-full text-zinc-300"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-zinc-600 text-xs">
            <span>{UI_CONTENT.FOOTER.COPYRIGHT_TEXT(currentYear)}</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" />{" "}
              {UI_CONTENT.FOOTER.MADE_WITH_TEXT}
            </span>
          </div>
          <div className="flex gap-6 text-xs text-zinc-600">
            <a href="#" className="hover:text-white transition-colors">
              Documentation
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Open Source
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}) => (
  <motion.a
    href="#"
    onClick={onClick}
    whileHover={{ y: -4, scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-orange-500 hover:border-orange-500/50 transition-colors shadow-lg"
  >
    {icon}
  </motion.a>
);

const FooterLink = ({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: (e: React.MouseEvent) => void;
}) => (
  <li>
    <a
      href={href}
      onClick={onClick}
      className="text-zinc-500 hover:text-white text-sm transition-colors flex items-center group gap-2"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-orange-500/0 group-hover:bg-orange-500 transition-all duration-300" />
      {label}
    </a>
  </li>
);

export default Footer;
