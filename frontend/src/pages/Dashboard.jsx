import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import hero1 from "../assets/dashboard/hero-1.jpg";
import hero2 from "../assets/dashboard/hero-2.jpg";
import hero3 from "../assets/dashboard/hero-3.jpg";
import { FaArrowDown, FaTimes } from "react-icons/fa";
import loginStep from "../assets/dashboard/login-step.png";
import browseStep from "../assets/dashboard/browse-step.png";
import donateStep from "../assets/dashboard/donate-step.png";
import journeyStep from "../assets/dashboard/journey-step.png";

export default function Dashboard() {
  const campaignSectionRef = useRef(null);
  const donationStepsRef = useRef(null);

  const scrollToCampaigns = () => {
    campaignSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToDonationSteps = () => {
    donationStepsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const images = [hero1, hero2, hero3];
  const [currentImage, setCurrentImage] = useState(0);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const campaigns = [
    {
      id: 1,
      title: "Clean Water Project 1",
      shortDesc: "Help us build a sustainable clean water source.",
      longDesc:
        "We are working to build a solar-powered water filtration system in rural Kenya. This project will serve over 500 families with clean water.",
      received: 3400,
      target: 5000,
    },
    {
      id: 2,
      title: "Clean Water Project 2",
      shortDesc: "Provide easy access to safe drinking water.",
      longDesc:
        "This project involves drilling a deep borehole and installing a hand pump in a remote Tanzanian village.",
      received: 2700,
      target: 6000,
    },
    {
      id: 3,
      title: "Clean Water Project 3",
      shortDesc: "Transform lives through clean water supply.",
      longDesc:
        "We're building a gravity-fed water supply system to connect a stream to several communities in Uganda.",
      received: 1800,
      target: 4500,
    },
    {
      id: 4,
      title: "Clean Water Project 3",
      shortDesc: "Transform lives through clean water supply.",
      longDesc:
        "We're building a gravity-fed water supply system to connect a stream to several communities in Uganda.",
      received: 1800,
      target: 4500,
    },
    {
      id: 5,
      title: "Clean Water Project 3",
      shortDesc: "Transform lives through clean water supply.",
      longDesc:
        "We're building a gravity-fed water supply system to connect a stream to several communities in Uganda.",
      received: 1800,
      target: 4500,
    },
  ];

  return (
    <>
      <Navigation />
      <div className="w-full font-inter scroll-smooth text-[#212529]">
        {/* Hero Section */}
        <div className="relative h-screen overflow-hidden pt-16">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                idx === currentImage ? "opacity-100 z-20" : "opacity-0 z-10"
              }`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="absolute inset-0 bg-opacity-30 z-30" />
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
                  className="bg-[#0077b6] hover:bg-[#005f87] text-white px-10 py-3 rounded-full text-lg transition shadow-md"
                >
                  Explore Campaigns
                </button>
                <Link
                  to="/login"
                  className="bg-[#ff6b6b] hover:bg-[#e63946] text-white px-10 py-3 rounded-full text-lg transition shadow-md"
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
          className="relative min-h-screen pt-30 px-6 md:px-20 bg-[#f9f9f9] flex flex-col items-center"
        >
          <h2 className="text-3xl font-semibold mb-10 text-center animate-fade-in-up">
            Active Campaigns
          </h2>

          {/* Expanded Card */}
          {expandedCard && (
            <div className="w-full max-w-5xl mb-12 bg-white rounded-lg shadow-lg p-8 relative animate-fade-in-up">
              <button
                onClick={() => setExpandedCard(null)}
                className="absolute top-4 right-4 text-2xl text-gray-700 hover:text-red-500 transition"
              >
                <FaTimes />
              </button>
              <h3 className="text-3xl font-bold text-[#0077b6] mb-4">
                {expandedCard.title}
              </h3>
              <p className="text-base mb-4">{expandedCard.longDesc}</p>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-[#0077b6] h-4 rounded-full"
                  style={{
                    width: `${
                      (expandedCard.received / expandedCard.target) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <p className="text-md mb-2 font-medium">
                💧 Raised: ${expandedCard.received} / ${expandedCard.target}
              </p>
              <p className="text-sm text-gray-600">
                Project completion expected by Dec 2025.
              </p>
            </div>
          )}

          {/* Campaign Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
            {campaigns.map((card) => (
              <div
                key={card.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition animate-fade-in-up"
              >
                <div className="h-48 bg-[#eaeaea] rounded mb-4"></div>
                <h3 className="text-xl font-semibold text-[#0077b6] mb-2">
                  {card.title}
                </h3>
                <p className="text-sm mb-4">{card.shortDesc}</p>
                <button
                  className="text-[#0077b6] font-medium hover:underline"
                  onClick={() => setExpandedCard(card)}
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={scrollToDonationSteps}
            className="mt-10 mb-10 text-[#0077b6] hover:text-[#005f87] text-lg flex items-center gap-2 transition"
          >
            How it works <FaArrowDown className="animate-bounce" />
          </button>
        </div>

        {/* Donation Steps Section */}
        <div
          ref={donationStepsRef}
          className="relative pt-30 pb-10 px-6 md:px-20 bg-white text-[#212529]"
        >
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How to Make a Donation
            </h2>
            <p className="text-lg md:text-xl">
              Follow these simple steps to support a life-changing project.
            </p>
          </div>

          <div className="grid gap-12 max-w-5xl mx-auto animate-fade-in-up">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={loginStep}
                alt="Login"
                className="w-32 h-32 object-contain"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Sign up or login to your account.
                </h3>
                <p className="text-md text-[#555]">
                  Create your donor account or sign in to access personalized
                  features and donation history.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-6">
              <img
                src={browseStep}
                alt="Browse"
                className="w-32 h-32 object-contain"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Browse the campaign that speaks to your heart.
                </h3>
                <p className="text-md text-[#555]">
                  Explore various campaigns and choose the one that aligns with
                  your cause.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={donateStep}
                alt="Donate"
                className="w-32 h-32 object-contain"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Choose an amount and securely donate.
                </h3>
                <p className="text-md text-[#555]">
                  Select a donation amount and proceed with our secure checkout
                  process.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-6">
              <img
                src={journeyStep}
                alt="Track"
                className="w-32 h-32 object-contain"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Track your impact in Your Journey section.
                </h3>
                <p className="text-md text-[#555]">
                  See how your contributions are making a difference through
                  live progress updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
