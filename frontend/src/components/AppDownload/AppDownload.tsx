import React from 'react';
import { Link } from 'react-router-dom';
import './AppDownload.css';
import { assets } from '../../assets/assets';

import { UI_CONTENT } from '@/constants/uiContent';

const AppDownload: React.FC = () => {
  return (
    <div className="app-download" id="app-download">
      <p dangerouslySetInnerHTML={{ __html: UI_CONTENT.APP_DOWNLOAD.TEXT.replace(' Download ', ' Download <br /> ') }}></p>
      <div className="app-download-platforms">
        <Link to="/app-download">
          <img src={assets.play_store} alt="play store" />
        </Link>
        <Link to="/app-download">
          <img src={assets.app_store} alt="app store" />
        </Link>
      </div>
    </div>
  );
};

export default AppDownload;
