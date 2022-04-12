import React, { Component, useEffect, useState } from "react";
import Modal from "react-modal";
// import { BASEURL } from "../../../utils/Utils";
import "./sellModal.css";

Modal.setAppElement("#root");

function SellModal({ oldCurrency, oldPrice, setShowModal, showModal }) {
  console.log(oldCurrency, oldPrice);
  function closeModal() {
    setShowModal(currency, price);
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
        shouldCloseOnOverlayClick={false}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        // style={customStyles}
        // className="scrollable-modal"
        contentLabel="Example Modal"
      >
        <div className="properties-modal-content">
          <h2 style={{ marginBottom: "20px" }}>Sell </h2>
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
            <label htmlFor="" style={{ color: "white" }}>
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
              <option selected value="">
                Select Currency
              </option>
              <option value="bnb">BNB</option>
              <option value="busd">BUSD</option>
            </select>
          </div>
          <button
            disabled={!price || !currency}
            onClick={() => {
              closeModal();
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
