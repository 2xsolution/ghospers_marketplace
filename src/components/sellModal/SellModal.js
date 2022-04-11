import React, { Component, useEffect, useState } from "react";
import Modal from "react-modal";
// import { BASEURL } from "../../../utils/Utils";
import "./sellModal.css";

Modal.setAppElement("#root");

function SellModal({ setShowModal, showModal }) {
  console.log(showModal);
  function closeModal() {
    setShowModal(false);
  }

  const [currency, setCurrency] = useState("");
  const [price, setPrice] = useState("");
  const [currencyArray, setCurrencyArray] = useState([]);

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
              type="text"
              value={price}
              name="type"
              onChange={(e) => setPrice(e.target.value)}
              className="mint-input"
              placeholder="Hair"
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
                margin: "auto",
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
          <button>Sell</button>
        </div>
      </Modal>
    </div>
  );
}

export default SellModal;
