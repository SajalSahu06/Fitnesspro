import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase credentials directly in the code
const supabaseUrl = "https://nplllqyjcujfzkjvhxzr.supabase.co"; // Replace with your Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbGxscXlqY3VqZnpranZoeHpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAwNTgxMDMsImV4cCI6MjA0NTYzNDEwM30.d1m93U2Buv604epNCmtRHplztFILMRXSF-WEXGbto1E"; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

const KeyGeneratorPopup = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState(""); // Store the email entered by the user

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const generateKey = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch user IP
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      if (!ipResponse.ok) {
        throw new Error("Failed to fetch IP address");
      }
      const ipData = await ipResponse.json();
      const userIp = ipData.ip;
  
      console.log("User IP:", userIp);
  
      if (!email) {
        setError("Email is required.");
        setLoading(false);
        return;
      }
  
      // Check if the combination of IP and email already has a generated key
      const { data: existingKeys, error: fetchError } = await supabase
        .from("keys")
        .select("*")
        .eq("ip_address", userIp)
        .eq("email", email);
  
      if (fetchError) {
        console.error("Error fetching keys:", fetchError);
        throw fetchError;
      }
  
      if (existingKeys.length > 0) {
        alert("You have already created a key with this IP and email.");
        setGeneratedKey(existingKeys[0].generated_key); // Display the existing key
        return;
      }
  
      // Create a unique input string using IP, email, and timestamp
      const data = `${userIp}-${email}-${Date.now()}-${Math.random()}`;
  
      // Generate a SHA-256 hash of the data
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      
      // Convert the hash to a hexadecimal string
      const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
      
      // Use the first 16 characters of the hash as the key
      const key = hashHex.substring(0, 16);
  
      console.log("Generated Key:", key);
  
      // Store the new key in Supabase
      const { error: dbError } = await supabase.from("keys").insert([
        { ip_address: userIp, email: email, generated_key: key },
      ]);
  
      if (dbError) {
        console.error("Database error:", dbError);
        throw dbError;
      }
  
      // Update state with the new key
      setGeneratedKey(key);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to generate and store the key. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex items-start justify-center">
      <button
        onClick={togglePopup}
        className="px-4 py-2 items-start text-white bg-blue-600 rounded-md shadow hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <span className="mr-4">🔑</span>
        <span className="text-sm font-medium">Get Key</span>
      </button>

      {isPopupOpen && (
        <>
          {/* Popup */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Generate Key</h3>

              {/* Email Input */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4"
                placeholder="Enter your email"
                required
              />

              <button
                onClick={generateKey}
                disabled={loading}
                className={`w-full px-4 py-2 text-white bg-green-600 rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mb-4 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Generating..." : "Generate Key"}
              </button>

              {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

              <textarea
                value={generatedKey}
                readOnly
                rows="4"
                className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                placeholder="Your generated key will appear here..."
              />
              <button
                onClick={togglePopup}
                className="w-full mt-4 px-4 py-2 text-white bg-red-600 rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>

          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={togglePopup}
          ></div>
        </>
      )}
    </div>
  );
};

export default KeyGeneratorPopup;
