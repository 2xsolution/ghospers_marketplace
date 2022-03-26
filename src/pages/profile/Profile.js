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
function Profile() {
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
    setSelectedTraits([]);
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
  const [size, setSize] = useState(5);
  const [totalRecords, setTotalRecords] = useState(null);
  //   filters
  const [min, setMin] = useState(null);
  const [minlevel, setMinlevel] = useState(0);
  const [maxlevel, setMaxlevel] = useState(100);
  const [traits, setTraits] = useState(null);
  const [currency, setCurrency] = useState(null);

  const [selectedType, setSelectedType] = useState(null);
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [max, setMax] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("abcd");
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    loadNfts();
    // updateTokenIds();
  }, []);

  return (
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
      <div className="profile-flex">
        <div className="profile-div">
          <div className="red-div">
            <img src={ProfileImg} alt="" />
          </div>
          <button className="custom-btn" onClick={() => setShowModal(true)}>
            Edit Profile
          </button>
          <h2>Johny</h2>
          <p>Loremipsumdolor</p>{" "}
          <div className="profile-about">
            <p>About me</p>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vero
              quaerat id eos doloribus incidunt nemo similique, obcaecati
              repellat nisi rerum maiores culpa quasi. Explicabo, facilis.
            </p>
          </div>
        </div>

        <div className="profile-nft-div" style={{ marginLeft: "60px" }}>
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
                      <button className="custom-btn">SELL</button>
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

            {nftsArray && nftsArray.length > 0 ? (
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
      </div>
      <UpdateModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}

export default Profile;
