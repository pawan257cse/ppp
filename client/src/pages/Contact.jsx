import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext.jsx';

const Contact = () => {
    const { submitContactMessage, showNotification } = useContext(ShopContext);

    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setContactForm({ ...contactForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
            showNotification("Please fill in all required fields.", "error");
            return;
        }

        setSubmitting(true);
        const ok = await submitContactMessage(contactForm);
        setSubmitting(false);

        if (ok) {
            setSuccess(true);
            showNotification("Message sent successfully!", "success");
        } else {
            showNotification("Failed to send message. Please try again.", "error");
        }
    };

    const handleReset = () => {
        setContactForm({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
        setSuccess(false);
    };

    return (
        <section id="contactView" className="page-view active" style={{ display: 'block' }}>
            <div className="contact-hero-banner">
                <div className="section-container">
                    <h1>Let's Connect</h1>
                    <p>Have questions about sizes, materials, nursery design consults, or wholesale? We're here to assist!</p>
                </div>
            </div>

            <div className="section-container contact-layout-grid">
                {/* Contact Info Panel */}
                <div className="contact-info-panel">
                    <h3>Contact Information</h3>
                    <p className="lead-text">Drop by our headquarters or contact our custom support team anytime.</p>
                    
                    <div className="contact-details-list">
                        <div className="detail-item">
                            <div className="icon-circle"><i className="fa-solid fa-phone"></i></div>
                            <div>
                                <h5>Call Us</h5>
                                <p>+1 (800) 555-0199</p>
                                <span>Mon - Sat: 9:00 AM - 7:00 PM EST</span>
                            </div>
                        </div>
                        <div className="detail-item">
                            <div className="icon-circle"><i className="fa-solid fa-envelope"></i></div>
                            <div>
                                <h5>Email Support</h5>
                                <p>support@pretute.com</p>
                                <span>Average response within 2-4 hours.</span>
                            </div>
                        </div>
                        <div className="detail-item">
                            <div className="icon-circle"><i className="fa-solid fa-location-dot"></i></div>
                            <div>
                                <h5>Headquarters</h5>
                                <p>100 Premium Blvd, Suite 300<br />New York, NY 10001, USA</p>
                            </div>
                        </div>
                    </div>

                    <div className="social-block">
                        <h5>Follow Our Journey</h5>
                        <div className="social-row">
                            <a href="#" className="social-circle"><i className="fa-brands fa-instagram"></i></a>
                            <a href="#" className="social-circle"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href="#" className="social-circle"><i className="fa-brands fa-pinterest-p"></i></a>
                            <a href="#" className="social-circle"><i className="fa-brands fa-twitter"></i></a>
                        </div>
                    </div>
                </div>

                {/* Form Panel */}
                <div className="contact-form-container">
                    <h3>Send Us a Message</h3>
                    
                    {!success ? (
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-row-two">
                                <div className="form-group floating-label-group">
                                    <input 
                                        type="text" 
                                        name="name" 
                                        required 
                                        placeholder=" " 
                                        className="form-input"
                                        value={contactForm.name}
                                        onChange={handleChange}
                                    />
                                    <label>Full Name *</label>
                                </div>
                                <div className="form-group floating-label-group">
                                    <input 
                                        type="email" 
                                        name="email" 
                                        required 
                                        placeholder=" " 
                                        className="form-input"
                                        value={contactForm.email}
                                        onChange={handleChange}
                                    />
                                    <label>Email Address *</label>
                                </div>
                            </div>

                            <div className="form-row-two">
                                <div className="form-group floating-label-group">
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        placeholder=" " 
                                        className="form-input"
                                        value={contactForm.phone}
                                        onChange={handleChange}
                                    />
                                    <label>Phone Number (Optional)</label>
                                </div>
                                <div className="form-group floating-label-group">
                                    <input 
                                        type="text" 
                                        name="subject" 
                                        required 
                                        placeholder=" " 
                                        className="form-input"
                                        value={contactForm.subject}
                                        onChange={handleChange}
                                    />
                                    <label>Subject *</label>
                                </div>
                            </div>

                            <div className="form-group floating-label-group">
                                <textarea 
                                    name="message" 
                                    rows="5" 
                                    required 
                                    placeholder=" " 
                                    className="form-input form-textarea"
                                    value={contactForm.message}
                                    onChange={handleChange}
                                ></textarea>
                                <label>Your Message *</label>
                            </div>

                            <button type="submit" disabled={submitting} className="btn btn-primary btn-large btn-submit">
                                {submitting ? (
                                    <><span>Sending...</span> <i className="fa-solid fa-spinner fa-spin"></i></>
                                ) : (
                                    <><span>Send Message</span> <i className="fa-solid fa-paper-plane"></i></>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="contact-success-card active" style={{ position: 'relative' }}>
                            <div className="success-icon"><i className="fa-solid fa-circle-check"></i></div>
                            <h4>Message Sent!</h4>
                            <p>Thank you for reaching out to PRETUTE. Our support representative has received your request and will follow up with you within 24 hours.</p>
                            <button className="btn btn-outline" onClick={handleReset}>Send Another Message</button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Contact;
