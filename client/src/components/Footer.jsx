import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterSuccess, setNewsletterSuccess] = useState(false);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (newsletterEmail.trim()) {
            setNewsletterEmail('');
            setNewsletterSuccess(true);
            setTimeout(() => {
                setNewsletterSuccess(false);
            }, 5000);
        }
    };

    return (
        <footer className="main-footer">
            <div className="footer-top">
                <div className="section-container footer-grid">
                    {/* Col 1: About */}
                    <div className="footer-col about-col">
                        <Link to="/" className="footer-logo">
                            <img src="assets/logo.png" alt="PRETUTE Logo" className="footer-brand-logo" />
                        </Link>
                        <p className="about-text">PRETUTE is a premium family lifestyle destination dedicated to organic baby & kids fashion, developmental Montessori play, modern nursery gear, and chic maternity wear.</p>
                        <div className="social-links">
                            <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                            <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href="#" aria-label="Pinterest"><i className="fa-brands fa-pinterest-p"></i></a>
                            <a href="#" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
                        </div>
                    </div>

                    {/* Col 2: Categories */}
                    <div className="footer-col links-col">
                        <h4 className="col-title">Shop Categories</h4>
                        <ul className="footer-links">
                            <li><Link to="/category/baby-fashion">Baby & Kids Wear</Link></li>
                            <li><Link to="/category/wooden-toys">Montessori Toys</Link></li>
                            <li><Link to="/category/baby-gear">Nursery & Gear</Link></li>
                            <li><Link to="/category/maternity">Maternity Wear</Link></li>
                        </ul>
                    </div>

                    {/* Col 3: Quick Links */}
                    <div className="footer-col links-col">
                        <h4 className="col-title">Customer Care</h4>
                        <ul className="footer-links">
                            <li><Link to="/contact">Contact Support</Link></li>
                            <li><a href="#">Shipping & Deliveries</a></li>
                            <li><a href="#">Returns & Exchanges</a></li>
                        </ul>
                    </div>

                    {/* Col 4: Newsletter */}
                    <div className="footer-col newsletter-col">
                        <h4 className="col-title">Join Our Newsletter</h4>
                        <p className="newsletter-text">Subscribe to receive first-look notices on new collection arrivals, organic living articles, and exclusive brand sales.</p>
                        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                            <input 
                                type="email" 
                                placeholder="Your email address" 
                                className="newsletter-field" 
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                required 
                            />
                            <button type="submit" className="btn btn-primary btn-subscribe">Subscribe</button>
                        </form>
                        {newsletterSuccess && (
                            <div className="newsletter-success" style={{ display: 'block' }}>
                                ✓ Subscribed successfully! Check your inbox.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="section-container bottom-row">
                    <p className="copyright">&copy; 2026 PRETUTE Premium Store. All rights reserved.</p>
                    <div className="payment-methods">
                        <i className="fa-brands fa-cc-visa"></i>
                        <i className="fa-brands fa-cc-mastercard"></i>
                        <i className="fa-brands fa-cc-stripe"></i>
                        <i className="fa-brands fa-cc-apple-pay"></i>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
