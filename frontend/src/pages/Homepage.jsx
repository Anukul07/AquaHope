import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function Homepage() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/campaigns/");
        setCampaigns(res.data);
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <>
      <Navigation />
      <div className="bg-[#f9f9f9] min-h-screen py-12 px-4 sm:px-8 md:px-16">
        <h1 className="text-4xl font-extrabold text-center mb-14 ">
          Ongoing Water Campaigns in Africa
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
          {campaigns.map((camp) => (
            <div
              key={camp._id}
              className="bg-white shadow-md hover:shadow-xl transition duration-300 rounded-2xl overflow-hidden flex flex-col border border-gray-200"
            >
              <div className="overflow-hidden h-56">
                <img
                  src={`/campaigns/${camp.image}`}
                  alt={camp.title}
                  loading="lazy"
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="p-6 flex flex-col justify-between flex-grow">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center mb-1">
                    <h2 className="text-xl font-semibold text-[#023e8a]">
                      {camp.title}
                    </h2>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        camp.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : camp.status === "upcoming"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {camp.status}
                    </span>
                  </div>

                  {camp.subtitle && (
                    <p className="text-sm text-[#0077b6] font-medium">
                      {camp.subtitle}
                    </p>
                  )}

                  <p className="text-gray-600 text-sm mb-1 line-clamp-3">
                    {camp.description}
                  </p>

                  <p className="text-sm text-gray-500">
                    📍 <strong>Location:</strong> {camp.location}
                  </p>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-3 relative">
                    <div
                      className="bg-gradient-to-r from-[#00b4d8] to-[#0077b6] h-3 rounded-full transition-all duration-500"
                      style={{ width: `${camp.progress}%` }}
                    />
                    <span className="absolute right-2 top-[-1.5rem] text-xs font-semibold text-gray-500">
                      {camp.progress}% funded
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">
                    💰 Raised: ${camp.raisedAmount} / ${camp.goalAmount}
                  </p>

                  <div className="flex justify-between text-sm text-gray-500">
                    <p>🙋‍♂️ Donors: {camp.donorCount}</p>
                    <p>⏳ Days Left: {camp.daysLeft}</p>
                  </div>
                </div>

                <button
                  className="mt-6 bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#0077b6] hover:to-[#005f8d] text-white py-2 px-4 rounded-full text-sm font-medium transition duration-300 shadow-md"
                  onClick={() => console.log("Donate to", camp._id)}
                >
                  Donate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
