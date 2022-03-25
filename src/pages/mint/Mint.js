import React, { useState } from "react";
import "./mint.css";
import { FileUploader } from "react-drag-drop-files";
// import IPFSUtils from './IPFSUtils';
import axios from "axios";
import { BASEURL } from "../../utils/Utils";

import {
  createNFT,
} from "../../core/web3";

function Mint() {
  const fileTypes = ["JPEG", "PNG", "GIF"];
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const saveNft = async (e) => {

    createNFT("").then((tokenID) => {
      console.log('minted token ID : ', tokenID);

      var formData = new FormData();
      formData.append("tokenID", tokenID);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("nftImage", image);
      formData.append("walletAddress", "abcd");
      formData.append("type", "rare");
      formData.append("level", 50);
      formData.append("traits", "marksman");

      console.log(...formData);

      axios
        .post(BASEURL + "/nft/save", formData)
        .then((response) => {
          console.log(response);

        })
        .catch((e) => console.log(e));
    })

  };


  const mintNFT = async (event) => {

    // const tokenID = await createNFT("");
    // console.log('minted token ID : ', tokenID);
    // if (tokenID) {
    // 	setSampleNFTTokenID(tokenID);
    // 	updateTokenIds();
    // }
  }

  return (
    <div>
      <div className="mint-container">
        <div className="file-div">
          <p>PNG, GIF, WEBP, MP4 or MP3. Max 100mb.</p>
          <FileUploader
            multiple={true}
            handleChange={handleChange}
            name="file"
            classes="drag-zone"
            types={fileTypes}
          />
        </div>
        <div className="inputs-div">
          <div>
            <label htmlFor="">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              className="mint-input"
              placeholder="example: gaming art design"
            />
          </div>
          <div>
            <label htmlFor="">Description (Optional)</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              className="mint-input"
              placeholder="example: gaming art design"
            />
          </div>
          <div>
            <label htmlFor="">Price</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="text"
              className="mint-input"
              placeholder="0 BNB"
            />
          </div>
          <button onClick={saveNft}>Create Item</button>
        </div>
      </div>
    </div>
  );
}

export default Mint;
