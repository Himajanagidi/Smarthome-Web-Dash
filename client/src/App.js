import React, { useEffect, useCallback, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import alanBtn from "@alan-ai/alan-sdk-web";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { devicesDetailsSlice, roomsDetailsSlice } from "./store";
import { request } from "./utilities";
import { apis_base_url } from "./configuration";

import Login from "./components/auth/Login";
import Dashboard from "./components/admin/dashboard";
import Game from "./components/Game";
// import WelcomingBox from "./components/WelcomingBox";
// import RoomsDetails from "./components/RoomsDetails";
// import MeasuringCard from "./components/MeasuringCard";
// import DeviceCard from "./components/DeviceCard";
// import WeatherChartCard from "./components/WeatherChartCard";
// import HistoryCard from "./components/HistoryCard";
import {
  WelcomingBox,
  RoomsDetails,
  MeasuringCard,
  DeviceCard,
  WeatherChartCard,
  HistoryCard,
} from "./components";
import { colors, devices } from "./data";

import "./App.css";

function App() {
  const dispatcher = useDispatch();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const updateHouseDetails = useCallback(() => {
    request({
      callback: ({ data: { devicesDetails, roomsDetails } }) => {
        dispatcher(
          devicesDetailsSlice.actions.changeStateDevices(devicesDetails)
        );
        dispatcher(roomsDetailsSlice.actions.changeStateRooms(roomsDetails));
      },
      method: "get",
      url: apis_base_url + "/house-details",
      title: "Getting house updates",
      withNotification: false,
    });
  }, [dispatcher]);

  useEffect(() => {
    updateHouseDetails();
    const ourInterval = setInterval(() => {
      setIsOnline(navigator.onLine);
      updateHouseDetails();
    }, 2000);
    return () => {
      clearInterval(ourInterval);
    };
  }, [updateHouseDetails]);

  useEffect(() => {
    alanBtn({
      key: "b2fc05de0e869de903cc7ca4968d80922e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand: (commandData) => {
        if (commandData.command === "go:back") {
          // Implement custom commands here
        }
      },
    });
  }, []);

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* Default Route for Login */}
        <Route path="/" element={<Login />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<Dashboard />} />

        {/* Users Section */}
        <Route
          path="/users"
          element={
            <div className="App" is-online={!isOnline ? "false" : "true"}>
              <section className="left-container">
                <WelcomingBox />
                <RoomsDetails />
                <MeasuringCard />
              </section>
              <section className="right-container">
                <div className="charts">
                  <HistoryCard />
                </div>
                <div className="devices">
                  {devices.map((device, index) => (
                    <DeviceCard
                      key={device}
                      device={device}
                      color1={colors.devices_colors[index].color1}
                      color2={colors.devices_colors[index].color2}
                    />
                  ))}
                </div>
              </section>
              <WeatherChartCard />
            </div>
          }
        />

        {/* Fallback for Unmatched Routes */}
      </Routes>
    </Router>
  );
}

export default App;

