import React, { Component, useState } from "react";
import Modal from "react-modal";
import { BASEURL } from "../../../utils/Utils";
import "./addPropertyModal.css";
Modal.setAppElement("#root");

function AddPropertyModal({ setShowModal, showModal, setProperties }) {
  console.log(showModal);
  function closeModal() {
    setShowModal(false);
  }

  const [rows, setRows] = useState([
    {
      type: "",
      value: "",
    },
  ]);

  const onChange = (e, index) => {
    setRows((prev) =>
      Object.values({
        ...prev,
        [index]: { ...prev[index], [e.target.name]: e.target.value },
      })
    );
  };

  const removeRow = (index) => {
    if (rows.length != 1) {
      var rowsTemp = [...rows];
      rowsTemp.splice(index, 1);
      setRows(rowsTemp);
    }
  };

  const AddRows = () => {
    setProperties(rows);
    setShowModal(false);
  };

  return (
    <div className="scrollable-modal">
      <Modal
        isOpen={showModal}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        // style={customStyles}
        // className="scrollable-modal"
        contentLabel="Example Modal"
      >
        <div className="properties-modal-content">
          <h2>Add Properties </h2>
          <div className="property-rows">
            {rows &&
              rows.map((row, index) => {
                return (
                  <div key={index} className="inputs-div">
                    <div>
                      <label htmlFor="">Type</label>
                      <input
                        type="text"
                        name="type"
                        onChange={(e) => onChange(e, index)}
                        className="mint-input"
                        placeholder="Hair"
                      />
                    </div>
                    <div>
                      <label htmlFor="">Value</label>
                      <input
                        type="text"
                        name="value"
                        onChange={(e) => onChange(e, index)}
                        className="mint-input"
                        placeholder="Blonde"
                      />
                    </div>
                    <button
                      onClick={() => removeRow(index)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
          </div>
          <button
            className="add-btn"
            onClick={() => {
              setRows((prev) => [
                ...prev,
                {
                  type: "",
                  value: "",
                },
              ]);
            }}
          >
            Add
          </button>

          <button onClick={AddRows}>Save</button>
        </div>
      </Modal>
    </div>
  );
}

export default AddPropertyModal;
