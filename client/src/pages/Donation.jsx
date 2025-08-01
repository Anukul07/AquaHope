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
import axiosInstance from "../utils/axiosInstance";
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
      axiosInstance
        .get("/api/campaigns")
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

    const tokenFromStorage = localStorage.getItem("token");
    const cardElement = elements.getElement(CardNumberElement);
    const expiryElement = elements.getElement(CardExpiryElement);
    const cvcElement = elements.getElement(CardCvcElement);

    if (
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

      await axiosInstance.post(
        "/api/donations/create",
        {
          campaignId: campaignData._id,
          amount,
          token,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenFromStorage}`,
          },
        }
      );

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
          {/* Right: Donation Form - Stripe Style */}
          <div className="lg:w-1/2 bg-white shadow-lg rounded-2xl p-8 relative border border-gray-100">
            {/* Stripe Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                <img src={stripeLogo} alt="Stripe" className="h-8" />
              </div>
              <h3 className="text-2xl font-medium text-gray-800 mb-1">
                Secure Donation
              </h3>
              <p className="text-sm text-gray-500">
                Your payment information is encrypted and secure
              </p>
            </div>

            <form onSubmit={handleDonate} className="space-y-6">
              {/* Amount Input - Stripe Style */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="1"
                    className="w-full pl-8 pr-4 py-4 text-lg font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  />
                </div>
              </div>

              {/* Card Information Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Card Information
                </label>

                <div key={stripeKey} className="space-y-3">
                  {/* Card Number */}
                  <div className="relative">
                    <CardNumberElement
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-base"
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#374151",
                            fontFamily:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            "::placeholder": {
                              color: "#9CA3AF",
                            },
                          },
                        },
                      }}
                    />
                  </div>

                  {/* Expiry and CVC */}
                  <div className="grid grid-cols-2 gap-3">
                    <CardExpiryElement
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-base"
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#374151",
                            fontFamily:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            "::placeholder": {
                              color: "#9CA3AF",
                            },
                          },
                        },
                      }}
                    />
                    <CardCvcElement
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-base"
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#374151",
                            fontFamily:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            "::placeholder": {
                              color: "#9CA3AF",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Billing Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Details
                </label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="ZIP / Postal Code"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-base"
                />
              </div>

              {/* Security Notice */}
              <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-blue-500 mt-0.5">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-xs text-blue-700">
                  <p className="font-medium">
                    Your payment is secured by Stripe
                  </p>
                  <p className="text-blue-600">
                    SSL encrypted and PCI DSS compliant
                  </p>
                </div>
              </div>

              {/* Donate Button - Stripe Style */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-lg font-semibold text-lg tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-md flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span>Donate Securely</span>
                  </>
                )}
              </button>
            </form>

            {/* Message Display */}
            {message && (
              <div
                className={`mt-4 p-3 rounded-lg text-center text-sm ${
                  donationResult === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : donationResult === "error"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-gray-50 text-gray-700 border border-gray-200"
                }`}
              >
                {message}
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>PCI Compliant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Bank-level security</span>
                </div>
              </div>
            </div>

            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600 font-medium">
                    Processing your donation...
                  </p>
                </div>
              </div>
            )}

            {/* Success Overlay */}
            {donationResult === "success" && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-green-500 text-2xl">✓</div>
                  </div>
                  <p className="text-gray-800 text-xl font-semibold mb-2">
                    Payment Successful!
                  </p>
                  <p className="text-gray-600">
                    Thank you for your generous donation
                  </p>
                </div>
              </div>
            )}

            {/* Error Overlay */}
            {donationResult === "error" && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-red-500 text-2xl">✕</div>
                  </div>
                  <p className="text-gray-800 text-xl font-semibold mb-2">
                    Payment Failed
                  </p>
                  <p className="text-gray-600">
                    Please check your card details and try again
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
