import React, { useEffect, useState } from "react";
import "./mint.css";
import { FileUploader } from "react-drag-drop-files";
import IPFSUtils from "./IPFSUtils";
import axios from "axios";
import { BASEURL, Error, Success } from "../../utils/Utils";

import {
  loadWeb3,
  connectWallet,
  createNFT,
  getCurrentWallet,
} from "../../core/web3";
import Header from "../../components/Header";
import AddPropertyModal from "./addPropertyModal.js/AddPropertyModal";
import LoaderModal from "./LoaderModal";
import { NotificationManager } from "react-notifications";

function Mint({ setShowModal }) {
  const fileTypes = ["JPEG", "PNG", "GIF", "JPG"];

  const handleChange = (file) => {
    setImage(file);
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tokenId, setTokenId] = useState("xyz");
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ipfs, setIpfs] = useState("test");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("ghsp");
  const [image, setImage] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [level, setLevel] = useState("");
  const [properties, setProperties] = useState(null);
  // const [traitsArray, setTraitsArray] = useState([
  //   "tank",
  //   "marksman",
  //   "assassin",
  // ]);

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

  const saveNft = async (e) => {
    // console.log(properties);
    // return;
    setIsLoading(true);
    // NotificationManager.info("Please wait for a minutes.");
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
              // console.log(res);
              if (res && res.tokenId && res.wallet) {
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

                // console.log(...formData);

                axios
                  .post(BASEURL + "/nft/save", formData)
                  .then((response) => {
                    // console.log(response);
                    setCurrency("ghsp");
                    setTitle("");
                    setDescription("");
                    setPrice("");
                    setSelectedType(null);
                    setImage("");
                    setProperties(null);
                    setLevel("");
                    setIsLoading(false);
                    NotificationManager.success("Nft Created Successfully");
                    // window.location.reload();
                  })
                  .catch((e) => {
                    // console.log(e.response.data.message);
                    NotificationManager.error("Error Writing to DB");
                    NotificationManager.error(e.response.data.message);
                    // console.log(e);
                    setIsLoading(false);
                    // window.location.reload();
                  });
              } else {
                setIsLoading(false);
                NotificationManager.error("Not Created Token ID from contract");
              }
            });
          } catch (error) {
            setIsLoading(false);
            NotificationManager.error("Transaction Error");
          }
        });
      }
    });
  };

  const validateFields = () => {
    if (!title || !price || !level || !selectedType || !image) return false;
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
        {isLoading && <LoaderModal />}
        <div className="file-div">
          <p>PNG, GIF, WEBP, MP4 or MP3. Max 100mb.</p>
          <FileUploader
            multiple={false}
            handleChange={handleChange}
            name="nftImage"
            classes="drag-zone"
            types={fileTypes}
          />

          {image && (
            <>
              <p className="preview-text">Image Preview</p>
              <img
                className="preview-img"
                src={URL.createObjectURL(image)}
                alt=""
              />
            </>
          )}
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
                onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
                value={price}
                onChange={(e) => {
                  if (e.target.value < 0) {
                    setPrice(0);
                  } else if (e.target.value > 100000000) {
                    setPrice(100000000);
                  } else setPrice(e.target.value);
                }}
                type="number"
                min={0}
                max="10"
                className="mint-input"
                placeholder="0.0"
              />
              <select
                onChange={(e) => setCurrency(e.target.value)}
                value={currency}
              >
                <option value="ghsp">GHSP</option>
                <option value="bnb">BNB</option>
                <option value="busd">BUSD</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="">Level</label>
            <input
              value={level}
              max="20"
              min="0"
              onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
              onChange={(e) => {
                if (e.target.value < 0) {
                  setLevel(0);
                } else if (e.target.value > 20) {
                  setLevel(20);
                } else setLevel(e.target.value);
              }}
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
                      checked={selectedType === t}
                      onChange={() => {
                        if (selectedType === t) {
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
          <button onClick={saveNft} disabled={!validateFields()}>
            Create Item
          </button>
        </div>
        <AddPropertyModal
          setProperties={setProperties}
          properties={properties}
          showModal={showPropertyModal}
          setShowModal={setShowPropertyModal}
        />
      </div>
    </div>
  );
}

export default Mint;
