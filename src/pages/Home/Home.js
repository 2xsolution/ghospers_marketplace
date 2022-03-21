import React, { useState } from "react";
import Header from "../../components/Header";
import MultiRangeInput from "../../components/MultiRangeInput";
import Card1 from "../../assets/img/card1.png";
import Card2 from "../../assets/img/card2.png";
import LeftIcon from "../../assets/img/lefticon.png";
import RightIcon from "../../assets/img/righticon.png";
import "./home.css";
const Home = ({ setShowModal }) => {
	const [sidebar, setSidebar] = useState(false);
	const openSidebar = (e) => {
		console.log("sidebar");
		e.preventDefault();
		setSidebar((prev) => !prev);
	};
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
							<a href="/">CLEAR ALL</a>
						</div>
						<div className="hero">
							<h4>GHOSPHERS</h4>
							<p>No Ghosper selected</p>
							<a href="/">Choose Ghospers</a>
						</div>
						<div className="hero">
							<h4>GHOSPHERS</h4>
							<div className="checkbox">
								<label className="checkbox-wrap">
									<input type="checkbox" />
									<span className="checkmark"></span>Common
								</label>
								<label className="checkbox-wrap">
									<input type="checkbox" />
									<span className="checkmark"></span>Rare
								</label>
								<label className="checkbox-wrap">
									<input type="checkbox" />
									<span className="checkmark"></span>Epic
								</label>
								<label className="checkbox-wrap">
									<input type="checkbox" />
									<span className="checkmark"></span>Legendary
								</label>
							</div>
						</div>
						<div className="hero">
							<h4>PRICE</h4>
							<div className="price">
								<div className="price-inpt">
									<input type="text" placeholder="Min" />
								</div>
								<span></span>
								<div className="price-inpt">
									<input type="text" placeholder="Max" />
								</div>
							</div>
						</div>
						<div className="hero">
							<h4>LEVEL</h4>
							<div className="levels">
								<MultiRangeInput
									min={0}
									max={100}
									onChange={({ min, max }) =>
										console.log(`min = ${min}, max = ${max}`)
									}
								/>
							</div>
						</div>
						<div className="hero">
							<h4>TRAITS</h4>
							<div className="checkbox">
								<label className="checkbox-wrap">
									<input type="checkbox" />
									<span className="checkmark"></span>Tank
								</label>
								<label className="checkbox-wrap">
									<input type="checkbox" />
									<span className="checkmark"></span>Marksman
								</label>
								<label className="checkbox-wrap">
									<input type="checkbox" />
									<span className="checkmark"></span>Assassin
								</label>
							</div>
						</div>
						{/* <div className="hero skin">
							<h4>SKINS</h4>
							<p>No skin selected</p>
							<a href="/">Choose Skin</a>
						</div> */}
					</div>
					<div className="nft-collections">
						<div className="card">
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
						</div>
						<div className="pagination-wrap">
							<div className="pagination">
								<div className="icon">
									<a href="/">
										<img src={LeftIcon} alt="" />
									</a>
								</div>
								<div className="number">
									<span>25</span>
									of 120
								</div>
								<div className="icon">
									<a href="/">
										<img src={RightIcon} alt="" />
									</a>
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
