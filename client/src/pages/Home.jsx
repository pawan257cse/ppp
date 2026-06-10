import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

const Home = () => {
    const { products, submitBooking, submitContactMessage, showNotification } = useContext(ShopContext);

    // Hero Carousel State
    const [activeSlide, setActiveSlide] = useState(0);
    const carouselSlides = [
        {
            subtitle: "Spring/Summer Collection",
            title: "Luxury Organic Wear for Little Ones",
            desc: "Aesthetic pastel rompers and kids apparel hand-knit with 100% GOTS-certified organic cotton.",
            bg: "assets/hero_fashion.png",
            link1: "/category/baby-fashion",
            label1: "Shop Kids Fashion",
            link2: "/category/maternity",
            label2: "Explore Maternity"
        },
        {
            subtitle: "Play & Grow",
            title: "Handcrafted Montessori Toys",
            desc: "Promote creative exploration, sensory growth, and active learning with premium toxin-free wood playsets.",
            bg: "assets/hero_toys.png",
            link1: "/category/wooden-toys",
            label1: "Shop Montessori Toys",
            link2: "/category/all",
            label2: "View Best Sellers"
        }
    ];

    // Carousel Autoplay
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % carouselSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Countdown Timer Logic
    const [timeLeft, setTimeLeft] = useState(23 * 3600 + 40 * 60 + 15); // 23h 40m 15s initial
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) return 24 * 3600; // Reset to 24h
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        const pad = (num) => String(num).padStart(2, "0");
        return `${pad(hrs)}h : ${pad(mins)}m : ${pad(secs)}s`;
    };

    // Copy Coupon helper
    const handleCopyCoupon = (code) => {
        navigator.clipboard.writeText(code).then(() => {
            showNotification(`Copied code: ${code}`, "success");
        });
    };

    // Booking Form State
    const [bookingForm, setBookingForm] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        service: 'Nursery Design Consultation',
        notes: ''
    });
    const [bookingSubmitting, setBookingSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const handleBookingChange = (e) => {
        setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!bookingForm.name || !bookingForm.email || !bookingForm.date || !bookingForm.time) {
            showNotification("Please fill in all required booking fields.", "error");
            return;
        }

        setBookingSubmitting(true);
        const success = await submitBooking(bookingForm);
        setBookingSubmitting(false);

        if (success) {
            setBookingSuccess(true);
            showNotification("Booking session scheduled!", "success");
        } else {
            showNotification("Failed to schedule booking. Try again.", "error");
        }
    };

    const handleResetBooking = () => {
        setBookingForm({
            name: '',
            email: '',
            phone: '',
            date: '',
            time: '',
            service: 'Nursery Design Consultation',
            notes: ''
        });
        setBookingSuccess(false);
    };

    // Contact Form State
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [contactSubmitting, setContactSubmitting] = useState(false);
    const [contactSuccess, setContactSuccess] = useState(false);

    const handleContactChange = (e) => {
        setContactForm({ ...contactForm, [e.target.name]: e.target.value });
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
            showNotification("Please fill in all required contact fields.", "error");
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactForm.email)) {
            showNotification("Please enter a valid email address.", "error");
            return;
        }

        setContactSubmitting(true);
        const success = await submitContactMessage(contactForm);
        setContactSubmitting(false);

        if (success) {
            setContactSuccess(true);
            showNotification("Message sent successfully!", "success");
        } else {
            showNotification("Failed to send message. Try again.", "error");
        }
    };

    const handleResetContact = () => {
        setContactForm({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
        setContactSuccess(false);
    };

    return (
        <section id="homeView" className="page-view active" style={{ display: 'block' }}>
            
            {/* Category Scroll Slider */}
            <div className="category-scroll-section">
                <div className="section-container">
                    <div className="category-scroll-container" id="categoryScrollContainer">
                        <Link to="/category/baby-fashion" className="cat-scroll-card">
                            <div className="cat-img-wrapper">
                                <img src="assets/prod_romper.png" alt="Baby Fashion" />
                            </div>
                            <span className="cat-name">Baby Fashion</span>
                        </Link>
                        <Link to="/category/wooden-toys" className="cat-scroll-card">
                            <div className="cat-img-wrapper">
                                <img src="assets/prod_rainbow.png" alt="Montessori Toys" />
                            </div>
                            <span className="cat-name">Montessori Toys</span>
                        </Link>
                        <Link to="/category/baby-gear" className="cat-scroll-card">
                            <div className="cat-img-wrapper">
                                <img src="assets/prod_stroller.png" alt="Baby Gear" />
                            </div>
                            <span className="cat-name">Baby Gear</span>
                        </Link>
                        <Link to="/category/maternity" className="cat-scroll-card">
                            <div className="cat-img-wrapper">
                                <img src="assets/prod_dress.png" alt="Maternity Wear" />
                            </div>
                            <span className="cat-name">Maternity</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Hero sliding Carousel */}
            <div className="hero-carousel-section">
                <div className="carousel-container" id="heroCarousel">
                    <div className="carousel-slider" id="carouselSlider">
                        {carouselSlides.map((slide, idx) => (
                            <div 
                                key={idx} 
                                className={`carousel-slide ${idx === activeSlide ? 'active' : ''}`}
                                style={{ 
                                    backgroundImage: `linear-gradient(rgba(26,37,60,0.5), rgba(26,37,60,0.2)), url('${slide.bg}')` 
                                }}
                            >
                                <div className="carousel-content">
                                    <span className="slide-subtitle">{slide.subtitle}</span>
                                    <h2 className="slide-title">{slide.title}</h2>
                                    <p className="slide-desc">{slide.desc}</p>
                                    <div className="slide-actions">
                                        <Link to={slide.link1} className="btn btn-primary btn-large">{slide.label1}</Link>
                                        <Link to={slide.link2} className="btn btn-outline btn-large">{slide.label2}</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Slider Arrows */}
                    <button 
                        className="carousel-arrow prev" 
                        onClick={() => setActiveSlide(prev => (prev - 1 + carouselSlides.length) % carouselSlides.length)} 
                        aria-label="Previous Slide"
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button 
                        className="carousel-arrow next" 
                        onClick={() => setActiveSlide(prev => (prev + 1) % carouselSlides.length)} 
                        aria-label="Next Slide"
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                    {/* Slide Indicators */}
                    <div className="carousel-dots" id="carouselDots">
                        {carouselSlides.map((_, idx) => (
                            <span 
                                key={idx} 
                                className={`dot ${idx === activeSlide ? 'active' : ''}`} 
                                onClick={() => setActiveSlide(idx)}
                            ></span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Deals Grid */}
            <div className="offers-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">Exclusive Deals of the Day</h2>
                        <div className="countdown-badge">
                            <span className="label">ENDS IN:</span>
                            <span className="timer-digits" id="offerCountdown">{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                    <div className="offers-grid">
                        <div className="offer-card promo-card pink-card">
                            <div className="offer-badge">FLAT 25% OFF</div>
                            <h3 className="offer-title">Nursery & Gear Fest</h3>
                            <p className="offer-sub">Discount applied at checkout. Strollers, car seats, cribs & swings.</p>
                            <div className="coupon-code-box">
                                <span className="code">GEAR25</span>
                                <button className="copy-coupon-btn" onClick={() => handleCopyCoupon('GEAR25')}>COPY</button>
                            </div>
                        </div>

                        <div className="offer-card promo-card gold-card">
                            <div className="offer-badge">BUY 2 GET 1</div>
                            <h3 className="offer-title">Premium Montessori Toys</h3>
                            <p className="offer-sub">Add three wooden toys to the cart, the lowest-priced item is free.</p>
                            <div className="coupon-code-box">
                                <span className="code">PLAYFREE</span>
                                <button className="copy-coupon-btn" onClick={() => handleCopyCoupon('PLAYFREE')}>COPY</button>
                            </div>
                        </div>

                        <div className="offer-card promo-card teal-card">
                            <div className="offer-badge">EXTRA ₹1,000 OFF</div>
                            <h3 className="offer-title">Maternity Chic Looks</h3>
                            <p className="offer-sub">On minimum purchases of ₹4,999+ in maternity dresses, shirts and pants.</p>
                            <div className="coupon-code-box">
                                <span className="code">MOM15</span>
                                <button className="copy-coupon-btn" onClick={() => handleCopyCoupon('MOM15')}>COPY</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products grid */}
            <div className="category-showcase-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">Featured Collections</h2>
                        <Link to="/category/all" className="view-all-link">View All Products <i className="fa-solid fa-arrow-right"></i></Link>
                    </div>
                    <div className="products-grid" id="homeProductsGrid">
                        {products.slice(0, 8).map(prod => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Philosophy Section */}
            <div className="philosophy-section">
                <div className="section-container philosophy-grid">
                    <div className="philosophy-card">
                        <div className="icon-wrapper"><i className="fa-solid fa-seedling"></i></div>
                        <h4>100% Organic Materials</h4>
                        <p>We source only GOTS-certified organic cotton, chemical-free dyes, and solid sustainably-harvested timber.</p>
                    </div>
                    <div className="philosophy-card">
                        <div className="icon-wrapper"><i className="fa-solid fa-shield-halved"></i></div>
                        <h4>Safety First Certification</h4>
                        <p>Every toy, crib, and carrier is rigorously tested against safety standards to ensure toxin-free and child-safe play.</p>
                    </div>
                    <div className="philosophy-card">
                        <div className="icon-wrapper"><i className="fa-solid fa-hands-holding"></i></div>
                        <h4>Artisan Handcrafted</h4>
                        <p>Our wooden stackers and fabric dolls are made in small batches by global artisan families with love.</p>
                    </div>
                </div>
            </div>

            {/* NEW: Booking Form Section */}
            <div className="home-booking-section">
                <div className="section-container">
                    <div className="home-booking-container">
                        <h2 className="home-booking-title">Schedule a Consultation</h2>
                        <p className="home-booking-desc">Book a private session with our specialists for registry assistance, nursery planning, or custom apparel selections.</p>
                        
                        {!bookingSuccess ? (
                            <form className="contact-form" onSubmit={handleBookingSubmit}>
                                <div className="form-row-two">
                                    <div className="form-group floating-label-group">
                                        <input 
                                            type="text" 
                                            name="name" 
                                            required 
                                            value={bookingForm.name} 
                                            onChange={handleBookingChange} 
                                            placeholder=" " 
                                            className="form-input" 
                                        />
                                        <label>Full Name *</label>
                                    </div>
                                    <div className="form-group floating-label-group">
                                        <input 
                                            type="email" 
                                            name="email" 
                                            required 
                                            value={bookingForm.email} 
                                            onChange={handleBookingChange} 
                                            placeholder=" " 
                                            className="form-input" 
                                        />
                                        <label>Email Address *</label>
                                    </div>
                                </div>
                                <div className="form-row-two">
                                    <div className="form-group floating-label-group">
                                        <input 
                                            type="tel" 
                                            name="phone" 
                                            value={bookingForm.phone} 
                                            onChange={handleBookingChange} 
                                            placeholder=" " 
                                            className="form-input" 
                                        />
                                        <label>Phone Number (Optional)</label>
                                    </div>
                                    <div className="form-group floating-label-group" style={{ display: 'flex', flexDirection: 'column' }}>
                                        <select 
                                            name="service" 
                                            value={bookingForm.service} 
                                            onChange={handleBookingChange} 
                                            className="form-input"
                                            style={{ color: 'var(--color-navy)', background: 'none' }}
                                        >
                                            <option value="Nursery Design Consultation">Nursery Design Consultation</option>
                                            <option value="Personal Shopping Session">Personal Shopping Session</option>
                                            <option value="Baby Shower Registry Consult">Baby Shower Registry Consult</option>
                                            <option value="Developmental Play Workshop">Developmental Play Workshop</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row-two">
                                    <div className="form-group floating-label-group">
                                        <input 
                                            type="date" 
                                            name="date" 
                                            required 
                                            value={bookingForm.date} 
                                            onChange={handleBookingChange} 
                                            className="form-input" 
                                            style={{ paddingTop: '18px' }}
                                        />
                                        <label style={{ transform: 'translateY(-50%) scale(0.8)', top: '10px' }}>Consultation Date *</label>
                                    </div>
                                    <div className="form-group floating-label-group">
                                        <input 
                                            type="time" 
                                            name="time" 
                                            required 
                                            value={bookingForm.time} 
                                            onChange={handleBookingChange} 
                                            className="form-input" 
                                            style={{ paddingTop: '18px' }}
                                        />
                                        <label style={{ transform: 'translateY(-50%) scale(0.8)', top: '10px' }}>Preferred Time *</label>
                                    </div>
                                </div>
                                <div className="form-group floating-label-group">
                                    <textarea 
                                        name="notes" 
                                        rows="4" 
                                        value={bookingForm.notes} 
                                        onChange={handleBookingChange} 
                                        placeholder=" " 
                                        className="form-input form-textarea"
                                    ></textarea>
                                    <label>Special Requests or Notes</label>
                                </div>
                                <button type="submit" disabled={bookingSubmitting} className="btn btn-primary btn-large btn-submit">
                                    {bookingSubmitting ? (
                                        <><span>Scheduling...</span> <i className="fa-solid fa-spinner fa-spin"></i></>
                                    ) : (
                                        <><span>Request Booking</span> <i className="fa-solid fa-calendar-check"></i></>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="contact-success-card active" style={{ position: 'relative' }}>
                                <div className="success-icon"><i className="fa-solid fa-circle-check"></i></div>
                                <h4>Consultation Requested!</h4>
                                <p>Thank you, {bookingForm.name}. We have logged your request for a {bookingForm.service} on {bookingForm.date} at {bookingForm.time}. We will verify developer availability and email confirmation to {bookingForm.email} within 12 hours.</p>
                                <button className="btn btn-outline" onClick={handleResetBooking}>Book Another Session</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* NEW: Contact Form Section */}
            <div className="home-contact-section">
                <div className="section-container">
                    <div className="home-contact-container">
                        <h2 className="home-booking-title">Send Us a Message</h2>
                        <p className="home-booking-desc">Have queries about dimensions, gift boxes, or bulk orders? Write us a message, and our customer team will get back shortly.</p>
                        
                        {!contactSuccess ? (
                            <form className="contact-form" onSubmit={handleContactSubmit}>
                                <div className="form-row-two">
                                    <div className="form-group floating-label-group">
                                        <input 
                                            type="text" 
                                            name="name" 
                                            required 
                                            value={contactForm.name} 
                                            onChange={handleContactChange} 
                                            placeholder=" " 
                                            className="form-input" 
                                        />
                                        <label>Full Name *</label>
                                    </div>
                                    <div className="form-group floating-label-group">
                                        <input 
                                            type="email" 
                                            name="email" 
                                            required 
                                            value={contactForm.email} 
                                            onChange={handleContactChange} 
                                            placeholder=" " 
                                            className="form-input" 
                                        />
                                        <label>Email Address *</label>
                                    </div>
                                </div>
                                <div className="form-row-two">
                                    <div className="form-group floating-label-group">
                                        <input 
                                            type="tel" 
                                            name="phone" 
                                            value={contactForm.phone} 
                                            onChange={handleContactChange} 
                                            placeholder=" " 
                                            className="form-input" 
                                        />
                                        <label>Phone (Optional)</label>
                                    </div>
                                    <div className="form-group floating-label-group">
                                        <input 
                                            type="text" 
                                            name="subject" 
                                            required 
                                            value={contactForm.subject} 
                                            onChange={handleContactChange} 
                                            placeholder=" " 
                                            className="form-input" 
                                        />
                                        <label>Subject *</label>
                                    </div>
                                </div>
                                <div className="form-group floating-label-group">
                                    <textarea 
                                        name="message" 
                                        rows="4" 
                                        required 
                                        value={contactForm.message} 
                                        onChange={handleContactChange} 
                                        placeholder=" " 
                                        className="form-input form-textarea"
                                    ></textarea>
                                    <label>Your Message *</label>
                                </div>
                                <button type="submit" disabled={contactSubmitting} className="btn btn-primary btn-large btn-submit">
                                    {contactSubmitting ? (
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
                                <p>Thank you for reaching out to PRETUTE. Your message has been sent to our backend. We will respond back within 24 hours.</p>
                                <button className="btn btn-outline" onClick={handleResetContact}>Send Another Message</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </section>
    );
};

export default Home;
