import axios from "axios";
import React, { useState, useEffect } from "react";
import MultiRangeInput from "../../components/MultiRangeInput";
import { BASEURL } from "../../utils/Utils";
import LeftIcon from "../../assets/img/lefticon.png";
import RightIcon from "../../assets/img/righticon.png";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import ProfileImg from "../../assets/img/card1.png";
import UpdateModal from "./updateModal/UpdateModal";
import Header from "../../components/Header";
import Loader from "../../components/loader/Loader";
import Accordian from "../../components/accordian/Accordian";
import {
  loadWeb3,
  connectWallet,
} from "../../core/web3";

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
        walletAddress,
        currency,
        minlevel,
        maxlevel,
        type: selectedType,
      })
      .then((response) => {
        console.log(response.data);
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
    console.log("sidebar");
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
    setMaxlevel(100);
  };

  const [sampleNFTTokenID, setSampleNFTTokenID] = useState(null);
  const [tokenIds, setTokenIds] = useState([1, 2, 3, 5]);
  const [saleItems, setSaleItems] = useState([]);
  const [nftsArray, setNftsArray] = useState(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalRecords, setTotalRecords] = useState(null);
  //   filters
  const [min, setMin] = useState(null);
  const [minlevel, setMinlevel] = useState(0);
  const [maxlevel, setMaxlevel] = useState(100);
  const [currency, setCurrency] = useState(null);

  const [selectedType, setSelectedType] = useState(null);
  const [max, setMax] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [properties, setProperties] = useState(null);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [singleSelectedProperty, setSingleSelectedProperty] = useState(null);

  useEffect(() => {
    loadNfts();
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

  useEffect(() => {
    const initWeb3 = async () => {
      await loadWeb3();
      let res = await connectWallet();
      setWalletAddress(res.address);
    };

    loadProperties();
    loadUserDetails();

    initWeb3();

  }, [walletAddress]);

  const loadUserDetails = () => {
    axios
      .post(BASEURL + "/user/get-user", {
        walletAddress,
      })
      .then((response) => {
        console.log(response.data.data);
        setUserDetails(response.data.data);
      })
      .catch((e) => console.log(e));
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

  const sellNft = async (e, nftId) => {
    e.stopPropagation();
    axios
      .put(`${BASEURL}/nft/sell/${nftId}`, {
        walletAddress,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((e) => console.log(e));
  };

  return (
    <div>
      <Header setShowModal={setShowModal} setWalletAddress={setWalletAddress} />
      <div className="profile-content">
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
            <a href="/" className="filter-btn" onClick={openSidebar}>
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
                      userDetails &&
                      `${userDetails.imageUrl}`
                    }
                    alt=""
                  />
                </div>
                <button
                  className="custom-btn"
                  onClick={() => setShowModal(true)}
                >
                  Edit Profile
                </button>
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
                  <button
                    className="custom-btn"
                    onClick={() => setShowModal(true)}
                  >
                    Edit Profile
                  </button>
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
                          navigate(`/trending/${elem._id}/tokenid/${elem.tokenId}`);
                        }}
                      >
                        <div className="card-img">
                          <img
                            src={`${elem.imageUrl}`}
                            alt="Card1"
                          />
                        </div>
                        <div className="card-title">
                          <h4>
                            {elem.title}
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
                          <button
                            className="custom-btn"
                            onClick={(e) => sellNft(e, elem._id)}
                          >
                            SELL
                          </button>
                        </div>
                        <div className="card-price">
                          {/* <div>
                  <span>gTHC</span>
                  <p>21/219</p>
                </div> */}
                          <div>
                            <span>Price</span>
                            <p>{elem.price}&nbsp;{elem.currency?.toUpperCase()}</p>
                            <small>${elem.price} USD</small>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {nftsArray && nftsArray.length > 0 && !isLoading ? (
                  <div className="pagination-wrap">
                    <div className="pagination">
                      <div className="icon">
                        <a href="/">
                          <img src={LeftIcon} alt="" />
                        </a>
                      </div>
                      <div className="number">
                        <span>{size > totalRecords ? totalRecords : size}</span>
                        of {totalRecords && totalRecords}
                      </div>
                      <div className="icon">
                        <a href="/">
                          <img src={RightIcon} alt="" />
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
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
                )}
              </div>
            </div>
            <div className={sidebar ? "sidebar sidebar-active" : "sidebar"}>
              <div className="filter">
                <h4>FILTERS</h4>
                <a href="/" onClick={clearAll}>
                  CLEAR ALL
                </a>
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
                    <option selected>Select Currency</option>
                    <option value="ghsp">GHSP</option>
                    <option value="bnb">BNB</option>
                    <option value="busd">BUSD</option>
                  </select>
                </div>
              </div>
              <div className="hero">
                <h4>LEVEL</h4>
                <div className="levels">
                  <MultiRangeInput
                    min={0}
                    max={20}
                    onChange={({ min, max }) => {
                      setMinlevel(min);
                      setMaxlevel(max);
                      console.log(`min = ${min}, max = ${max}`);
                    }}
                  />
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
              {/* <div className="hero skin">
      <h4>SKINS</h4>
      <p>No skin selected</p>
      <a href="/">Choose Skin</a>
    </div> */}
            </div>
          </div>
        ) : (
          <h2 style={{ textAlign: "center", marginTop: "40px" }}>
            You are not registered with Ghospers
          </h2>
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
      </div>
    </div>
  );
}

export default Profile;
