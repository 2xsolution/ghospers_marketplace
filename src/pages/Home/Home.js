import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import MultiRangeInput from "../../components/MultiRangeInput";
import Card1 from "../../assets/img/card1.png";
import Card2 from "../../assets/img/card2.png";
import LeftIcon from "../../assets/img/lefticon.png";
import RightIcon from "../../assets/img/righticon.png";
import axios from "axios";
import "./home.css";
import { useNavigate } from "react-router-dom";

import {
  loadWeb3,
  connectWallet,
  createNFT,
  buyNFTWithBNB,
  buyNFTWithBUSD,
  buyNFTWithGHSP,
  putTokenOnSale,
  getTokenIds,
  getSaleItems,
} from "../../core/web3";
import { BASEURL } from "../../utils/Utils";
import Loader from "../../components/loader/Loader";

const Home = ({ setShowModal }) => {
  const [sidebar, setSidebar] = useState(false);
  const openSidebar = (e) => {
    console.log("sidebar");
    e.preventDefault();
    setSidebar((prev) => !prev);
  };

  const navigate = useNavigate();

  const [typeArray, setTypeArray] = useState([
    "common",
    "rare",
    "epic",
    "legendary",
  ]);

  const [traitsArray, setTraitsArray] = useState([
    "tank",
    "marksman",
    "assassin",
  ]);

  const loadNfts = async (e) => {
    // e.preventDefault();
    setIsLoading(true);
    // var query = "?";
    // if (min) {
    //   query = `${query}min=${min}&`;
    // }
    // if (max) {
    //   query = `${query}max=${max}&`;
    // }
    // if (minlevel) {
    //   query = `${query}minlevel=${minlevel}&`;
    // }
    // if (maxlevel) {
    //   query = `${query}maxlevel=${maxlevel}&`;
    // }
    // if (selectedType) {
    //   query = `${query}type=${selectedType}&`;
    // }
    // console.log(selectedTraits);
    // if (selectedTraits && selectedTraits.length > 0) {
    //   query = `${query}traits=${selectedTraits}&`;
    // }

    // console.log(query);
    axios
      .post(BASEURL + "/nft/all/", {
        min,
        max,
        page,
        size,
        minlevel,
        maxlevel,
        type: selectedType,
        traits:
          selectedTraits && selectedTraits.length > 0 ? selectedTraits : null,
      })
      .then((response) => {
        console.log(response.data);
        setTotalRecords(response.data.data[1].totalRecords);
        setNftsArray(response.data.data[0]);
      })
      .catch((e) => console.log(e));
    setIsLoading(false);
  };

  const [sampleNFTTokenID, setSampleNFTTokenID] = useState(null);
  const [tokenIds, setTokenIds] = useState([1, 2, 3, 5]);
  const [saleItems, setSaleItems] = useState([]);
  const [nftsArray, setNftsArray] = useState(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [totalRecords, setTotalRecords] = useState(null);
  //   filters
  const [min, setMin] = useState(null);
  const [minlevel, setMinlevel] = useState(0);
  const [maxlevel, setMaxlevel] = useState(100);
  const [traits, setTraits] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [max, setMax] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const buyNFT = async (event) => {
    event.preventDefault();

    if (sampleNFTTokenID) {
      const saleTokenType = 2; // GHSP, BUSD, BNB
      if (saleTokenType == 0) {
        buyNFTWithGHSP(sampleNFTTokenID);
      } else if (saleTokenType == 1) {
        buyNFTWithBUSD(sampleNFTTokenID);
      } else {
        buyNFTWithBNB(sampleNFTTokenID, 0.1);
      }
    }
  };

  const sellNFT = async (event) => {
    event.preventDefault();

    console.log("selling token ID : ", sampleNFTTokenID);

    const saleTokenType = 2; // GHSP, BUSD, BNB

    if (sampleNFTTokenID) {
      putTokenOnSale(sampleNFTTokenID, 0.1, saleTokenType);
    }
  };

  const mintNFT = async (event) => {
    // event.preventDefault();
    // const tokenID = await createNFT("");
    // console.log('minted token ID : ', tokenID);
    // if (tokenID) {
    // 	setSampleNFTTokenID(tokenID);
    // 	updateTokenIds();
    // }
  };

  const updateTokenIds = async () => {
    let res = await getTokenIds();
    setTokenIds(res);
    console.log("======= getTokenIds ========== ", res);

    res = await getSaleItems(res);
    setSaleItems(res);
  };

  useEffect(() => {
    loadWeb3();
    connectWallet();

    // updateTokenIds();
  }, []);
  useEffect(() => {
    loadNfts();
    // updateTokenIds();
  }, [page]);

  const clearAll = (e) => {
    e.preventDefault();
    setSelectedTraits([]);
    setSelectedType(null);
    setMinlevel(0);
    setMax(null);
    setMin(null);
    setMaxlevel(100);
  };

  const onClickItem = async (tokenID) => {
    setSampleNFTTokenID(tokenID);
  };

  if (isLoading) return <Loader />;
  return (
    <>
      <Header setShowModal={setShowModal} />
      <section className="root">
        <div className="fitermob">
          <a href="/" className="filter-btn" onClick={openSidebar}>
            Filter
          </a>
        </div>
        <div className="container">
          <div className={sidebar ? "sidebar sidebar-active" : "sidebar"}>
            <div className="filter">
              <h4>FILTERS</h4>
              <a href="/" onClick={clearAll}>
                CLEAR ALL
              </a>
            </div>
            <div className="hero">
              <h4>GHOSPHERS</h4>
              <p>No Ghosper selected</p>
              <a onClick={loadNfts}>Choose Ghospers</a>
            </div>
            <div className="hero">
              <h4>GHOSPHERS</h4>
              <div className="checkbox">
                {typeArray.map((t) => {
                  return (
                    <label key={t} className="checkbox-wrap">
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
            <div className="hero">
              <h4>PRICE</h4>
              <div className="price">
                <div className="price-inpt">
                  <input
                    type="text"
                    placeholder="Min"
                    onChange={(e) => setMin(e.target.value)}
                  />
                </div>
                <span></span>
                <div className="price-inpt">
                  <input
                    type="text"
                    placeholder="Max"
                    onChange={(e) => setMax(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="hero">
              <h4>LEVEL</h4>
              <div className="levels">
                <MultiRangeInput
                  min={0}
                  max={100}
                  onChange={({ min, max }) => {
                    setMinlevel(min);
                    setMaxlevel(max);
                    console.log(`min = ${min}, max = ${max}`);
                  }}
                />
              </div>
            </div>
            <div className="hero">
              <h4>TRAITS</h4>
              <div className="checkbox">
                {traitsArray &&
                  traitsArray.map((trait) => {
                    return (
                      <label className="checkbox-wrap">
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
            {/* <div className="hero skin">
							<h4>SKINS</h4>
							<p>No skin selected</p>
							<a href="/">Choose Skin</a>
						</div> */}
          </div>
          <div style={{ marginLeft: "60px" }}>
            <div style={{ display: "flex", marginBottom: "20px" }}>
              {/* <div className="nav-btn">
                <a href="/" onClick={buyNFT}>
                  Buy
                </a>
              </div> */}
              <div className="nav-btn">
                <a href="/" onClick={sellNFT}>
                  Sell
                </a>
              </div>
              <div className="nav-btn">
                <a href="/mint" onClick={mintNFT}>
                  Mint
                </a>
              </div>
            </div>
            <div className="nft-collections">
              {nftsArray &&
                nftsArray.map((elem, i) => {
                  return (
                    <div
                      className="card"
                      key={i}
                      onClick={() => {
                        onClickItem(i);
                        navigate(`/trending/${elem._id}`);
                      }}
                    >
                      <div className="card-img">
                        <img
                          src={`${BASEURL}/uploads/${elem.imageUrl}`}
                          alt="Card1"
                        />
                      </div>
                      <div className="card-title">
                        <h4>
                          {elem.title}
                          {Number(sampleNFTTokenID) == Number(i) ? (
                            <span>&#10003;</span>
                          ) : (
                            ""
                          )}{" "}
                          {saleItems[i] && saleItems[i].onSale == true
                            ? "OnSale"
                            : ""}
                        </h4>
                        {/* <span>{elem.description}</span> */}
                        <button className="custom-btn">BUY</button>
                      </div>
                      <div className="card-price">
                        {/* <div>
                          <span>gTHC</span>
                          <p>21/219</p>
                        </div> */}
                        <div>
                          <span>Price</span>
                          <p>900 THC</p>
                          <small>${elem.price} USD</small>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {/* <div className="card">
								<div className="card-img">
									<img src={Card1} alt="Card1" />
								</div>
								<div className="card-title">
									<h4>CULIEN</h4>
									<span>The Baby</span>
								</div>
								<div className="card-price">
									<div>
										<span>gTHC</span>
										<p>21/219</p>
									</div>
									<div>
										<span>Price</span>
										<p>900 THC</p>
										<small>$19 USD</small>
									</div>
								</div>
							</div>
							<div className="card">
								<div className="card-img bg-blue">
									<img src={Card2} alt="Card2" />
								</div>
								<div className="card-title">
									<h4>Lorem ipsum sit</h4>
									<span>The Baby</span>
								</div>
								<div className="card-price">
									<div>
										<span>gTHC</span>
										<p>21/219</p>
									</div>
									<div>
										<span>Price</span>
										<p>900 THC</p>
										<small>$19 USD</small>
									</div>
								</div>
							</div>
							<div className="card">
								<div className="card-img bg-red">
									<img src={Card1} alt="Card3" />
								</div>
								<div className="card-title">
									<h4>Lorem ipsum sit</h4>
									<span>The Baby</span>
								</div>
								<div className="card-price">
									<div>
										<span>gTHC</span>
										<p>21/219</p>
									</div>
									<div>
										<span>Price</span>
										<p>900 THC</p>
										<small>$19 USD</small>
									</div>
								</div>
							</div>
							<div className="card">
								<div className="card-img bg-blue">
									<img src={Card2} alt="Card3" />
								</div>
								<div className="card-title">
									<h4>Lorem ipsum sit</h4>
									<span>The Baby</span>
								</div>
								<div className="card-price">
									<div>
										<span>gTHC</span>
										<p>21/219</p>
									</div>
									<div>
										<span>Price</span>
										<p>900 THC</p>
										<small>$19 USD</small>
									</div>
								</div>
							</div>
							<div className="card">
								<div className="card-img bg-red">
									<img src={Card1} alt="Card3" />
								</div>
								<div className="card-title">
									<h4>Lorem ipsum sit</h4>
									<span>The Baby</span>
								</div>
								<div className="card-price">
									<div>
										<span>gTHC</span>
										<p>21/219</p>
									</div>
									<div>
										<span>Price</span>
										<p>900 THC</p>
										<small>$19 USD</small>
									</div>
								</div>
							</div>
							<div className="card">
								<div className="card-img bg-blue">
									<img src={Card2} alt="Card3" />
								</div>
								<div className="card-title">
									<h4>Lorem ipsum sit</h4>
									<span>The Baby</span>
								</div>
								<div className="card-price">
									<div>
										<span>gTHC</span>
										<p>21/219</p>
									</div>
									<div>
										<span>Price</span>
										<p>900 THC</p>
										<small>$19 USD</small>
									</div>
								</div>
							</div> */}
              <div className="pagination-wrap">
                <div className="pagination">
                  <div
                    className="icon"
                    onClick={() => {
                      if (page != 1) {
                        setPage(page - 1);
                      }
                    }}
                  >
                    <a>
                      <img src={LeftIcon} alt="" />
                    </a>
                  </div>
                  <div className="number">
                    <span>
                      {page * size > totalRecords ? totalRecords : size}
                    </span>
                    of {totalRecords && totalRecords}
                  </div>
                  <div
                    className="icon"
                    onClick={() => {
                      if (page * size < totalRecords) {
                        console.log("inside");
                        setPage(page + 1);
                      }
                    }}
                  >
                    <a>
                      <img src={RightIcon} alt="" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
