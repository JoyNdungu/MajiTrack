// src/App.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Dashboard from "./Dashboard.jsx";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import Form from "./Form.jsx";
import Reports from "./Reports.jsx";
import Tips from "./Tips.jsx";
import Settings from "./Settings.jsx";

const BACKEND_URL = "https://majitrack.onrender.com";

const App = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [token] = useState(localStorage.getItem("token") || null);

  const [readings, setReadings] = useState([]);
  const [loadingReadings, setLoadingReadings] = useState(true);

  // Fetch readings from backend
  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${BACKEND_URL}/api/readings`, { headers });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setReadings(data.readings || []);
      } catch (err) {
        console.error("Failed to fetch readings:", err);
      } finally {
        setLoadingReadings(false);
      }
    };
    fetchReadings();
  }, [token]);

  // Add a reading
  const addReading = async (newReading) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/readings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(newReading),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const savedReading = await res.json();
      setReadings([...readings, savedReading].sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch (err) {
      console.error("Failed to add reading:", err);
    }
  };

  // Delete a reading
  const deleteReading = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/readings/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setReadings(readings.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Failed to delete reading:", err);
    }
  };

  const pageTitle = () => {
    switch (currentPage) {
      case "dashboard": return "Dashboard";
      case "form": return "Add Reading";
      case "reports": return "Reports";
      case "tips": return "Tips";
      case "settings": return "Settings";
      default: return "MajiTrack";
    }
  };

  if (loadingReadings) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 dark:text-gray-200">
        Loading readings...
      </div>
    );
  }

  return (
    <div className={`flex flex-row min-h-screen relative transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-20 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 h-full w-64 z-30 md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <Sidebar
                currentPage={currentPage}
                setCurrentPage={(page) => {
                  setCurrentPage(page);
                  setSidebarOpen(false);
                }}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <div className="flex flex-col flex-1 z-10">
        <Navbar darkMode={darkMode} pageTitle={pageTitle()} openSidebar={() => setSidebarOpen(true)} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={currentPage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
            className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10"
          >
            <div className={`max-w-7xl mx-auto rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm transition-colors duration-300 ${darkMode ? "bg-gray-800/70 backdrop-blur-sm" : "bg-white"}`}>
              {currentPage === "dashboard" && <Dashboard readings={readings} setCurrentPage={setCurrentPage} darkMode={darkMode} />}
              {currentPage === "form" && <Form addReading={addReading} setCurrentPage={setCurrentPage} darkMode={darkMode} />}
              {currentPage === "reports" && <Reports readings={readings} deleteReading={deleteReading} darkMode={darkMode} />}
              {currentPage === "tips" && <Tips darkMode={darkMode} />}
              {currentPage === "settings" && <Settings darkMode={darkMode} setDarkMode={setDarkMode} />}
            </div>

            {/* Add Reading Button */}
            <div className="hidden sm:block fixed bottom-8 right-8 md:bottom-10 md:right-10 z-20">
              <button
                onClick={() => setCurrentPage("form")}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg transform transition-transform hover:-translate-y-1 active:scale-95 focus:outline-none ${darkMode ? "bg-blue-600 text-blue-200" : "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                +<span className="font-medium">Add Reading</span>
              </button>
            </div>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
