import Hero from "./Hero";
import Categories from "./Categories";
import BusinessSection from "./Businesses/BusinessSection";
import NewArrival from "./NewArrivals";

const Home = () => {
  return (
    <main>
      <Hero />
      <Categories />
      <BusinessSection />
      <NewArrival />
      {/* <PromoBanner /> */}
      {/* <BestSeller /> */}
      {/* <CounDown /> */}
      {/* <Testimonials /> */}
      {/* <Newsletter /> */}
    </main>
  );
};

export default Home;
