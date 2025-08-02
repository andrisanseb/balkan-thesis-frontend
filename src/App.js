import { Navigate, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.css";
import AuthService from "./services/AuthService";
import { NavBar } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Profile } from "./components/user/Profile";
import { GetStarted } from "./components/GetStarted";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import UserDetails from "./components/user/UserDetails";
import RoadTrip from "./components/roadTrip/RoadTrip";
import Assistant from "./components/Assistant";
import ActivitiesExplore from "./components/activities/ActivitiesExplore";

export default function App() {

  const API_URL = process.env.REACT_APP_API_URL;
  const currentUser = AuthService.getCurrentUser();
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const cachedDestinations = localStorage.getItem("destinations");
    const cacheTime = localStorage.getItem("destinations_cache_time");
    const now = Date.now();
    const cacheValid = cacheTime && now - cacheTime <  60 * 60 * 1000; // 1 hour

    if (cachedDestinations && cacheValid) {
      setDestinations(JSON.parse(cachedDestinations).data);
    } else {
      fetchDestinations();
    }

  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch(API_URL + "/destinations", {
        method: "GET",
        headers: { "Accept": "application/json" },
      });
      const data = await response.json();
      setDestinations(data.data);
      localStorage.setItem("destinations", JSON.stringify(data));
      localStorage.setItem("destinations_cache_time", Date.now());
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  return (
    <>
      {
        currentUser && (
          <header>
            <NavBar />
          </header>
        )
      }
      <main>
        <Assistant />
        <Routes>
          <Route path="/" element={<GetStarted />} />
          <Route path="/login" element={ currentUser ? <Navigate to="/my-profile" /> : <LoginForm /> } />
          <Route path="/my-profile" element={currentUser ? <Profile /> : <GetStarted />} />
          <Route path="/logout" element={<Navigate to="/" />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/roadTrip" element={<RoadTrip destinations={destinations} />} />
          <Route path="/experiences" element={<ActivitiesExplore destinations={destinations} />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
