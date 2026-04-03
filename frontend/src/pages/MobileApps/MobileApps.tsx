import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MobileApps.css';
import { assets } from '@/assets/assets';

const MobileApps: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div className="mobile-apps-container">
      <div className="glass-card">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        
        <div className="content">
          <h1 className="animate-fade-in">Coming Soon</h1>
          <p className="subtitle animate-fade-in-delay">
            Our mobile applications are currently under development. <br />
            We're building something <strong>extraordinary</strong> for you.
          </p>

          <div className="platform-stats animate-slide-up">
            <div className="platform">
              <img src={assets.play_store} alt="Android" className="floating" />
              <span>Android</span>
            </div>
            <div className="platform">
              <img src={assets.app_store} alt="iOS" className="floating-delayed" />
              <span>iOS</span>
            </div>
          </div>

          <div className="subscription-section animate-slide-up-delay">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="subscribe-form">
                <input
                  type="email"
                  placeholder="Enter your email for early access"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">Notify Me</button>
              </form>
            ) : (
              <div className="success-message">
                <h3>✨ You're on the list!</h3>
                <p>We'll notify you as soon as we launch.</p>
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
