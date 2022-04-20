import React, { Component, useEffect, useState } from "react";
import Modal from "react-modal";
// import { BASEURL } from "../../../utils/Utils";
import "./sellModal.css";

Modal.setAppElement("#root");

function SellModal({
  oldCurrency,
  oldPrice,
  oldQuantity,
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
      if (oldCurrency.toLowerCase() === "ghs") {
        setCurrency("");
      } else setCurrency(oldCurrency);
    } else {
      setShowModal(currency, price, quantity);
    }
  }

  const [currency, setCurrency] = useState(oldCurrency);
  const [price, setPrice] = useState(oldPrice);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (oldCurrency) {
      if (oldCurrency.toLowerCase() === "ghs") {
        setCurrency("");
      } else setCurrency(oldCurrency);
    }
    setPrice(oldPrice);
    setQuantity(oldQuantity);
  }, [oldCurrency, oldPrice, oldQuantity]);

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
              <i className="fa-solid fa-xmark"></i>
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
              <option value="ghsp">GHSP</option>
              <option value="bnb">BNB</option>
              <option value="busd">BUSD</option>
            </select>
          </div>

          {oldQuantity > 1 && <div className="qty-div">
            <label htmlFor="" style={{ color: "white" }}>
              Quantity
            </label>
            <div className="qty-div-content">
              <button style={{ margin: "auto" }} 
              disabled={quantity === 1}
              onClick={()=> {
                if(quantity>1){
                  setQuantity(prev=> prev-1)
              }
              }}>-</button>
              <input
                value={quantity}
                max={oldQuantity}
                min="1"
                onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
                onChange={(e) => {
                  if (e.target.value < 1) {
                    setQuantity(1);
                  } else if (e.target.value > oldQuantity) {
                    setQuantity(oldQuantity);
                  } else setQuantity(e.target.value);
                }}
                type="number"
                className="mint-input"
                placeholder="Quantity"
                readOnly
              />
              
              <button disabled={quantity >= oldQuantity} style={{ margin: "auto" }}
              onClick={()=> {
                if(quantity < oldQuantity){
                  setQuantity(prev=> prev+1)
              }
              }}>
                +
              </button>
            </div>
          </div>}

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
