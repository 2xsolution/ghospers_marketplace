import React, { Component, useEffect, useState } from "react";
import Modal from "react-modal";
// import { BASEURL } from "../../../utils/Utils";
import "./sellModal.css";

Modal.setAppElement("#root");

function SellModal({
  oldCurrency,
  oldPrice,
  setShowModal,
  showModal,
  setShowSellModal,
}) {
  // console.log(oldCurrency, oldPrice);
  function closeModal(e) {
    e.preventDefault();
    if (e.keyCode === 27) {
      setShowSellModal(false);
      setPrice(oldPrice);
      if (oldCurrency.toLowerCase() === "ghsp") {
        setCurrency("");
      } else setCurrency(oldCurrency);
    } else {
     setShowModal(currency, price);
    }
  }

  const [currency, setCurrency] = useState(oldCurrency);
  const [price, setPrice] = useState(oldPrice);

  useEffect(() => {
    if (oldCurrency) {
      if (oldCurrency.toLowerCase() === "ghsp") {
        setCurrency("");
      } else setCurrency(oldCurrency);
    }
    setPrice(oldPrice);
  }, [oldCurrency, oldPrice]);

  return (
    <div className="sell-modal">
      <Modal
        isOpen={showModal}
        // shouldCloseOnOverlayClick={false}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        // style={customStyles}
        // className="scrollable-modal"
        contentLabel="Example Modal"
      >
        <div className="properties-modal-content">
          <div className="sell-modal-flex">
            <h2>Sell </h2>
            <p
              onClick={() => {
                setShowSellModal(false);
                setPrice(oldPrice);
                if (oldCurrency.toLowerCase() === "ghsp") {
                  setCurrency("");
                } else setCurrency(oldCurrency);
              }}
            >
              <i class="fa-solid fa-xmark"></i>
            </p>
          </div>
          <div>
            <label htmlFor="" style={{ color: "white" }}>
              Price
            </label>
            <input
              type="number"
              value={price}
              name="type"
              onChange={(e) => setPrice(e.target.value)}
              className="mint-input"
              placeholder="Price"
            />
          </div>
          <div>
            <label
              htmlFor=""
              style={{ color: "white", display: "block", marginBottom: "8px" }}
            >
              Currency
            </label>
            <select
              style={{
                backgroundColor: "#41c6ff",
                width: "100%",
                margin: "10px auto 0",
              }}
              onChange={(e) => setCurrency(e.target.value)}
              value={currency}
            >
              <option value="">Select Currency</option>
              <option value="bnb">BNB</option>
              <option value="busd">BUSD</option>
            </select>
          </div>
          <button
            disabled={!price || !currency}
            onClick={(e) => {
              closeModal(e);
            }}
          >
            Sell
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default SellModal;
