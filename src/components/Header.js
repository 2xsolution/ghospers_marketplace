import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/img/logo.6eaa2fdb.png";
import "./header.css";
import { NotificationManager } from "react-notifications";

import { loadWeb3, connectWallet, getCurrentWallet } from "../core/web3";
import axios from "axios";
import { BASEURL } from "../utils/Utils";

const Header = ({ setShowModal, setWalletAddress }) => {
  const [navActive, isnavActive] = useState(false);
  const [curWallet, setCurWallet] = useState("");

  const onConnectWallet = async () => {
    if (curWallet !== "") {
      return;
    }
    await loadWeb3();
    let res = await connectWallet();
    setCurWallet(res.address);
    // console.log(res.address);
    setWalletAddress(res.address);
  };

  const saveUser = (e) => {
    axios
      .post(BASEURL + "/user/save", {
        // walletAddress: curWallet,
        walletAddress: curWallet,
      })
      .then((response) => {
        // console.log(response);
        //NotificationManager.success("User Created Successfully");
      })
      .catch((e) => {
        if (e.response?.status !== 400) {
          if (e.response && e.response.data && e.response.message) {
            NotificationManager.error(e.response.data.message);
          }
        }
      });
  };

  useEffect(() => {
    if (curWallet) {
      saveUser();
    }
  }, [curWallet]);

  const openModal = (e) => {
    // console.log("hwllo");
    e.preventDefault();
    // setShowModal((prev) => !prev);

    onConnectWallet();
  };

  const getWallet = async () => {
    let res = await getCurrentWallet();
    if (res.success) {
      // console.log(res.account);
      setCurWallet(res.account);
      // setWalletAddress(res.account);
    }
  };

  useEffect(() => {
    getWallet();
  });

  return (
    <header className="app-header">
      <div className="container">
        <Link to="/">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
        </Link>
        <div className={navActive ? "links nav-active" : "links"}>
          <ul className="navigations">
            <li>
              <a
                target="_blank"
                href="https://ghospers.com/"
                activeclassname="active"
              >
                Home
              </a>
            </li>
            <li>
              <NavLink to="/" activeclassname="active">
                Marketplace
              </NavLink>
            </li>
            <li>
              <a
                target="_blank"
                href="https://staking.ghospers.com/"
                activeclassname="active"
              >
                Staking
              </a>
            </li>
            {/* <li>
							<NavLink to="/contact" activeclassname="active">
								Contact Us
							</NavLink>
						</li> */}
          </ul>
          <div className="nav-btn">
            <a onClick={openModal}>
              {curWallet === ""
                ? "Connect Wallet"
                : curWallet.slice(0, 5) + "..." + curWallet.slice(-4)}
            </a>

            {curWallet && <NavLink to="/profile">Profile</NavLink>}
          </div>
        </div>
        <div className="hamburger" onClick={() => isnavActive(!navActive)}>
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
