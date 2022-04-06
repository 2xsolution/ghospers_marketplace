import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import NFTimg from "../../assets/img/nftimg.png";
import coinIcon from "../../assets/img/coinicon.png";
import Icon from "../../assets/img/icon_stat.png";
import Loader from "../../components/loader/Loader";
import SwordIcon from "../../assets/img/sword.png";
import "./nftdetail.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import axios from "axios";
import { BASEURL } from "../../utils/Utils";
import {
  loadWeb3,
  connectWallet,
  getCurrentWallet,
  buyNFTWithBNB,
  buyNFTWithBUSD,
  buyNFTWithGHSP,
  putTokenOnSale,
  removeTokenFromSale,
} from "../../core/web3";
import LoaderModal from "../../components/loaderModal/LoaderModal";

const NFTdetail = ({ setShowModal }) => {
  const [nftDetail, setNftDetail] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  useEffect(() => {
    const initWeb3 = async () => {
      await loadWeb3();
      let addr = await connectWallet();
      setWalletAddress(addr.address);
    };

    initWeb3();
  }, []);

  const { nftId, tokenId } = useParams();
  // console.log(nftId);
  // console.log(tokenId);
  useEffect(() => {
    // console.log(nftId);
    loadNftById(nftId);
  }, [nftId]);

  const loadNftById = async (id) => {
    setIsLoading(true);
    axios
      .get(`${BASEURL}/nft/${id}`)
      .then((response) => {
        // console.log("detail data", response.data.data);
        setNftDetail(response.data.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  };

  const changeOwner = async () => {
    setShowLoadingModal(true);
    // axios
    //   .put(`${BASEURL}/nft/${nftId}`, {
    //     walletAddress: "xyz",
    //   })
    //   .then((response) => {
    //     console.log("owner changed", response.data.data);
    //     setNftDetail(response.data.data);
    //     setIsLoading(false);
    //   })
    //   .catch((e) => {
    //     setIsLoading(false);
    //     console.log(e);
    //   });
    // return;
    let curWallet = await getCurrentWallet();
    if (!curWallet.success) {
      alert("No wallet");
      return;
    }

    setWalletAddress(curWallet.account);

    try {
      await buyNFT();
    } catch (error) {
      console.log("failed to buy nft", error);
      return;
    }

    let tmpWallet = curWallet.account;

    axios
      .put(`${BASEURL}/nft/${nftId}`, {
        walletAddress: tmpWallet,
      })
      .then((response) => {
        console.log("owner changed", response.data.data);
        setNftDetail(response.data.data);
        setShowLoadingModal(false);
      })
      .catch((e) => {
        console.log(e);
        setShowLoadingModal(false);
      });
  };

  const buyNFT = async () => {
    if (tokenId) {
      let tokenType = 0;
      if (nftDetail.currency == "ghsp") {
        tokenType = 0;
      } else if (nftDetail.currency == "busd") {
        tokenType = 1;
      } else {
        tokenType = 2;
      }

      if (tokenType === 0) {
        await buyNFTWithGHSP(tokenId, nftDetail.price);
      } else if (tokenType === 1) {
        await buyNFTWithBUSD(tokenId, nftDetail.price);
      } else {
        await buyNFTWithBNB(tokenId, nftDetail.price);
      }
    }
  };

  const cancelNft = async () => {
    removeTokenFromSale(tokenId);
  };

  const sellNft = async () => {
    let tokenType = 0;
    if (nftDetail.currency == "ghsp") {
      tokenType = 0;
    } else if (nftDetail.currency == "busd") {
      tokenType = 1;
    } else {
      tokenType = 2;
    }

    console.log("sellNft info", nftDetail);
    putTokenOnSale(tokenId, nftDetail.price, tokenType);
  };

  const navigate = useNavigate();

  return (
    <>
      <Header setShowModal={setShowModal} />
      {showLoadingModal && <LoaderModal />}
      {isLoading ? (
        <SkeletonTheme baseColor="#0d2733" highlightColor="#41c6ff">
          <div className="loader-flex">
            <div className="left-loader">
              <Skeleton width={365} height={375} />
            </div>
            <div className="right-loader">
              <Skeleton width={440} height={500} />
            </div>
          </div>
        </SkeletonTheme>
      ) : nftDetail ? (
        <section className="nft">
          <div className="container">
            <div className="home-btn">
              <Link to="/">Back to home</Link>
            </div>
            <div className="nft-detail-container">
              <div className="nft-img">
                <img
                  src={nftDetail && `${nftDetail.imageUrl}`}
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
                      <p>Rarity</p>
                      <span>{nftDetail?.type}</span>
                    </div>
                  </div>
                </div>

                {nftDetail?.walletAddress && (
                  <p
                    className="view-owner"
                    onClick={() =>
                      navigate("/profile/" + nftDetail.walletAddress)
                    }
                  >
                    {" "}
                    View Owner
                  </p>
                )}

                <div className="nft-data">
                  <ul className="tags">
                    <li>
                      <p
                        onClick={() => setSelectedTabIndex(0)}
                        className={
                          selectedTabIndex === 0 ? "active-tag" : "inactive-tag"
                        }
                      >
                        P2E Info
                      </p>
                    </li>
                    <li>
                      <p
                        onClick={() => setSelectedTabIndex(1)}
                        className={
                          selectedTabIndex === 1 ? "active-tag" : "inactive-tag"
                        }
                      >
                        Traits
                      </p>
                    </li>
                  </ul>

                  {/* <div className="nft-reward">
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
                </div> */}
                  {selectedTabIndex === 1 ? (
                    <div className="detail-card-flex">
                      {nftDetail &&
                        nftDetail.properties.map((property) => {
                          return (
                            <div className="detail-card">
                              <p className="type">{property.type}</p>
                              <p className="value">{property.value}</p>
                              <p className="percentage">
                                {(
                                  (property.valueTotal / property.typeTotal) *
                                  100
                                ).toFixed(1)}
                                % have this trait
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <>
                      <div className="nft-stats">
                        <div className="stat">
                          {/* <img src={Icon} alt="icon" /> */}
                          <p>Win Bonus</p>
                        </div>
                        <p>
                          {nftDetail &&
                            (nftDetail.type == "common"
                              ? "0.25"
                              : nftDetail.type == "rare"
                              ? "0.5"
                              : nftDetail.type == "epic"
                              ? "0.75"
                              : "1.0")}
                        </p>
                      </div>
                      <div className="nft-stats">
                        <div className="stat">
                          {/* <img src={SwordIcon} alt="icon" /> */}
                          <p>GHSP Battles</p>
                        </div>
                        <p>#/Infinite</p>
                      </div>
                      <div className="nft-stats">
                        <div className="stat">
                          {/* <img src={SwordIcon} alt="icon" /> */}
                          <p>Daily GHSP Battles</p>
                        </div>
                        <p>
                          {nftDetail &&
                            (nftDetail.type == "common"
                              ? "5"
                              : nftDetail.type == "rare"
                              ? "10"
                              : nftDetail.type == "epic"
                              ? "15"
                              : "20")}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="nft-price">
                  <h1>
                    {nftDetail && nftDetail.price}{" "}
                    {nftDetail?.currency?.toUpperCase()}
                  </h1>
                  {/* <p>{nftDetail && nftDetail.price} USD</p> */}
                </div>
                {nftDetail && walletAddress === nftDetail.walletAddress ? (
                  <div className="buy-btn">
                    <a
                      onClick={(e) => {
                        if (nftDetail.nftOnSale) {
                          cancelNft();
                        } else {
                          sellNft();
                        }
                      }}
                    >
                      {nftDetail.nftOnSale ? "CANCEL" : "SELL"}
                    </a>
                  </div>
                ) : (
                  <div className="buy-btn">
                    <a
                      // href="/"
                      // onClick={buyNFT}
                      onClick={changeOwner}
                    >
                      BUY NOW
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <h1 style={{ marginTop: "40px", textAlign: "center" }}>No NFT found</h1>
      )}
    </>
  );
};

export default NFTdetail;
