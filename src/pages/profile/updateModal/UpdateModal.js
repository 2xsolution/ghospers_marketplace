import axios from "axios";
import React, { Component, useState } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { BASEURL } from "../../../utils/Utils";
import "./updateModal.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

function UpdateModal({ setShowModal, showModal }) {
  function closeModal() {
    setShowModal(false);
  }

  const [name, setName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [walletAddress, setWalletAddress] = useState("xyz");

  const validateFields = () => {
    if (!name || !introduction || !facebook || !instagram || !walletAddress)
      return false;
    return true;
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    axios
      .put(BASEURL + "/user/update", {
        name,
        introduction,
        facebook,
        instagram,
        walletAddress,
      })
      .then((response) => {
        console.log(response);
        setFacebook("");
        setInstagram("");
        setName("");
        setIntroduction("");
        closeModal();
      })
      .catch((e) => console.log(e));
  };

  return (
    <div>
      <Modal
        isOpen={showModal}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        // style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="update-modal-content">
          <h2>Update Profile</h2>
          <div className="inputs-div">
            <div>
              <label htmlFor="">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="mint-input"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="inputs-div">
            <div>
              <label htmlFor="">Introduction</label>
              <input
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                type="text"
                className="mint-input"
                placeholder="Introduction"
              />
            </div>
          </div>
          <div className="inputs-div">
            <div>
              <label htmlFor="">Facebook Link</label>
              <input
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                type="text"
                className="mint-input"
                placeholder="facebook.com/username"
              />
            </div>
          </div>
          <div className="inputs-div">
            <div>
              <label htmlFor="">Instagram Link</label>
              <input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                type="text"
                className="mint-input"
                placeholder="instagram.com/username"
              />
            </div>
          </div>
          <button disabled={!validateFields()} onClick={updateProfile}>
            Update Profile
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default UpdateModal;
