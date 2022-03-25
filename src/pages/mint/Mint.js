import React, { useState } from "react";
import "./mint.css";
import { FileUploader } from "react-drag-drop-files";
// import IPFSUtils from './IPFSUtils';
import axios from "axios";
import { BASEURL } from "../../utils/Utils";

import { createNFT } from "../../core/web3";

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
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [level, setLevel] = useState(null);
  const [traitsArray, setTraitsArray] = useState([
    "tank",
    "marksman",
    "assassin",
  ]);

  const [typeArray, setTypeArray] = useState([
    "common",
    "rare",
    "epic",
    "legendary",
  ]);

  const saveNft = async (e) => {
    var formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("nftImage", image);
    formData.append("walletAddress", null);
    formData.append("type", selectedType);
    formData.append("level", level);
    formData.append("traits", selectedTraits);

    createNFT("").then((tokenID) => {
      console.log("minted token ID : ", tokenID);

      console.log(...formData);

      axios
        .post(BASEURL + "/nft/save", formData)
        .then((response) => {
          console.log(response);
        })
        .catch((e) => console.log(e));
    });
  };

  const validateFields = () => {
    if (
      !title ||
      !description ||
      !price ||
      !level ||
      !selectedType ||
      !selectedTraits.length > 0
    )
      return false;
    return true;
  };

  const mintNFT = async (event) => {
    // const tokenID = await createNFT("");
    // console.log('minted token ID : ', tokenID);
    // if (tokenID) {
    // 	setSampleNFTTokenID(tokenID);
    // 	updateTokenIds();
    // }
  };

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
          <div>
            <label htmlFor="">Level</label>
            <input
              value={level}
              max={100}
              min={0}
              onChange={(e) => setLevel(e.target.value)}
              type="number"
              className="mint-input"
              placeholder="0 BNB"
            />
          </div>
          <div className="checkbox">
            <label htmlFor="">Type</label>
            <div className="mint-types">
              {typeArray.map((t) => {
                return (
                  <label key={t} className="checkbox-wrap mint-wrap">
                    <input
                      type="checkbox"
                      checked={selectedType == t}
                      onChange={() => {
                        if (selectedType == t) {
                          setSelectedType(null);
                        } else setSelectedType(t);
                      }}
                    />
                    <span className="checkmark"></span>
                    {t}
                  </label>
                );
              })}
            </div>
          </div>
          <div className="checkbox">
            <label htmlFor="">Traits</label>
            <div className="mint-types">
              {traitsArray &&
                traitsArray.map((trait) => {
                  return (
                    <label className="checkbox-wrap  mint-wrap">
                      <input
                        type="checkbox"
                        checked={
                          selectedTraits && selectedTraits.includes(trait)
                        }
                        onChange={() => {
                          if (
                            selectedTraits &&
                            selectedTraits.includes(trait)
                          ) {
                            var remaningTraits =
                              selectedTraits &&
                              selectedTraits.filter((t) => t !== trait);
                            setSelectedTraits(remaningTraits);
                          } else {
                            setSelectedTraits((prev) => [...prev, trait]);
                          }
                        }}
                      />
                      <span className="checkmark"></span>
                      {trait}
                    </label>
                  );
                })}
            </div>
          </div>
          <button onClick={saveNft} disabled={!validateFields()}>
            Create Item
          </button>
        </div>
      </div>
    </div>
  );
}

export default Mint;
