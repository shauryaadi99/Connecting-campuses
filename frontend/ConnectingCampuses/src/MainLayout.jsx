// src/MainLayout.jsx
import React from 'react';
import Navbar from './connectingcomponents/Navbar';
import HeroSection from './connectingcomponents/HeroSection';
import Newsroom from './connectingcomponents/Newsroom';
import LostAndFound from './connectingcomponents/LostAndFound';
import CarpoolingSection from './connectingcomponents/CarpoolingSection';
import SellBuySection from './connectingcomponents/SellBuySection';
import Footer from './connectingcomponents/Footer';
import ClubStrip from './connectingcomponents/ClubStrip';
import LayoutGridDemo from './components/ui/layout-grid-demo';

const MainLayout = () => {
  return (
    <>
      <HeroSection />
      <ClubStrip />
      <Newsroom />
      <LostAndFound />
      <CarpoolingSection />
      <SellBuySection />
    </>
  );
};

export default MainLayout;
