import React, { useEffect, useState } from "react";
import "./mint.css";
import { FileUploader } from "react-drag-drop-files";
import IPFSUtils from "./IPFSUtils";
import axios from "axios";
import { BASEURL } from "../../utils/Utils";

import {
  loadWeb3,
  connectWallet,
  createNFT,
  getCurrentWallet,
} from "../../core/web3";
import Header from "../../components/Header";
import AddPropertyModal from "./addPropertyModal.js/AddPropertyModal";

function Mint({ setShowModal }) {
  const fileTypes = ["JPEG", "PNG", "GIF", "JPG"];

  const handleChange = (file) => {
    setImage(file);
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tokenId, setTokenId] = useState("xyz");
  const [showPropertyModal, setShowPropertyModal] = useState(false);

  const [ipfs, setIpfs] = useState("test");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("ghsp");
  const [image, setImage] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [level, setLevel] = useState(null);
  const [properties, setProperties] = useState(null);
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

  useEffect(() => {
    const initWeb3 = async () => {
      await loadWeb3();
      await connectWallet();
    };

    initWeb3();
  }, []);

  // PRINCE CODE
  // const saveNft = async (e) => {
  //   console.log(properties);
  //   var formData = new FormData();
  //   formData.append("title", title);
  //   formData.append("description", description);
  //   formData.append("price", price);
  //   formData.append("nftImage", image);
  //   formData.append("currency", currency);
  //   formData.append("walletAddress", "TEST");
  //   formData.append("type", selectedType);
  //   formData.append("tokenId", "TEST");
  //   formData.append("ipfs", ipfs);
  //   formData.append("properties", JSON.stringify(properties));
  //   formData.append("level", level);
  //   formData.append("traits", selectedTraits);

  //   console.log(...formData);

  //   axios
  //     .post(BASEURL + "/nft/save", formData)
  //     .then((response) => {
  //       console.log(response);
  //       setCurrency("ghsp");
  //       setTitle("");
  //       setDescription("");
  //       setPrice("");
  //       setSelectedTraits([]);
  //       setSelectedType(null);
  //       setImage("");
  //       setLevel("");
  //     })
  //     .catch((e) => console.log(e));
  // };

  const saveNft = async (e) => {
    IPFSUtils.uploadFileToIPFS([image]).then((lists) => {
      if (lists.length > 0) {
        const content_uri1 = {
          name: title,
          symbol: title,
          image: lists[0],
          properties: {
            files: [{ uri: "image.png", type: "image/png" }],
            category: "image",
          },
        };

        IPFSUtils.uploadTextToIPFS(content_uri1).then((path) => {
          try {
            createNFT(path).then((res) => {
              console.log(
                "********** minted token id ***********",
                res?.tokenId
              );

              var formData = new FormData();
              formData.append("title", title);
              formData.append("description", description);
              formData.append("price", price);
              formData.append("nftImage", image);
              formData.append("currency", currency);
              formData.append("walletAddress", res.wallet);
              formData.append("type", selectedType);
              formData.append("tokenId", res.tokenId);
              formData.append("ipfs", ipfs);
              formData.append("properties", JSON.stringify(properties));
              formData.append("level", level);
              formData.append("traits", selectedTraits);

              console.log(...formData);

              axios
                .post(BASEURL + "/nft/save", formData)
                .then((response) => {
                  console.log(response);
                  setCurrency("ghsp");
                  setTitle("");
                  setDescription("");
                  setPrice("");
                  setSelectedTraits([]);
                  setSelectedType(null);
                  setImage("");
                  setLevel("");
                })
                .catch((e) => console.log(e));
            });
          } catch (error) {
            alert("error");
          }
        });
      }
    });
  };

  const validateFields = () => {
    if (
      !title ||
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
      <Header setShowModal={setShowModal} />
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
            <div className="price-flex">
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                className="mint-input"
                placeholder="0 BNB"
              />
              <select
                onChange={(e) => setCurrency(e.target.value)}
                value={currency}
              >
                <option selected value="ghsp">
                  GHSP
                </option>
                <option value="bnb">BNB</option>
                <option value="busd">BUSD</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="">Level</label>
            <input
              value={level}
              max={20}
              min={0}
              onChange={(e) => setLevel(e.target.value)}
              type="number"
              className="mint-input"
              placeholder="Level"
            />
          </div>
          <button onClick={() => setShowPropertyModal(true)}>
            Add Properties
          </button>
          <div className="checkbox">
            <label htmlFor="">Type</label>
            <div className="mint-types">
              {typeArray.map((t) => {
                return (
                  <label key={t} className="checkbox-wrap mint-wrap">
                    <input
                      type="checkbox"
                      checked={selectedType===t}
                      onChange={() => {
                        if (selectedType===t) {
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
        <AddPropertyModal
          setProperties={setProperties}
          showModal={showPropertyModal}
          setShowModal={setShowPropertyModal}
        />
      </div>
    </div>
  );
}

export default Mint;
