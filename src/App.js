import "./App.css";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom";

import React, { useState, useEffect } from 'react';
import AuthService from "./services/AuthService";
import {NavBar} from "./components/Nav";
import {Footer} from "./components/Footer";
import {BackButton} from "./components/BackButton";
import {Profile} from "./components/user/Profile";
import {GetStarted} from "./components/GetStarted";
import {LoginForm} from "./components/auth/LoginForm";
import {RegisterForm} from "./components/auth/RegisterForm";
import UserDetails from "./components/user/UserDetails";
import {Header} from "./components/Header";
import {Logo} from "./components/Logo";
import {Home} from "./components/Home";
import DestinationList from "./components/destination/DestinationList";
import DestinationDetails from "./components/destination/DestinationDetails";
import PlanNewTrip from "./components/planNewTrip/PlanNewTrip";
import RoadTripOLD from "./components/planNewTrip/RoadTrip";
import RoadTripManual from "./components/planNewTrip/RoadTripManual";
import RoadTrip from "./components/roadTrip/RoadTrip";
import MapWithOpenStreetMapProvider from "./components/test/MapWithOpenStreetMapProvider";
import Assistant from "./components/Assistant"
import Review from "./components/Review";


export default function App() {
  const location = useLocation();
  const showNav = location.pathname !== "/";
  const showBack = location.pathname !== "/";
  const currentUser = AuthService.getCurrentUser();
  const navigate = useNavigate();
  const currentPath = location.pathname;


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
      {showNav && (
        <header>
          <NavBar />
        </header>
      )}
      {showBack && (
        <div className="logo-back-button-container">
          {/* <BackButton /> */}
          <Header currentPath={currentPath} />
          {/* <Logo /> */}
        </div>
      )}
      <main>
        <Assistant/>
        <Routes>
        <Route path="" element = {<Home />} />
        <Route path="/get-started" element = {<GetStarted/>} />
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
          <Route path="/explore/destinations" element={<DestinationList />} />
          <Route path="/explore/destinations/:id" element={<DestinationDetails />} />
          <Route path="/roadTrip" element={<RoadTrip />} />
          <Route path="/planNewTrip" element={<PlanNewTrip />} />
          <Route path="/planNewTrip/roadTrip" element={<RoadTripOLD />} />
          <Route path="/planNewTrip/roadTrip/create/manual" element={<RoadTripManual />} />
          <Route path="/reviews" element={<Review />} />
          <Route path="/test" element={<MapWithOpenStreetMapProvider />} />

        </Routes>
      </main>
      <footer><Footer /></footer>
    </>
  );
}
