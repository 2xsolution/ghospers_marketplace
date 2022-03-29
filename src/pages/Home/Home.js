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
import { Data } from "../../components/accordian/AccordianData";
import {
  loadWeb3,
  connectWallet,
  putTokenOnSale,
  getTokenIds,
  getSaleItems,
} from "../../core/web3";
import { BASEURL } from "../../utils/Utils";
import Loader from "../../components/loader/Loader";
import Accordian from "../../components/accordian/Accordian";

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
    console.log(selectedProperties);

    setIsLoading(true);

    axios
      .post(BASEURL + "/nft/all/", {
        min,
        max,
        page,
        size,
        minlevel,
        currency,
        properties: selectedProperties,
        maxlevel,
        type: selectedType,
        traits:
          selectedTraits && selectedTraits.length > 0 ? selectedTraits : null,
      })
      .then((response) => {
        setTotalRecords(response.data.data[1].totalRecords);
        setNftsArray(response.data.data[0]);

        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  const buyNft = async (e, nftId) => {
    e.stopPropagation();
    axios
      .put(`${BASEURL}/nft/${nftId}`, {
        walletAddress,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((e) => console.log(e));
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
  const [currency, setCurrency] = useState(null);
  const [walletAddress, setWalletAddress] = useState("xyz");
  const [properties, setProperties] = useState(null);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [singleSelectedProperty, setSingleSelectedProperty] = useState(null);

  useEffect(() => {
    console.log(singleSelectedProperty);
    if (
      singleSelectedProperty &&
      singleSelectedProperty.values &&
      singleSelectedProperty.type
    ) {
      var index = selectedProperties.findIndex(
        (x) => x.type === singleSelectedProperty.type
      );
      if (index !== -1) {
        setSelectedProperties((prev) =>
          Object.values({
            ...prev,
            [index]: {
              ...prev[index],
              values: [...singleSelectedProperty.values],
            },
          })
        );
      } else {
        setSelectedProperties((prev) => [...prev, singleSelectedProperty]);
      }
      console.log(selectedProperties);
    }
  }, [singleSelectedProperty]);

  const updateTokenIds = async () => {
    let res = await getTokenIds();
    setTokenIds(res);
    console.log("======= getTokenIds ========== ", res);

    res = await getSaleItems(res);
    setSaleItems(res);
  };

  const loadProperties = () => {
    axios
      .get(BASEURL + "/property/all")
      .then((response) => {
        console.log(response.data.data);
        setProperties(response.data.data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    const initWeb3 = async () => {
      await loadWeb3();
      let res = await connectWallet();
      setWalletAddress(res.address);
    };
    loadProperties();

    initWeb3();

    // updateTokenIds();
  }, []);

  const mintNFT = () => {
    console.log("mint nft called");
  };

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
    setCurrency(null);
    setMaxlevel(100);
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
              <h4>Currency</h4>
              <div className="levels">
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
            {properties &&
              properties.map((data) => {
                return (
                  <div className="hero">
                    <Accordian
                      setSingleSelectedProperty={setSingleSelectedProperty}
                      title={data.type}
                      content={data.values}
                    />
                  </div>
                );
              })}
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
                  traitsArray.map((trait, index) => {
                    return (
                      <label className="checkbox-wrap" key={index}>
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
                        navigate(
                          `/trending/${elem._id}/tokenid/${elem.tokenId}`
                        );
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
                          {elem.title}{" "}
                          {saleItems[i] && saleItems[i].onSale == true
                            ? "OnSale"
                            : ""}
                        </h4>
                        {/* <span>{elem.description}</span> */}
                        <button
                          className="custom-btn"
                          onClick={(e) =>
                            // navigate(
                            //   `/trending/${elem._id}/tokenid/${elem.tokenId}`
                            // )
                            {
                              buyNft(e, elem._id);
                            }
                          }
                        >
                          BUY
                        </button>
                      </div>
                      <div className="card-price">
                        {/* <div>
                          <span>gTHC</span>
                          <p>21/219</p>
                        </div> */}
                        <div>
                          <span>Price</span>
                          <p>900 {elem.currency?.toUpperCase()}</p>
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
                      {page * size > totalRecords ? totalRecords : size * page}
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
