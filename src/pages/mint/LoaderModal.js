import React, { Component, useState } from "react";
import Modal from "react-modal";
import Loader from "../../components/loader/Loader";
Modal.setAppElement("#root");

function LoaderModal() {
  return (
    <div className="">
      <Modal isOpen={true} contentLabel="Example Modal">
        <div style={{ width: "400px", margin: "auto" }}>
          <h2 style={{ textAlign: "center", marginTop: "40px" }}>Loading.. </h2>
          <Loader />
        </div>
      </Modal>
    </div>
  );
}

export default LoaderModal;
