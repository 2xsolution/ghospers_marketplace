import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/img/logo.6eaa2fdb.png";
import "./header.css";

import { loadWeb3, connectWallet, getCurrentWallet } from "../core/web3";

const Header = ({ setShowModal }) => {
  const [navActive, isnavActive] = useState(false);
  const [curWallet, setCurWallet] = useState("");

  const onConnectWallet = async () => {
    if (curWallet != "") {
      return;
    }
    await loadWeb3();
    let res = await connectWallet();
    setCurWallet(res.address);
  };

  const openModal = (e) => {
    console.log("hwllo");
    e.preventDefault();
    // setShowModal((prev) => !prev);

    onConnectWallet();
  };

  const getWallet = async () => {
    let res = await getCurrentWallet();
    if (res.success) {
      setCurWallet(res.account);
    }
  };

  useEffect(() => {
    getWallet();
  });

  return (
    <header>
      <div className="container">
        <Link to="/">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
        </Link>
        <div className={navActive ? "links nav-active" : "links"}>
          <ul className="navigations">
            <li>
              <Link to="https://ghospers.com/" activeclassname="active">
                Home
              </Link>
            </li>
            <li>
              <NavLink to="/" activeclassname="active">
                Market Place
              </NavLink>
            </li>
            <li>
              <Link to="https://staking.ghospers.com/" activeclassname="active">
                Staking
              </Link>
            </li>
            {/* <li>
							<NavLink to="/contact" activeclassname="active">
								Contact Us
							</NavLink>
						</li> */}
          </ul>
          <div className="nav-btn">
            <a href="/" onClick={openModal}>
              {curWallet == ""
                ? "Connect Wallet"
                : curWallet.slice(0, 5) + "..." + curWallet.slice(-4)}
            </a>
            <a href="/">Login</a>
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
