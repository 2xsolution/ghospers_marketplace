import React from "react";
import Modal from "react-modal";
import Loader from "../../components/loader/Loader";
Modal.setAppElement("#root");

function LoaderModal() {
  return (
    <div className="">
      <Modal isOpen={true} contentLabel="Example Modal">
        <div style={{ width: "400px", margin: "auto" }}>
          <Loader />
        </div>
      </Modal>
    </div>
  );
}

export default LoaderModal;
