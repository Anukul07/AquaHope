import React, { useState, useEffect, useRef } from "react";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  Target,
  Image,
  Calendar,
  MapPin,
  DollarSign,
  XCircle,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

export default function ViewCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const titleRef = useRef();
  const subtitleRef = useRef();
  const descRef = useRef();
  const goalRef = useRef();
  const locationRef = useRef();
  const startRef = useRef();
  const endRef = useRef();
  const imageFileRef = useRef();

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/api/campaigns");

      const campaignsWithDaysLeft = res.data.map((camp) => {
        const endDate = new Date(camp.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { ...camp, daysLeft: diffDays >= 0 ? diffDays : 0 };
      });
      setCampaigns(campaignsWithDaysLeft);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError(
        "Failed to load campaigns. Please check your network or server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this campaign? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      const token = localStorage.getItem("token");

      const response = await axiosInstance.delete(`/api/campaigns/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        fetchCampaigns();
      } else {
        throw new Error(response.data.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Error deleting campaign:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete campaign. Please try again."
      );
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", titleRef.current.value);
    formData.append("subtitle", subtitleRef.current.value);
    formData.append("description", descRef.current.value);
    formData.append("goalAmount", goalRef.current.value);
    formData.append("location", locationRef.current.value);
    formData.append("startDate", startRef.current.value);
    formData.append("endDate", endRef.current.value);

    if (imageFileRef.current.files[0]) {
      formData.append("image", imageFileRef.current.files[0]);
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (editing) {
        await axiosInstance.post(
          `/api/campaigns/update/${editing}`,
          formData,
          config
        );
      } else {
        await axiosInstance.post("/api/campaigns/add", formData, config);
      }

      setFormVisible(false);
      setEditing(null);
      setImagePreview(null);
      e.target.reset();
      fetchCampaigns();
    } catch (err) {
      console.error("Error saving campaign:", err);
      setError(
        err.response?.data?.message ||
          "Failed to save campaign. Please check all fields and try again."
      );
    }
  };

  const populateForm = (camp) => {
    setFormVisible(true);
    setEditing(camp._id);
    titleRef.current.value = camp.title;
    subtitleRef.current.value = camp.subtitle;
    descRef.current.value = camp.description;
    goalRef.current.value = camp.goalAmount;
    locationRef.current.value = camp.location;

    startRef.current.value = camp.startDate
      ? new Date(camp.startDate).toISOString().slice(0, 10)
      : "";
    endRef.current.value = camp.endDate
      ? new Date(camp.endDate).toISOString().slice(0, 10)
      : "";

    setImagePreview(camp.image ? `/campaigns/${camp.image}` : null);
    if (imageFileRef.current) {
      imageFileRef.current.value = "";
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const resetFormAndHide = () => {
    setFormVisible(false);
    setEditing(null);
    setImagePreview(null);
    if (titleRef.current) titleRef.current.value = "";
    if (subtitleRef.current) subtitleRef.current.value = "";
    if (descRef.current) descRef.current.value = "";
    if (goalRef.current) goalRef.current.value = "";
    if (locationRef.current) locationRef.current.value = "";
    if (startRef.current) startRef.current.value = "";
    if (endRef.current) endRef.current.value = "";
    if (imageFileRef.current) imageFileRef.current.value = "";
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 min-h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3 mb-4 sm:mb-0">
          <Target className="w-6 h-6 md:w-7 md:h-7 text-emerald-600" />{" "}
          Campaigns
        </h2>
        <button
          onClick={() => {
            if (formVisible) {
              resetFormAndHide();
            } else {
              setFormVisible(true);
              setEditing(null);
              setImagePreview(null);
            }
          }}
          className={`inline-flex items-center px-4 py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out text-sm md:text-base font-semibold
            ${
              formVisible
                ? "bg-gray-400 hover:bg-gray-500 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          {formVisible ? (
            <>
              <XCircle className="w-5 h-5 mr-2" /> Cancel
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5 mr-2" /> Add Campaign
            </>
          )}
        </button>
      </div>

      {formVisible && (
        <form
          onSubmit={handleFormSubmit}
          className="bg-gray-50 p-6 md:p-8 rounded-xl shadow-inner mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200"
        >
          <h3 className="text-xl font-semibold text-gray-800 col-span-full mb-4">
            {editing ? "Edit Campaign" : "Create New Campaign"}
          </h3>

          <input
            type="text"
            placeholder="Campaign Title"
            ref={titleRef}
            required
            className="input-field col-span-full"
          />
          <input
            type="text"
            placeholder="Campaign Subtitle"
            ref={subtitleRef}
            className="input-field col-span-full"
          />
          <textarea
            placeholder="Campaign Description"
            ref={descRef}
            required
            rows="4"
            className="input-field col-span-full resize-y"
          />
          <div className="relative flex items-center col-span-1">
            <DollarSign className="absolute left-3 text-gray-400 w-5 h-5" />
            <input
              type="number"
              placeholder="Goal Amount (USD)"
              ref={goalRef}
              required
              min="0"
              step="any"
              className="input-field pl-10 w-full"
            />
          </div>
          <div className="relative flex items-center col-span-1">
            <MapPin className="absolute left-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Location (e.g., Rural Africa)"
              ref={locationRef}
              required
              className="input-field pl-10 w-full"
            />
          </div>
          <div className="relative flex items-center col-span-1">
            <Calendar className="absolute left-3 text-gray-400 w-5 h-5" />
            <input
              type="date"
              ref={startRef}
              required
              className="input-field pl-10 w-full"
            />
          </div>
          <div className="relative flex items-center col-span-1">
            <Calendar className="absolute left-3 text-gray-400 w-5 h-5" />
            <input
              type="date"
              ref={endRef}
              required
              className="input-field pl-10 w-full"
            />
          </div>

          <div className="col-span-full flex flex-col md:flex-row items-center gap-4 mt-2">
            <label className="block text-gray-700 font-medium text-sm md:text-base flex items-center gap-2">
              <Image className="w-5 h-5" /> Campaign Image:
            </label>
            <input
              type="file"
              accept="image/*"
              ref={imageFileRef}
              onChange={handleImageChange}
              className="file-input flex-1"
            />
            {imagePreview && (
              <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
                <img
                  src={imagePreview}
                  alt="Campaign Preview"
                  className="w-24 h-24 object-cover rounded-lg shadow-md border border-gray-200"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="col-span-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 ease-in-out shadow-md font-semibold text-base md:text-lg transform hover:scale-105"
          >
            {editing ? "Update Campaign" : "Create Campaign"}
          </button>
        </form>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-600">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
          <p>Loading campaign data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 md:px-6 md:py-4 rounded-lg flex items-center gap-3 mb-6">
          <AlertCircle className="w-5 h-5 md:w-6 md:h-6" />
          <p className="font-medium text-sm md:text-base">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
          {campaigns.length > 0 ? (
            campaigns.map((camp) => (
              <div
                key={camp._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transform hover:scale-103 transition-transform duration-200 ease-in-out"
              >
                <img
                  src={
                    camp.image
                      ? `/campaigns/${camp.image}`
                      : "https://placehold.co/600x400/E0F2F7/000000?text=No+Image"
                  }
                  alt={camp.title}
                  className="w-full h-48 object-cover object-center"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/600x400/E0F2F7/000000?text=Image+Error";
                  }}
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {camp.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{camp.subtitle}</p>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                    {camp.description}
                  </p>{" "}
                  {/* Limit description lines */}
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (camp.raisedAmount / camp.goalAmount) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Raised:{" "}
                      <span className="font-semibold text-green-600">
                        $
                        {camp.raisedAmount
                          ? camp.raisedAmount.toLocaleString()
                          : 0}
                      </span>{" "}
                      / Goal:{" "}
                      <span className="font-semibold">
                        ${camp.goalAmount.toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" /> Location:{" "}
                    {camp.location}
                  </p>
                  <p className="text-xs text-gray-400 mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(camp.startDate).toLocaleDateString()} —{" "}
                    {new Date(camp.endDate).toLocaleDateString()}
                    {camp.daysLeft > 0 && ` (${camp.daysLeft} days left)`}
                    {camp.daysLeft <= 0 && (
                      <span className="text-red-500 font-medium ml-1">
                        (Ended)
                      </span>
                    )}
                  </p>
                  <div className="flex justify-end gap-3 mt-auto">
                    {" "}
                    {/* Push actions to bottom */}
                    <button
                      onClick={() => populateForm(camp)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                      title="Edit Campaign"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(camp._id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 md:py-12 text-gray-500 text-base md:text-xl">
              <div className="flex flex-col items-center justify-center">
                <Target className="w-10 h-10 md:w-12 md:h-12 text-gray-300 mb-3 md:mb-4" />
                <p>No campaigns found.</p>
                <p className="text-sm mt-2">
                  Click "Add Campaign" to create a new one.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
