import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [date, setDate] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState("");

  const fetchAllData = async () => {
    if (!date) {
      setError("Please select a valid date.");
      return;
    }

    setError("");
    setData({});

    try {
      const response = await axios.get("http://localhost:5001/on-this-day", {
        params: { date },
      });

      if (response.data) {
        setData(response.data);
      } else {
        setError("No data found for this date.");
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-indigo-100 via-white to-indigo-50 min-h-screen">
      {/* Top Bar */}
      <header className="flex justify-between items-center px-8 py-6 bg-white shadow">
        <div className="flex items-center space-x-4">
          <img
            src="https://tailwindcss.com/_next/static/media/tailwindcss-mark.d60e3f6a8f52eb1d4bba658c1ac2c48c.svg"
            alt="Tailwind Logo"
            className="w-8 h-8"
          />
          <span className="font-bold text-lg">Birthday Fun Facts</span>
        </div>
        <nav className="flex items-center space-x-6">
          <a href="#features" className="text-gray-600 hover:text-gray-900">
            Features
          </a>
          <a href="#about" className="text-gray-600 hover:text-gray-900">
            About
          </a>
          <a href="#contact" className="text-gray-600 hover:text-gray-900">
            Contact
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="px-8 pt-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-900">
            Discover Birthday Fun Facts
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Explore fascinating events, celebrity birthdays, and unique facts
            about your special day.
          </p>
          <div className="mt-8 space-x-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            />
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              onClick={fetchAllData}
            >
              Find Fun Facts
            </button>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        {/* Results Section */}
        {data.conception && (
          <div className="mt-16 max-w-3xl mx-auto text-left">
            <h2 className="text-2xl font-bold text-gray-800">Fun Facts</h2>
            <p className="mt-2">
              <strong>Conception Date:</strong> Most likely conceived around{" "}
              {data.conception}.
            </p>
            <p>
              <strong>Number of Babies Born:</strong> Approximately{" "}
              {data.babiesBorn} babies share your birthday globally.
            </p>
            <p>
              <strong>Days Since Birth:</strong> You have been alive for{" "}
              {data.daysSinceBirth} days!
            </p>
            <p>
              <strong>Age in Dog Years:</strong> You would be approximately{" "}
              {data.dogYears} years old in dog years!
            </p>
          </div>
        )}

        {data.celebrities && data.celebrities.length > 0 && (
          <div className="mt-8 max-w-3xl mx-auto text-left">
            <h2 className="text-2xl font-bold text-gray-800">
              Celebrity Birthdays
            </h2>
            <ul className="mt-2 list-disc list-inside">
              {data.celebrities.map((celebrity, index) => (
                <li key={index}>
                  <strong>{celebrity.year}:</strong> {celebrity.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.events && data.events.length > 0 && (
          <div className="mt-8 max-w-3xl mx-auto text-left">
            <h2 className="text-2xl font-bold text-gray-800">On This Day</h2>
            <ul className="mt-2 list-disc list-inside">
              {data.events.map((event, index) => (
                <li key={index}>
                  <strong>{event.year}:</strong> {event.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6 mt-16">
        <p>Birthday Fun Facts &copy; 2025</p>
      </footer>
    </div>
  );
};

export default App;
