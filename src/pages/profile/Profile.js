import axios from "axios";
import React, { useState, useEffect } from "react";
import MultiRangeInput from "../../components/MultiRangeInput";
import { BASEURL } from "../../utils/Utils";
import LeftIcon from "../../assets/img/lefticon.png";
import RightIcon from "../../assets/img/righticon.png";
import { useNavigate, useParams } from "react-router-dom";
import "./profile.css";
import ProfileImg from "../../assets/img/card1.png";
import UpdateModal from "./updateModal/UpdateModal";
import Header from "../../components/Header";
import Loader from "../../components/loader/Loader";
import Accordian from "../../components/accordian/Accordian";
import LoaderModal from "../../components/loaderModal/LoaderModal";
import MultiRangeSlider from "multi-range-slider-react";
import UserImage from "../../assets/img/UserImage.png";
import {
  loadWeb3,
  connectWallet,
  putTokenOnSale,
  removeTokenFromSale,
  getCurrentWallet,
} from "../../core/web3";
import SellModal from "../../components/sellModal/SellModal";

function Profile() {
  const navigate = useNavigate();

  const [typeArray, setTypeArray] = useState([
    "common",
    "rare",
    "epic",
    "legendary",
  ]);

  const loadNfts = async (e) => {
    setIsLoading(true);

    axios
      .post(BASEURL + "/nft/all/", {
        min,
        max,
        page,
        size,
        walletAddress,
        currency,
        minlevel,
        maxlevel,
        type: selectedType,
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

  const [sidebar, setSidebar] = useState(false);
  const openSidebar = (e) => {
    // console.log("sidebar");
    e.preventDefault();
    setSidebar((prev) => !prev);
  };
  const onClickItem = async (tokenID) => {
    setSampleNFTTokenID(tokenID);
  };

  const clearAll = (e) => {
    e.preventDefault();
    setSelectedType(null);
    setMinlevel(0);
    setMax(null);
    setMin(null);
    setMaxlevel(20);
  };

  const [sampleNFTTokenID, setSampleNFTTokenID] = useState(null);
  const [tokenIds, setTokenIds] = useState([1, 2, 3, 5]);
  const [saleItems, setSaleItems] = useState([]);
  const [nftsArray, setNftsArray] = useState(null);
  const [currentNftIndex, setCurrentNftIndex] = useState(-1);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalRecords, setTotalRecords] = useState(null);
  const [min, setMin] = useState(null);
  const [minlevel, setMinlevel] = useState(0);
  const [maxlevel, setMaxlevel] = useState(20);
  const [currency, setCurrency] = useState("");
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [max, setMax] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletAddressUser, setWalletAddressUser] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [properties, setProperties] = useState(null);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [singleSelectedProperty, setSingleSelectedProperty] = useState(null);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [newPrice, setNewPrice] = useState("");
  const [newCurrency, setNewCurrency] = useState("");
  const [selectedNft, setSelectedNft] = useState(null);

  useEffect(() => {
    if (walletAddress) {
      loadNfts();
    }
    // updateTokenIds();
  }, [
    min,
    max,
    page,
    size,
    minlevel,
    currency,
    selectedType,
    maxlevel,
    walletAddress,
    selectedProperties,
  ]);

  useEffect(() => {
    const initWeb3 = async () => {
      await loadWeb3();
      let res = await connectWallet();
      setWalletAddressUser(res.address);
    };
    loadProperties();
    initWeb3();
  }, []);
  useEffect(() => {
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
      // console.log(selectedProperties);
    }
  }, [singleSelectedProperty]);

  var { address } = useParams();

  useEffect(() => {
    setIsLoading(true);
    if (address) {
      console.log("inside 000000000000000");
      setWalletAddress(address);
      setIsLoading(false);
    } else {
      console.log("else");

      const initWeb3 = async () => {
        await loadWeb3();
        let res = await connectWallet();
        setWalletAddress(res.address);
        setIsLoading(false);
      };
      initWeb3();
    }

    loadProperties();
    if (walletAddress) {
      loadUserDetails();
    }
  }, [walletAddress, address]);

  const onClickSellInDialog = (currency, price) => {
    setShowSellModal(false);

    sellNft(currentNftIndex, currency, price);
  };

  const loadUserDetails = () => {
    axios
      .post(BASEURL + "/user/get-user", {
        walletAddress,
      })
      .then((response) => {
        // console.log(response.data.data);
        setUserDetails(response.data.data);
      })
      .catch((e) => console.log(e));
  };
  const loadProperties = () => {
    axios
      .get(BASEURL + "/property/all")
      .then((response) => {
        setProperties(response.data.data);
      })
      .catch((e) => console.log(e));
  };

  const cancelNftFunction = async (e, nft, index) => {
    axios
      .put(`${BASEURL}/nft/cancel/${nft}`, {
        walletAddress,
      })
      .then((response) => {
        setNftsArray((prev) =>
          Object.values({
            ...prev,
            [index]: { ...prev[index], nftOnSale: false },
          })
        );
        setShowLoadingModal(false);
      })
      .catch((e) => {
        console.log(e);
        setShowLoadingModal(false);
      });
  };
  const sellNftFunction = async (nft, index, currency, price) => {
    axios
      .put(`${BASEURL}/nft/sell/${nft}`, {
        walletAddress,
        price,
        currency,
      })
      .then((response) => {
        // console.log(response);

        setNftsArray((prev) =>
          Object.values({
            ...prev,
            [index]: { ...prev[index], nftOnSale: true, price, currency },
          })
        );
        setShowLoadingModal(false);
      })
      .catch((e) => {
        console.log(e);
        setShowLoadingModal(false);
      });
  };

  const cancelNft = async (e, item, index) => {
    e.stopPropagation();
    const nftId = item._id;
    setShowLoadingModal(true);

    removeTokenFromSale(item.tokenId)
      .then((res) => {
        if (res === true) {
          cancelNftFunction(e, nftId, index);
        } else {
          setShowLoadingModal(false);
        }
      })
      .catch((err) => {
        setShowLoadingModal(false);
        console.log(err);
      });
  };

  const sellNft = async (index, currency, price) => {
    if (index < 0 || index >= nftsArray.length) {
      console.log("invalid nft index", index);
      return;
    }

    let item = nftsArray[index];

    setShowLoadingModal(true);

    let tokenType = 0;
    if (currency == "ghsp") {
      tokenType = 0;
    } else if (currency == "busd") {
      tokenType = 1;
    } else {
      tokenType = 2;
    }
    const nftId = item._id;
    putTokenOnSale(item.tokenId, price, tokenType)
      .then((res) => {
        if (res === true) {
          sellNftFunction(nftId, index, currency, price);
        } else {
          setShowLoadingModal(false);
        }
      })
      .catch((err) => {
        setShowLoadingModal(false);
        console.log(err);
      });
  };

  const openSellModal = (index) => {
    setShowSellModal(true);
    setSelectedNft(nftsArray[index]);
  };

  return (
    <div>
      <Header
        setShowModal={setShowModal}
        setWalletAddress={setWalletAddressUser}
      />
      <div className="profile-content">
        {showLoadingModal && <LoaderModal />}

        <div className="profile-back-filter">
          <button
            className="custom-btn back-btn"
            onClick={() => {
              navigate("/");
            }}
          >
            Back to home
          </button>
          <div className="fitermob profile-filters">
            <a className="filter-btn" onClick={openSidebar}>
              Filters
            </a>
          </div>
        </div>
        {walletAddress ? (
          <div className="profile-flex">
            {userDetails && userDetails.facebook ? (
              <div className="profile-div">
                <div className="red-div">
                  <img
                    src={
                      userDetails ? `${userDetails.imageUrl}` : `${UserImage}`
                    }
                    alt=""
                  />
                </div>
                {walletAddressUser &&
                walletAddressUser === userDetails?.walletAddress ? (
                  <button
                    className="custom-btn"
                    onClick={() => setShowModal(true)}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <p></p>
                )}
                <h2>{userDetails && userDetails.name}</h2>
                <p>{userDetails && userDetails.walletAddress}</p>{" "}
                <div className="profile-about">
                  <p>About me</p>
                  <p>{userDetails && userDetails.introduction}</p>
                  <div className="profile-social">
                    <a
                      target="_blank"
                      href={userDetails && userDetails.facebook}
                    >
                      <div className="white-round-div">
                        <i className="fa-brands fa-facebook-f"></i>
                      </div>
                    </a>
                    <a
                      target="_blank"
                      href={userDetails && userDetails.instagram}
                    >
                      <div className="white-round-div">
                        <i className="fa-brands fa-instagram"></i>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overlay-blue">
                <div>
                  <h3>Profile is not updated</h3>
                  {walletAddressUser &&
                  walletAddressUser === userDetails?.walletAddress ? (
                    <button
                      className="custom-btn"
                      onClick={() => setShowModal(true)}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <p></p>
                  )}
                </div>
              </div>
            )}

            <div
              className="profile-nft-div"
              style={{ marginLeft: "60px", width: "100%" }}
            >
              <div className="nft-collections">
                {isLoading ? (
                  <Loader />
                ) : (
                  nftsArray &&
                  nftsArray.map((elem, i) => {
                    return (
                      <div
                        className="card"
                        key={i}
                        onClick={() => {
                          onClickItem(i);
                          navigate(
                            `/trending/${elem._id}/tokenid/${elem.tokenId}`
                          );
                        }}
                      >
                        <div className="card-img">
                          <img src={`${elem.imageUrl}`} alt="Card1" />
                        </div>
                        <div className="card-title">
                          <h4>
                          {elem.title} ({elem.quantity ? elem.quantity : 1})
                            {Number(sampleNFTTokenID) === Number(i) ? (
                              <span>&#10003;</span>
                            ) : (
                              ""
                            )}{" "}
                            {saleItems[i] && saleItems[i].onSale === true
                              ? "OnSale"
                              : ""}
                          </h4>
                          {/* <span>{elem.description}</span> */}
                          {walletAddressUser &&
                          walletAddressUser.toLowerCase() ===
                            elem?.walletAddress?.toLowerCase() ? (
                            <button
                              className="custom-btn"
                              onClick={(e) => {
                                e.stopPropagation();

                                setCurrentNftIndex(i);

                                if (elem.nftOnSale) {
                                  // cancelNftFunction(e, e, elem, i);
                                  cancelNft(e, elem, i);
                                } else {
                                  // sellNftFunction(e, elem, i);
                                  // sellNft(e, elem, i);
                                  openSellModal(i);
                                }
                              }}
                            >
                              {elem.nftOnSale ? "CANCEL" : "SELL"}
                            </button>
                          ) : (
                            <button
                              className="custom-btn"
                              onClick={() =>
                                navigate(
                                  `/trending/${elem._id}/tokenid/${elem.tokenId}`
                                )
                              }
                            >
                              OPEN
                            </button>
                          )}
                          {/* <button
                            className="custom-btn"
                            onClick={(e) => {
                              if (elem.nftOnSale) {
                                cancelNft(elem);
                              } else {
                                sellNft(elem);
                              }
                            }}
                          >
                            {elem.nftOnSale ? "CANCEL" : "SELL"}
                          </button> */}
                        </div>
                        <div className="card-price">
                          {/* <div>
                  <span>gTHC</span>
                  <p>21/219</p>
                </div> */}
                          <div>
                            <span>Price</span>
                            <p>
                              {elem.price}&nbsp;{elem.currency?.toUpperCase()}
                            </p>
                            {/* <small>${elem.price} USD</small> */}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                {nftsArray && nftsArray.length > 0 && !isLoading ? (
                  <div className="pagination-wrap">
                    <div className="pagination">
                      <div
                        className="icon"
                        onClick={() => {
                          if (page != 1) {
                            setPage(page - 1);
                            window.scrollTo(0, 0);
                          }
                        }}
                      >
                        <a>
                          <img src={LeftIcon} alt="" />
                        </a>
                      </div>
                      <div className="number">
                        <span>
                          {page * size > totalRecords
                            ? totalRecords
                            : size * page}
                        </span>
                        of {totalRecords && totalRecords}
                      </div>
                      <div
                        className="icon"
                        onClick={() => {
                          if (page * size < totalRecords) {
                            setPage(page + 1);
                            window.scrollTo(0, 0);
                          }
                        }}
                      >
                        <a>
                          <img src={RightIcon} alt="" />
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  !isLoading && (
                    <div
                      style={{
                        width: "100%",
                        marginTop: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <h2>No Data Found!</h2>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className={sidebar ? "sidebar sidebar-active" : "sidebar"}>
              <div className="filter">
                <h4>FILTERS</h4>
                <a onClick={clearAll}>CLEAR ALL</a>
              </div>
              {/* <div className="hero">
                <h4>GHOSPERS</h4>
                <p>No Ghosper selected</p>
                <a onClick={loadNfts}>Choose Ghospers</a>
              </div> */}
              <div className="hero">
                <h4>GHOSPERS</h4>
                <div className="checkbox">
                  {typeArray.map((t) => {
                    return (
                      <label key={t} className="checkbox-wrap">
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
              <div className="hero">
                <h4>PRICE</h4>
                <div className="price">
                  <div className="price-inpt">
                    <input
                      type="number"
                      onKeyDown={(evt) =>
                        evt.key === "e" && evt.preventDefault()
                      }
                      onChange={(e) => {
                        if (e.target.value < 0) {
                          setMin(0);
                        } else if (e.target.value > 100000000) {
                          setMin(100000000);
                        } else setMin(e.target.value);
                      }}
                      placeholder="Min"
                    />
                  </div>
                  <span></span>
                  <div className="price-inpt">
                    <input
                      placeholder="Max"
                      type="number"
                      onKeyDown={(evt) =>
                        evt.key === "e" && evt.preventDefault()
                      }
                      onChange={(e) => {
                        if (e.target.value < 0) {
                          setMax(0);
                        } else if (e.target.value > 100000000) {
                          setMax(100000000);
                        } else setMax(e.target.value);
                      }}
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
                    <option value="">Select Currency</option>
                    <option value="ghsp">GHSP</option>
                    <option value="bnb">BNB</option>
                    <option value="busd">BUSD</option>
                  </select>
                </div>
              </div>
              <div className="hero">
                <h4>LEVEL</h4>
                <div className="custom-range-div">
                  <MultiRangeSlider
                    min={0}
                    max={20}
                    ruler={false}
                    step={1}
                    label={true}
                    preventWheel={false}
                    minValue={minlevel}
                    maxValue={maxlevel}
                    onInput={(e) => {
                      setMaxlevel(e.maxValue);
                      setMinlevel(e.minValue);
                    }}
                  />
                </div>
              </div>
              {properties &&
                properties.map((data, index) => {
                  return (
                    <div className="hero" key={index}>
                      <Accordian
                        setSingleSelectedProperty={setSingleSelectedProperty}
                        title={data.type}
                        content={data.values}
                      />
                    </div>
                  );
                })}
              {/* <div className="hero skin">
              <h4>SKINS</h4>
              <p>No skin selected</p>
              <a href="/">Choose Skin</a>
            </div> */}
            </div>
          </div>
        ) : (
          !isLoading && (
            <h2 style={{ textAlign: "center", marginTop: "40px" }}>
              You are not registered with Ghospers
            </h2>
          )
        )}
        {userDetails && (
          <UpdateModal
            setUserDetails={setUserDetails}
            userDetails={userDetails}
            walletAddress={walletAddress}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        )}

        {userDetails && (
          <SellModal
            oldCurrency={selectedNft && selectedNft.currency}
            oldPrice={selectedNft && selectedNft.price}
            showModal={showSellModal}
            setShowModal={onClickSellInDialog}
            setShowSellModal={setShowSellModal}
          />
        )}
      </div>
    </div>
  );
}

export default Profile;
