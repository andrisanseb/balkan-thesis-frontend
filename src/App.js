import "./App.css";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
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
  const location = useLocation();
  // const showNav = location.pathname !== "/";
  // const showBack = location.pathname !== "/";
  const currentUser = AuthService.getCurrentUser();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const [destinations, setDestinations] = useState([]);


  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch("http://localhost:4000/destinations");
      const data = await response.json();
      setDestinations(data);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };


  //ConsumerAPI
  // const [pois, setPois] = useState([]);

  // useEffect(() => {
  //   fetchPois();
  // }, []);

  // const fetchPois = async () => {
  //   try {
  //     const response = await fetch('http://localhost:4000/api/pois');
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch POIs');
  //     }
  //     const data = await response.json();
  //     setPois(data);
  //   } catch (error) {
  //     console.error('Error fetching POIs:', error);
  //   }
  // };

  return (
    <>
      {/* <div>
      <h1>Points of Interest</h1>
      <ul>
        {pois.map(poi => (
          <li key={poi.xid}>{poi.name}</li>
        ))}
      </ul>
    </div> */}
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
