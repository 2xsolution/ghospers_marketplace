import React, { useState } from "react";
import "./mint.css";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";
import { BASEURL } from "../../utils/Utils";
function Mint() {
  const fileTypes = ["JPEG", "PNG", "GIF"];
  const handleChange = (e) => {
    console.log(e);
    setImage(e);
  };

  const mintNFT = async (event) => {
    alert("bbww");
    // event.preventDefault();

    // const tokenID = await createNFT("");
    // console.log('minted token ID : ', tokenID);
    // if (tokenID) {
    // 	setSampleNFTTokenID(tokenID);
    // 	updateTokenIds();
    // }
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const saveNft = async (e) => {
    var formData = new FormData();
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
  };

  return (
    <div>
      <div className="mint-container">
        <div className="file-div">
          <p>PNG, GIF, WEBP, MP4 or MP3. Max 100mb.</p>
          <FileUploader
            multiple={false}
            handleChange={handleChange}
            name="nftImage"
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
              // value={}
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
