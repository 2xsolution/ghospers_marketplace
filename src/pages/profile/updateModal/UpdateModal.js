import axios from "axios";
import React, { useState } from "react";
// import ReactDOM from "react-dom";
import Modal from "react-modal";
import { BASEURL } from "../../../utils/Utils";
import { FileUploader } from "react-drag-drop-files";
import { NotificationManager } from "react-notifications";

import "./updateModal.css";

// const customStyles = {
//   content: {
//     top: "50%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//   },
// };

Modal.setAppElement("#root");

function UpdateModal({
  setShowModal,
  showModal,
  walletAddress,
  userDetails,
  setUserDetails,
}) {
  function closeModal() {
    setShowModal(false);
  }
  console.log(userDetails);

  const fileTypes = ["JPEG", "PNG", "GIF", "JPG"];

  const handleChange = (file) => {
    setImage(file);
  };
  const [image, setImage] = useState("");

  const [name, setName] = useState(userDetails?.name);
  const [introduction, setIntroduction] = useState(userDetails?.introduction);
  const [facebook, setFacebook] = useState(userDetails?.facebook);
  const [instagram, setInstagram] = useState(userDetails?.instagram);
  // const [walletAddress] = useState("xyz");

  const validateFields = () => {
    if (!name || !introduction || !facebook || !instagram || !walletAddress)
      return false;
    return true;
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;
    var formData = new FormData();
    formData.append("name", name);
    formData.append("introduction", introduction);
    formData.append("facebook", facebook);
    formData.append("profileImage", image);
    formData.append("instagram", instagram);
    formData.append("walletAddress", walletAddress);

    axios
      .put(BASEURL + "/user/update", formData)
      .then((response) => {
        console.log(response.data.data);
        setUserDetails(response.data.data);
        // setUserDetails
        setFacebook("");
        setInstagram("");
        setName("");
        setImage("");
        setIntroduction("");
        NotificationManager.success("Profile Updated Successfully");

        closeModal();
      })
      .catch((e) => {
        NotificationManager.error("Something went wrong!");
        console.log(e);
      });
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
            <div className="file-div">
              <label htmlFor="">PNG, JPEG, JPG</label>
              <FileUploader
                multiple={false}
                handleChange={handleChange}
                name="profileImage"
                classes="drag-zone"
                types={fileTypes}
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
