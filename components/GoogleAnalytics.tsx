"use client"
import { useEffect } from 'react';
import ReactGA from 'react-ga';

interface GoogleAnalyticsProps {
  trackingID: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ trackingID }) => {
  useEffect(() => {
    ReactGA.initialize(trackingID);
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, [trackingID]);

  return null;
};

export default GoogleAnalytics;
