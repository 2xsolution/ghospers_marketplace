import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ConnectWallet from "./pages/ConnectWallet/ConnectWallet";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";
import NFTdetail from "./pages/NFTDetail/NFTdetail";
import "./App.css";
import Mint from "./pages/mint/Mint";
import Profile from "./pages/profile/Profile";
import { Toaster } from "react-hot-toast";
function App() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Routes>
        <Route path="/" exact element={<Home setShowModal={setShowModal} />} />
        <Route
          path="/trending/:nftId/tokenid/:tokenId"
          exact
          element={<NFTdetail setShowModal={setShowModal} />}
        />
        <Route
          path="/mint"
          exact
          element={<Mint setShowModal={setShowModal} />}
        />
        <Route
          path="/contact"
          exact
          element={<Contact setShowModal={setShowModal} />}
        />
        <Route
          path="/profile"
          exact
          element={<Profile setShowModal={setShowModal} />}
        />
      </Routes>
      <ConnectWallet showModal={showModal} setShowModal={setShowModal} />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </>
  );
}

export default App;
