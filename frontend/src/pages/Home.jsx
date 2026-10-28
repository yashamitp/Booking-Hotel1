import React from "react";
import Hero from "../components/Hero";
import FeaturedDestination from "../components/FeaturedDestination";
import ExclusiveOffers from "../components/ExclusiveOffers";
import WhyQuickStay from "../components/WhyQuickStay";
import RecentlyViewed from "../components/RecentlyViewed";
import Testimonial from "../components/Testimonial";
import NewsLetter from "../components/NewsLetter";

function Home() {
  return (
    <>
      <Hero />
      <FeaturedDestination />
      <ExclusiveOffers />
      <WhyQuickStay />
      <RecentlyViewed />
      <Testimonial />
      <NewsLetter />
    </>
  );
}

export default Home;
