import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import axios from "axios";
import stripeLogo from "../assets/stripe-logo.png";

export default function Donation({ campaign }) {
  const { id } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [stripeKey, setStripeKey] = useState(0);
  const [zip, setZip] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [campaignData, setCampaignData] = useState(campaign || null);
  const [loading, setLoading] = useState(false);
  const [donationResult, setDonationResult] = useState("");

  useEffect(() => {
    if (!campaign) {
      axios
        .get("http://192.168.1.75:8000/api/campaigns")
        .then((res) => {
          const found = res.data.find((c) => c._id === id);
          if (!found) return navigate("/homepage");
          setCampaignData(found);
        })
        .catch(() => navigate("/homepage"));
    }
  }, [id]);

  const handleDonate = async (e) => {
    e.preventDefault();
    setMessage("");
    setDonationResult("");
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const cardElement = elements.getElement(CardNumberElement);
    const expiryElement = elements.getElement(CardExpiryElement);
    const cvcElement = elements.getElement(CardCvcElement);

    if (
      !user?.id ||
      !amount ||
      amount <= 0 ||
      !cardElement ||
      !expiryElement ||
      !cvcElement
    ) {
      setLoading(false);
      setMessage("❌ Please fill out all fields with valid information.");
      return;
    }

    try {
      const { token } = await stripe.createToken(cardElement);
      if (!token?.id) throw new Error("Invalid card details");

      await axios.post("http://192.168.1.75:8000/api/donations/create", {
        userId: user.id,
        campaignId: campaignData._id,
        amount,
        token,
      });

      setDonationResult("success");
      setMessage("✅ Donation successful! Thank you.");
      setAmount("");
      setZip("");
      setStripeKey((prev) => prev + 1);
    } catch (err) {
      setDonationResult("error");
      setMessage("❌ Donation failed. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setDonationResult("");
      }, 3000);
    }
  };

  if (!campaignData) return null;

  return (
    <>
      <Navigation />
      <div className="min-h-[calc(100vh-200px)] bg-[#f9f9f9] flex flex-col relative">
        <div className="flex flex-col lg:flex-row px-6 lg:px-20 py-12 gap-10">
          {/* Left: Campaign Details */}
          <div className="lg:w-1/2">
            <img
              src={`/campaigns/${campaignData.image}`}
              alt={campaignData.title}
              className="rounded-xl mb-6 shadow-md w-full h-64 object-cover"
            />
            <h2 className="text-3xl font-bold text-[#023e8a] mb-2">
              {campaignData.title}
            </h2>
            <p className="text-[#0077b6] font-medium mb-4">
              {campaignData.subtitle}
            </p>
            <p className="text-gray-700 mb-4">{campaignData.description}</p>
            <p className="text-sm text-gray-600 mb-4">
              📍 <strong>Location:</strong> {campaignData.location}
            </p>

            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3 relative">
                <div
                  className="bg-gradient-to-r from-[#00b4d8] to-[#0077b6] h-3 rounded-full"
                  style={{ width: `${campaignData.progress}%` }}
                />
                <span className="absolute right-2 top-[-1.5rem] text-xs font-semibold text-gray-500">
                  {campaignData.progress}% funded
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                💰 Raised: ${campaignData.raisedAmount} / $
                {campaignData.goalAmount}
              </p>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <p>🙋‍♂️ Donors: {campaignData.donorCount}</p>
                <p>⏳ Days Left: {campaignData.daysLeft}</p>
              </div>
            </div>
          </div>

          {/* Right: Donation Form */}
          <div className="lg:w-1/2 bg-white shadow-md rounded-xl p-6 relative">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
              Make a Donation
            </h3>

            <form onSubmit={handleDonate} className="space-y-4">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Donation amount in USD"
                min="1"
                className="w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] text-lg shadow-sm"
              />

              <div key={stripeKey}>
                <CardNumberElement className="w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] text-lg shadow-sm" />
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <CardExpiryElement className="w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] text-lg shadow-sm" />
                  <CardCvcElement className="w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] text-lg shadow-sm" />
                </div>
              </div>

              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="ZIP / Postal Code"
                className="w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] text-lg shadow-sm"
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#0096c7] hover:to-[#005f8d] text-white py-2 rounded-xl font-semibold text-lg tracking-wide transition-all duration-300 shadow-lg"
              >
                Donate Now
              </button>
            </form>

            {message && (
              <p className="mt-4 text-center text-sm text-gray-700">
                {message}
              </p>
            )}

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">Powered by</p>
              <img src={stripeLogo} alt="Stripe" className="h-6 mx-auto mt-1" />
            </div>
            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-gray-400/60 flex items-center justify-center z-20 rounded-xl">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-white"></div>
              </div>
            )}

            {/* Success Overlay */}
            {donationResult === "success" && (
              <div className="absolute inset-0 bg-gray-400/60 flex items-center justify-center z-20 rounded-xl">
                <div className="text-center">
                  <div className="text-green-400 text-5xl mb-2">✔</div>
                  <p className="text-white text-lg">Donation Successful!</p>
                </div>
              </div>
            )}

            {/* Error Overlay */}
            {donationResult === "error" && (
              <div className="absolute inset-0 bg-gray-400/60 flex items-center justify-center z-20 rounded-xl">
                <div className="text-center">
                  <div className="text-red-400 text-5xl mb-2">✖</div>
                  <p className="text-white text-lg">
                    Donation Failed. Try again.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
