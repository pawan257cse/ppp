import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';

const Header = () => {
    const { 
        cart, wishlist, products, 
        setIsCartOpen, isMobileSidebarOpen, setIsMobileSidebarOpen 
    } = useContext(ShopContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const suggestionsRef = useRef(null);

    // Cart and Wishlist quantities
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = wishlist.length;

    // Scroll sticky logic
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Search suggestions filter
    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSuggestions([]);
            setIsSearchActive(false);
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        const matches = products.filter(p => 
            p.title.toLowerCase().includes(query) || 
            p.categoryLabel.toLowerCase().includes(query)
        ).slice(0, 5);

        setSuggestions(matches);
        setIsSearchActive(true);
    }, [searchQuery, products]);

    // Close search suggestion box when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
                setIsSearchActive(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle Search Form Submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const query = searchQuery.trim();
        if (query) {
            setIsSearchActive(false);
            setSearchQuery('');
            navigate(`/category/all?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <header className={`main-header ${isSticky ? 'sticky' : ''}`} id="mainHeader">
            <div className="header-top">
                <p>🌟 Spend ₹1,499+ for Free Shipping! | Code: <span className="promo-highlight">PRETUTE20</span></p>
            </div>
            
            <div className="header-container">
                {/* Mobile Menu Toggle */}
                <button 
                    className="mobile-nav-toggle" 
                    onClick={() => setIsMobileSidebarOpen(true)}
                    aria-label="Toggle Menu"
                >
                    <i className="fa-solid fa-bars-staggered"></i>
                </button>

                {/* Brand Logo */}
                <Link to="/" className="logo-container" id="logoLink">
                    <img src="assets/logo.png" alt="PRETUTE Logo" className="brand-logo" id="brandLogo" />
                </Link>

                {/* Search Area */}
                <div className="search-wrapper" ref={suggestionsRef}>
                    <form className="search-form" onSubmit={handleSearchSubmit} autoComplete="off">
                        <input 
                            type="text" 
                            placeholder="Search for organic clothes, Montessori toys, gear..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search"
                        />
                        <button type="submit" className="search-btn" aria-label="Submit Search">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </form>
                    
                    {/* Search Suggestions Popup */}
                    {isSearchActive && (
                        <div className="search-suggestions active" id="searchSuggestions">
                            {suggestions.length === 0 ? (
                                <div className="suggestion-item">
                                    <div className="suggestion-info">
                                        <h5>No matches found</h5>
                                    </div>
                                </div>
                            ) : (
                                suggestions.map(p => (
                                    <div 
                                        key={p.id} 
                                        className="suggestion-item"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setIsSearchActive(false);
                                            navigate(`/product/${p.id}`);
                                        }}
                                    >
                                        <img src={p.image} alt={p.title} />
                                        <div className="suggestion-info">
                                            <h5>{p.title}</h5>
                                            <span>₹{p.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Utility Navigation Icons */}
                <div className="header-utilities">
                    {/* User Profile / Admin Account */}
                    <div className="utility-item dropdown-wrapper" id="userAccountWrapper">
                        <button className="utility-btn" id="userMenuBtn" aria-label="User Account">
                            <i className="fa-regular fa-user"></i>
                            <span className="utility-label">Account</span>
                        </button>
                        <div className="utility-dropdown" id="userDropdown">
                            <div className="dropdown-header">
                                <p className="dropdown-title">Welcome to PRETUTE</p>
                                <p className="dropdown-subtitle">Access your account & orders</p>
                            </div>
                            <div className="dropdown-divider"></div>
                            <a href="#login" className="dropdown-link btn-login" id="loginBtn">Sign In / Register</a>
                            <Link to="/wishlist" className="dropdown-link">
                                <i className="fa-regular fa-heart"></i> My Wishlist ({wishlistCount})
                            </Link>
                            <Link to="/cart" className="dropdown-link">
                                <i className="fa-solid fa-bag-shopping"></i> View Cart ({cartCount})
                            </Link>
                        </div>
                    </div>

                    {/* Wishlist Icon */}
                    <Link to="/wishlist" className="utility-item" id="wishlistIconBtn" aria-label="Wishlist">
                        <div className="icon-badge-wrapper">
                            <i className="fa-regular fa-heart"></i>
                            <span className="badge" id="wishlistBadge">{wishlistCount}</span>
                        </div>
                        <span className="utility-label">Wishlist</span>
                    </Link>

                    {/* Cart Drawer Toggle */}
                    <button 
                        className="utility-item utility-btn" 
                        onClick={() => setIsCartOpen(true)}
                        aria-label="Open Shopping Cart"
                    >
                        <div className="icon-badge-wrapper">
                            <i className="fa-solid fa-bag-shopping"></i>
                            <span className="badge" id="cartBadge">{cartCount}</span>
                        </div>
                        <span className="utility-label">Cart</span>
                    </button>
                </div>
            </div>

            {/* Desktop Navigation Bar */}
            <nav className="desktop-navigation" id="desktopNav">
                <ul className="nav-links">
                    <li><Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link></li>
                    <li><Link to="/category/baby-fashion" className={`nav-link ${location.pathname === '/category/baby-fashion' ? 'active' : ''}`}>Baby & Kids Wear</Link></li>
                    <li><Link to="/category/wooden-toys" className={`nav-link ${location.pathname === '/category/wooden-toys' ? 'active' : ''}`}>Montessori Toys</Link></li>
                    <li><Link to="/category/baby-gear" className={`nav-link ${location.pathname === '/category/baby-gear' ? 'active' : ''}`}>Baby Gear</Link></li>
                    <li><Link to="/category/maternity" className={`nav-link ${location.pathname === '/category/maternity' ? 'active' : ''}`}>Maternity</Link></li>
                    <li><Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact Us</Link></li>
                </ul>
            </nav>

            {/* Mobile Navigation Menu Sidebar Drawer */}
            <div 
                className={`mobile-sidebar-overlay ${isMobileSidebarOpen ? 'active' : ''}`} 
                onClick={() => setIsMobileSidebarOpen(false)}
            ></div>
            <div className={`mobile-sidebar ${isMobileSidebarOpen ? 'active' : ''}`} id="mobileSidebar">
                <div className="sidebar-header">
                    <span className="sidebar-title">Menu</span>
                    <button 
                        className="close-sidebar-btn" 
                        onClick={() => setIsMobileSidebarOpen(false)}
                        aria-label="Close Menu"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <ul className="mobile-nav-links">
                    <li>
                        <Link to="/" className="mob-link" onClick={() => setIsMobileSidebarOpen(false)}>
                            <i className="fa-solid fa-house"></i> Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/category/baby-fashion" className="mob-link" onClick={() => setIsMobileSidebarOpen(false)}>
                            <i className="fa-solid fa-shirt"></i> Baby & Kids Wear
                        </Link>
                    </li>
                    <li>
                        <Link to="/category/wooden-toys" className="mob-link" onClick={() => setIsMobileSidebarOpen(false)}>
                            <i className="fa-solid fa-gamepad"></i> Montessori Toys
                        </Link>
                    </li>
                    <li>
                        <Link to="/category/baby-gear" className="mob-link" onClick={() => setIsMobileSidebarOpen(false)}>
                            <i className="fa-solid fa-baby-carriage"></i> Baby Gear
                        </Link>
                    </li>
                    <li>
                        <Link to="/category/maternity" className="mob-link" onClick={() => setIsMobileSidebarOpen(false)}>
                            <i className="fa-solid fa-person-pregnant"></i> Maternity
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className="mob-link" onClick={() => setIsMobileSidebarOpen(false)}>
                            <i className="fa-solid fa-envelope"></i> Contact Us
                        </Link>
                    </li>
                </ul>
                <div className="sidebar-footer">
                    <p>Support: support@pretute.com</p>
                    <div className="mob-socials">
                        <a href="#" className="social-circle"><i className="fa-brands fa-instagram"></i></a>
                        <a href="#" className="social-circle"><i className="fa-brands fa-facebook-f"></i></a>
                        <a href="#" className="social-circle"><i className="fa-brands fa-pinterest-p"></i></a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
