import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import hero1 from "../assets/hero-1.jpg";
import hero2 from "../assets/hero-2.jpg";
import hero3 from "../assets/hero-3.jpg";

export default function Dashboard() {
  const campaignSectionRef = useRef(null);
  const scrollToCampaigns = () => {
    campaignSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const images = [hero1, hero2, hero3];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navigation />
      <div className="w-full font-inter scroll-smooth">
        {/* Hero Section with Image Transition */}
        <div className="relative h-screen overflow-hidden">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`absolute top-0 left-0 w-full h-full bg-cover  bg-center transition-opacity duration-1000 ease-in-out ${
                idx === currentImage ? "opacity-100 z-20" : "opacity-0 z-10"
              }`}
              style={{ backgroundImage: `url(${img})` }} // ✅ CORRECTED
            />
          ))}

          <div className="absolute inset-0  bg-opacity-30 z-30" />
          <div className="relative z-40 flex h-full w-full items-center justify-center">
            <div className="w-full max-w-5xl px-6 text-center text-white -mt-16 md:-mt-24">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg whitespace-nowrap overflow-hidden text-ellipsis break-words">
                Clean Water for Every Life
              </h1>
              <p className="mb-6 text-base sm:text-lg md:text-xl drop-shadow-md">
                AquaHope helps you contribute to life-changing clean water
                projects across Africa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={scrollToCampaigns}
                  className="w-auto self-center bg-[#0077b6] hover:bg-[#005f87] text-white px-10 py-3 rounded-full text-lg transition shadow-md"
                >
                  Explore Campaigns
                </button>
                <Link
                  to="/login"
                  className="w-auto self-center bg-[#ff6b6b] hover:bg-[#e63946] text-white px-10 py-3 rounded-full text-lg transition shadow-md"
                >
                  Login to Donate
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns Section */}
        <div
          ref={campaignSectionRef}
          className="min-h-screen py-20 px-6 md:px-20 bg-[#f9f9f9] flex flex-col items-center justify-center"
        >
          <h2 className="text-3xl font-semibold text-[#1e1e1e] mb-10 text-center animate-fade-in-up">
            Active Campaigns
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition animate-fade-in-up"
              >
                <div className="h-48 bg-[#eaeaea] rounded mb-4"></div>
                <h3 className="text-xl font-semibold text-[#0077b6] mb-2">
                  Clean Water Project {card}
                </h3>
                <p className="text-sm text-[#333] mb-4">
                  Help us build a sustainable clean water source in a rural
                  African village.
                </p>
                <button className="text-[#0077b6] font-medium hover:underline">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Donation Steps Section */}
        <div
          className="relative h-screen flex items-center justify-center bg-fixed bg-cover bg-center"
          // style={{ backgroundImage: "url('/src/assets/hero-2.jpg')" }} // Replace as needed
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 text-white px-4 text-center max-w-3xl animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How to Make a Donation
            </h2>
            <ul className="space-y-4 text-lg md:text-xl">
              <li>✅ Sign up or login to your account.</li>
              <li>✅ Browse the campaign that speaks to your heart.</li>
              <li>✅ Choose an amount and securely donate.</li>
              <li>✅ Track your impact in Your Journey section.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
