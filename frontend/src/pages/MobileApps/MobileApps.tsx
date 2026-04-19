import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MobileApps.css";
import { assets } from "@/assets/assets";
import { UI_CONTENT } from "@/constants/uiContent";
import { CONSTANTS } from "@/constants";
import { toast } from "react-toastify";

const MobileApps: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${CONSTANTS.API_URL}/api/newsletter/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setEmail("");
        toast.success("Registration successful! Check your email. 🥥");
      } else {
        throw new Error(data.message || "Subscription failed");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mobile-apps-container">
      <div className="glass-card">
        <button className="back-home-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        <div className="content">
          <h1 className="animate-fade-in">
            {UI_CONTENT.APP_DOWNLOAD.COMING_SOON_TITLE}
          </h1>
          <p className="subtitle animate-fade-in-delay">
            {UI_CONTENT.APP_DOWNLOAD.COMING_SOON_SUBTITLE}
          </p>

          <div className="platform-stats animate-slide-up">
            <div className="platform">
              <img src={assets.play_store} alt="Android" className="floating" />
              <span>Android</span>
            </div>
            <div className="platform">
              <img
                src={assets.app_store}
                alt="iOS"
                className="floating-delayed"
              />
              <span>iOS</span>
            </div>
          </div>

          <div className="subscription-section animate-slide-up-delay">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="subscribe-form">
                <input
                  type="email"
                  placeholder={UI_CONTENT.APP_DOWNLOAD.NOTIFY_PLACEHOLDER}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Sending..."
                    : UI_CONTENT.APP_DOWNLOAD.NOTIFY_BTN}
                </button>
              </form>
            ) : (
              <div className="success-message">
                <h3>{UI_CONTENT.APP_DOWNLOAD.SUCCESS_TITLE}</h3>
                <p>{UI_CONTENT.APP_DOWNLOAD.SUCCESS_SUB}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
    </div>
  );
};

export default MobileApps;
