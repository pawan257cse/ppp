import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, loading, addToCart, setIsCartOpen, wishlist, toggleWishlist } = useContext(ShopContext);

    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('Standard');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('tab-description');

    // Zoom Lens Coordinates
    const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
    const [lensStyle, setLensStyle] = useState({ display: 'none' });
    const containerRef = useRef(null);
    const imgRef = useRef(null);

    useEffect(() => {
        if (loading) return;
        const found = products.find(p => p.id === parseInt(id));
        if (!found) {
            navigate('/');
            return;
        }
        setProduct(found);
        setMainImage(found.image);
        if (found.sizes && found.sizes.length > 0) {
            setSelectedSize(found.sizes[0]);
        }
        setQuantity(1);
        setActiveTab('tab-description');
    }, [id, products, loading, navigate]);

    if (loading || !product) {
        return (
            <div className="section-container" style={{ padding: '80px 24px', textAlign: 'center' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}></i>
                <p style={{ marginTop: '16px' }}>Loading product details...</p>
            </div>
        );
    }

    const isWished = wishlist.includes(product.id);

    // Helpers to create rating stars markup
    const renderStars = (rating) => {
        const stars = [];
        const floor = Math.floor(rating);
        const half = rating - floor >= 0.4;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= floor) {
                stars.push(<i key={i} className="fa-solid fa-star"></i>);
            } else if (i === floor + 1 && half) {
                stars.push(<i key={i} className="fa-solid fa-star-half-stroke"></i>);
            } else {
                stars.push(<i key={i} className="fa-regular fa-star"></i>);
            }
        }
        return stars;
    };

    // Zoom Magnifier Lens handler
    const handleMouseMove = (e) => {
        if (!containerRef.current || !imgRef.current) return;
        if (window.innerWidth < 768) return; // Disable zoom on tablets/mobile

        const rect = containerRef.current.getBoundingClientRect();
        const lensWidth = 100; // matching .zoom-lens width in CSS
        const lensHeight = 100; // matching .zoom-lens height in CSS
        
        let x = e.clientX - rect.left - lensWidth / 2;
        let y = e.clientY - rect.top - lensHeight / 2;

        // Constraint boundaries
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x > rect.width - lensWidth) x = rect.width - lensWidth;
        if (y > rect.height - lensHeight) y = rect.height - lensHeight;

        setLensStyle({
            display: 'block',
            left: `${x}px`,
            top: `${y}px`
        });

        // Background size is offset by scale of 2.5
        setZoomStyle({
            display: 'block',
            backgroundImage: `url('${mainImage}')`,
            backgroundSize: `${rect.width * 2.5}px ${rect.height * 2.5}px`,
            backgroundPosition: `-${x * 2.5}px -${y * 2.5}px`
        });
    };

    const handleMouseLeave = () => {
        setLensStyle({ display: 'none' });
        setZoomStyle({ display: 'none' });
    };

    const handleAddToCart = () => {
        addToCart(product.id, quantity, selectedSize);
        setIsCartOpen(true);
    };

    const handleBuyNow = () => {
        addToCart(product.id, quantity, selectedSize);
        navigate('/cart');
    };

    // Related Products matching category
    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    return (
        <section id="detailsView" className="page-view active" style={{ display: 'block' }}>
            <div className="section-container">
                {/* Breadcrumbs */}
                <div className="breadcrumbs">
                    <Link to="/">Home</Link> &gt; <Link to={`/category/${product.category}`}>{product.categoryLabel}</Link> &gt; <span className="active">{product.title}</span>
                </div>

                {/* Main Details Layout */}
                <div className="product-details-layout">
                    {/* Images Gallery */}
                    <div className="product-gallery">
                        <div 
                            className="main-image-container" 
                            id="zoomContainer"
                            ref={containerRef}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img src={mainImage} alt={product.title} id="mainDetailImg" ref={imgRef} />
                            {/* Magnifying lens overlay */}
                            <div className="zoom-lens" id="zoomLens" style={lensStyle}></div>
                            <div className="zoom-result" id="zoomResult" style={zoomStyle}></div>
                        </div>
                        <div className="thumbnail-list" id="detailThumbnails">
                            {(product.images || [product.image]).map((img, idx) => (
                                <div 
                                    key={idx} 
                                    className={`thumb-card ${img === mainImage ? 'active' : ''}`}
                                    onClick={() => setMainImage(img)}
                                >
                                    <img src={img} alt={product.title} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Information Panel */}
                    <div className="product-info-panel">
                        <div className="brand-tag">PRETUTE ORIGINAL</div>
                        <h1 className="product-title" id="detailTitle">{product.title}</h1>
                        
                        <div className="product-rating-box">
                            <div className="stars" id="detailStars">
                                {renderStars(product.rating)}
                            </div>
                            <span className="rating-count" id="detailReviewsCount">({product.reviewsCount} Customer Reviews)</span>
                        </div>

                        {/* Price Section */}
                        <div className="price-box">
                            <span className="discount-price" id="detailDiscountPrice">₹{product.price.toFixed(2)}</span>
                            {product.originalPrice > product.price && (
                                <>
                                    <span className="original-price" id="detailOriginalPrice">₹{product.originalPrice.toFixed(2)}</span>
                                    <span className="discount-pill" id="detailDiscountPercentage">{product.discount}% OFF</span>
                                </>
                            )}
                        </div>

                        <p className="product-short-desc" id="detailShortDesc">{product.shortDesc}</p>

                        <div className="divider"></div>

                        {/* Sizes */}
                        <div className="product-variants">
                            <div className="variant-selector">
                                <span className="variant-label">Select Size:</span>
                                <div className="size-options" id="sizeOptions">
                                    {(product.sizes || ['Standard']).map(sz => (
                                        <button 
                                            key={sz} 
                                            className={`size-chip ${selectedSize === sz ? 'active' : ''}`}
                                            onClick={() => setSelectedSize(sz)}
                                        >
                                            {sz}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions Bar */}
                        <div className="purchase-actions">
                            <div className="quantity-selector">
                                <button className="qty-btn dec" onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>-</button>
                                <input type="number" className="qty-input" value={quantity} readOnly />
                                <button className="qty-btn inc" onClick={() => setQuantity(prev => prev + 1)}>+</button>
                            </div>
                            <button className="btn btn-primary" id="detailAddToCartBtn" onClick={handleAddToCart}>
                                <i className="fa-solid fa-bag-shopping"></i> Add to Bag
                            </button>
                            <button className="btn btn-accent" id="detailBuyNowBtn" onClick={handleBuyNow}>
                                Buy Now
                            </button>
                            <button 
                                className={`wishlist-btn-round ${isWished ? 'wished' : ''}`} 
                                id="detailWishlistBtn" 
                                onClick={() => toggleWishlist(product.id)}
                                aria-label="Add to Wishlist"
                            >
                                <i className={`${isWished ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                            </button>
                        </div>

                        {/* Perks Info */}
                        <div className="product-perks">
                            <div className="perk-item">
                                <i className="fa-solid fa-truck-fast"></i>
                                <div>
                                    <strong>Free & Fast Delivery</strong>
                                    <span>Shipped in eco-friendly packaging within 2-3 business days.</span>
                                </div>
                            </div>
                            <div className="perk-item">
                                <i className="fa-solid fa-rotate-left"></i>
                                <div>
                                    <strong>Easy 30-Day Returns</strong>
                                    <span>No questions asked, pre-paid return label included in the box.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs specifications */}
                <div className="product-specs-tabs">
                    <div className="tabs-header">
                        <button className={`tab-btn ${activeTab === 'tab-description' ? 'active' : ''}`} onClick={() => setActiveTab('tab-description')}>Description</button>
                        <button className={`tab-btn ${activeTab === 'tab-specifications' ? 'active' : ''}`} onClick={() => setActiveTab('tab-specifications')}>Specifications</button>
                        <button className={`tab-btn ${activeTab === 'tab-reviews' ? 'active' : ''}`} onClick={() => setActiveTab('tab-reviews')}>Reviews</button>
                    </div>
                    
                    <div className="tabs-content">
                        {/* Description Tab */}
                        {activeTab === 'tab-description' && (
                            <div className="tab-pane active" id="tab-description">
                                <p id="detailLongDesc">{product.longDesc}</p>
                            </div>
                        )}
                        
                        {/* Specifications Tab */}
                        {activeTab === 'tab-specifications' && (
                            <div className="tab-pane active" id="tab-specifications">
                                <table className="specs-table">
                                    <tbody id="detailSpecsTable">
                                        {Object.entries(product.specs || {}).map(([key, val]) => (
                                            <tr key={key}>
                                                <td>{key}</td>
                                                <td>{val}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        {/* Reviews Tab */}
                        {activeTab === 'tab-reviews' && (
                            <div className="tab-pane active" id="tab-reviews">
                                <div className="reviews-summary-block">
                                    <div className="average-rating">
                                        <h3 className="score">{product.rating}</h3>
                                        <div className="stars">
                                            {renderStars(product.rating)}
                                        </div>
                                        <p>Based on reviews</p>
                                    </div>
                                    <div className="rating-bars">
                                        <div className="bar-row">
                                            <span>5★</span>
                                            <div className="bar-outer"><div className="bar-inner" style={{ width: '85%' }}></div></div>
                                            <span>85%</span>
                                        </div>
                                        <div className="bar-row">
                                            <span>4★</span>
                                            <div className="bar-outer"><div className="bar-inner" style={{ width: '10%' }}></div></div>
                                            <span>10%</span>
                                        </div>
                                        <div className="bar-row">
                                            <span>3★</span>
                                            <div className="bar-outer"><div className="bar-inner" style={{ width: '5%' }}></div></div>
                                            <span>5%</span>
                                        </div>
                                        <div className="bar-row">
                                            <span>2★</span>
                                            <div className="bar-outer"><div className="bar-inner" style={{ width: '0%' }}></div></div>
                                            <span>0%</span>
                                        </div>
                                        <div className="bar-row">
                                            <span>1★</span>
                                            <div className="bar-outer"><div className="bar-inner" style={{ width: '0%' }}></div></div>
                                            <span>0%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="customer-reviews-list" id="detailReviewsList">
                                    {product.reviews && product.reviews.length > 0 ? (
                                        product.reviews.map((rev, idx) => (
                                            <div key={idx} className="review-item">
                                                <div className="review-header">
                                                    <span className="reviewer-name">{rev.name}</span>
                                                    <span className="review-date">{rev.date}</span>
                                                </div>
                                                <div className="review-stars">
                                                    {renderStars(rev.rating)}
                                                </div>
                                                <p className="review-comment">"{rev.comment}"</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No reviews yet for this product. Be the first to share your thoughts!</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="related-products-section">
                        <h3 className="related-title">You Might Also Love</h3>
                        <div className="products-grid" id="relatedProductsGrid">
                            {relatedProducts.map(rp => (
                                <ProductCard key={rp.id} product={rp} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductDetails;
