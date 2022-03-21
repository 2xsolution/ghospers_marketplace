import React from "react";
import Header from "../../components/Header";
import contactImg from "../../assets/img/contactimg.png";
import "./contact.css";
const Contact = ({ setShowModal }) => {
	return (
		<>
			<Header setShowModal={setShowModal} />
			<section className="contact-wrap">
				<div className="container">
					<div className="contact-img">
						<img src={contactImg} alt="contactImg" />
					</div>
					<div className="contact-form">
						<h1>Contact Us</h1>
						<form action="/">
							<div className="contact-input">
								<p>Your Name</p>
								<input type="text" />
							</div>
							<div className="contact-input">
								<p>Email</p>
								<input type="email" />
							</div>
							<div className="contact-input">
								<p>Subject</p>
								<input type="text" />
							</div>
							<div className="contact-input">
								<p>Your Message</p>
								<textarea name="" id="" cols="30" rows="7"></textarea>
							</div>
							<label className="checkbox-wrap">
								<input type="checkbox" />
								<span className="checkmark"></span>Allow to all tearms &amp;
								condition
							</label>
						</form>
						<div className="msg-btn">
							<button type="submit">Send Message</button>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Contact;
