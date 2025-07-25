import "./App.css";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import React, { useState, useEffect } from "react";
import AuthService from "./services/AuthService";
import { NavBar } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Profile } from "./components/user/Profile";
import { GetStarted } from "./components/GetStarted";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import UserDetails from "./components/user/UserDetails";
import { Header } from "./components/Header";
import { Logo } from "./components/Logo";
import DestinationList from "./components/destination/DestinationList";
import DestinationDetails from "./components/destination/DestinationDetails";
import RoadTrip from "./components/roadTrip/RoadTrip";
import MapWithOpenStreetMapProvider from "./components/test/MapWithOpenStreetMapProvider";
import Assistant from "./components/Assistant";
import Review from "./components/Review";
import DaysOrganiser from "./components/roadTrip/DaysOrganiser";
import ActivitiesExplore from "./components/activities/ActivitiesExplore";

export default function App() {

  const API_URL = process.env.REACT_APP_API_URL;
  const currentUser = AuthService.getCurrentUser();
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      //const response = await fetch(API_URL+"/destinations");
      //console.log(response);
      const response = await fetch(API_URL+"/destinations", {
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
    });

      console.log(response);
      const data = await response.json();
      setDestinations(data);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  return (
    <>
      {
        <header>
          <NavBar />
        </header>
      }
      <main>
        <Assistant />
        <Routes>
          <Route path="" element={<GetStarted />} />
          <Route
            path="/login"
            element={
              currentUser ? <Navigate to="/my-profile" /> : <LoginForm />
            }
          />
          <Route
            path="/my-profile"
            element={currentUser ? <Profile /> : <GetStarted />}
          />
          <Route path="/logout" element={<Navigate to="/" />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route
            path="/explore/destinations"
            element={<DestinationList destinations={destinations} />}
          />
          <Route
            path="/explore/destinations/:id"
            element={<DestinationDetails />}
          />
          <Route
            path="/roadTrip"
            element={<RoadTrip destinations={destinations} />}
          />
          <Route
            path="/reviews"
            element={<Review destinations={destinations} />}
          />
          <Route path="/experiences" element={<ActivitiesExplore />} />
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
