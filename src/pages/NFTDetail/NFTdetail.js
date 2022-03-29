import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/Header";
import NFTimg from "../../assets/img/nftimg.png";
import coinIcon from "../../assets/img/coinicon.png";
import Icon from "../../assets/img/icon_stat.png";
import SwordIcon from "../../assets/img/sword.png";
import "./nftdetail.css";
import axios from "axios";
import { BASEURL } from "../../utils/Utils";
import {
  loadWeb3,
  connectWallet,
  buyNFTWithBNB,
  buyNFTWithBUSD,
  buyNFTWithGHSP,
} from "../../core/web3";

const NFTdetail = ({ setShowModal }) => {
  console.log(useParams());
  const [nftDetail, setNftDetail] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const initWeb3 = async () => {
      await loadWeb3();
      let addr = await connectWallet();
      setWalletAddress(addr.address);
    };

    initWeb3();
  }, []);

  const { nftId, tokenId } = useParams();
  console.log(nftId);
  console.log(tokenId);
  useEffect(() => {
    console.log(nftId);
    loadNftById(nftId);
  }, [nftId]);

  const loadNftById = async (id) => {
    axios
      .get(`${BASEURL}/nft/${id}`)
      .then((response) => {
        console.log("detail data", response.data.data);
        setNftDetail(response.data.data);
      })
      .catch((e) => console.log(e));
  };

  const buyNFT = async (event) => {
    event.preventDefault();

    if (tokenId) {
      const saleTokenType = 2; // GHSP, BUSD, BNB
      if (saleTokenType == 0) {
        await buyNFTWithGHSP(tokenId);
      } else if (saleTokenType == 1) {
        await buyNFTWithBUSD(tokenId);
      } else {
        await buyNFTWithBNB(tokenId, 0.01);
      }
    }
  };

  return (
    <>
      <Header setShowModal={setShowModal} />
      <section className="nft">
        <div className="container">
          <div className="home-btn">
            <Link to="/">Back to home</Link>
          </div>
          <div className="nft-detail-container">
            <div className="nft-img">
              <img
                src={nftDetail && `${BASEURL}/uploads/${nftDetail.imageUrl}`}
                alt="nft_image"
              />
            </div>
            <div className="nft-detail">
              <div className="nft-titles">
                <div className="title">
                  <h1>{nftDetail && nftDetail.title} </h1>
                  <p>{nftDetail && nftDetail.description} </p>
                </div>
                <div className="title-right">
                  <div className="head">
                    <p>HERD</p>
                    <span>Rarity</span>
                  </div>
                </div>
              </div>
              <p className="view-owner"> View Owner</p>
              {/* <div className="select-fields">
                <select>
                  <option selected="" value="0">
                    View Owner
                  </option>
                  <option value="1">No Wrapper</option>
                  <option value="2">No JS</option>
                  <option value="3">Nice!</option>
                </select>
              </div> */}
              <div className="nft-data">
                <ul className="tags">
                  <li>
                    <a href="/" className="active-tag">
                      P2E Info
                    </a>
                  </li>
                  <li>
                    <a href="/">Stats</a>
                  </li>
                  <li>
                    <a href="/">Fury</a>
                  </li>
                  <li>
                    <a href="/">Passive</a>
                  </li>
                </ul>

                <div className="nft-reward">
                  <div className="icon">
                    <img src={coinIcon} alt="coinIcon" />
                  </div>
                  <div className="rewards">
                    <p>Basic Battle Rewards:</p>
                    <div className="reward-data">
                      <div className="reward">
                        <span>Win:</span>
                        <span>+6</span>
                      </div>
                      <div className="reward">
                        <span>Draw:</span>
                        <span>+2</span>
                      </div>
                      <div className="reward">
                        <span>Lose:</span>
                        <span>+1</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="nft-stats">
                  <div className="stat">
                    <img src={Icon} alt="icon" />
                    <p>Win Bonus</p>
                  </div>
                  <p>6.695</p>
                </div>
                <div className="nft-stats">
                  <div className="stat">
                    <img src={SwordIcon} alt="icon" />
                    <p>gTHC Battles</p>
                  </div>
                  <p>70/394</p>
                </div>
                <div className="nft-stats">
                  <div className="stat">
                    <img src={SwordIcon} alt="icon" />
                    <p>Daily gTHC Battles</p>
                  </div>
                  <p>10</p>
                </div>
              </div>
              <div className="nft-price">
                <h1>1,800 {nftDetail?.currency?.toUpperCase()}</h1>
                <p>{nftDetail && nftDetail.price} USD</p>
              </div>
              <div className="buy-btn">
                <a href="/" onClick={buyNFT}>
                  BUY NOW
                </a>
              </div>
              {nftDetail && walletAddress == nftDetail.walletAddress && (
                <div className="buy-btn">
                  <a href="/" onClick={buyNFT}>
                    SELL
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NFTdetail;
