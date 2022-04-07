import React, { useRef, useEffect, useCallback } from "react";
import metamask from "../../assets/img/metamask.png";
import coinbase from "../../assets/img/coinbase.png";
import walletconnect from "../../assets/img/walletconnect.png";
import "./connectwallet.css";
import { Link } from "react-router-dom";

const ConnectWallet = ({ showModal, setShowModal }) => {
  const modalRef = useRef();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
        console.log("I pressed");
      }
    },
    [setShowModal, showModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);
  return (
    <>
      {showModal ? (
        <div className="wallet-container" onClick={closeModal} ref={modalRef}>
          <div className="wallet-wrap">
            <h1>Connect Wallet</h1>
            <p>Select What network and Wallet Your want to Connect below</p>
            <div className="wallets">
              <h1>Choose Wallet</h1>
              <div className="wallet-opt">
                <div className="wallet active">
                  <img src={metamask} alt="metamask" />
                  <h1>MetaMask</h1>
                </div>
                <div className="wallet">
                  <img src={coinbase} alt="coinbase" />
                  <h1>Coinbase</h1>
                </div>
                <div className="wallet">
                  <img src={walletconnect} alt="walletconnect" />
                  <h1>WalletConnect</h1>
                </div>
              </div>
            </div>
            <div className="wallets">
              <p>
                Accept <Link to="/"> Terms of Service</Link> and
                <Link to="/"> Privacy Policy</Link>
              </p>
            </div>
            <label className="checkbox-wrap">
              <input type="checkbox" />
              <span className="checkmark"></span>I read and accept
            </label>
            <div
              className="close"
              onClick={() => {
                setShowModal(!showModal);
              }}
            >
              <div className="line1"></div>
              <div className="line2"></div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ConnectWallet;
