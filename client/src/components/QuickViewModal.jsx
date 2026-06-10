import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';

const QuickViewModal = () => {
    const { 
        products, quickViewProductId, setQuickViewProductId, 
        addToCart, setIsCartOpen 
    } = useContext(ShopContext);

    const navigate = useNavigate();

    const product = products.find(p => p.id === quickViewProductId);

    if (!product) return null;

    const handleClose = () => {
        setQuickViewProductId(null);
    };

    const handleAddToCart = () => {
        addToCart(product.id, 1, product.sizes && product.sizes[0] ? product.sizes[0] : "Standard");
        handleClose();
        setIsCartOpen(true);
    };

    const handleViewDetails = () => {
        handleClose();
        navigate(`/product/${product.id}`);
    };

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

    return (
        <div className="modal-overlay active" id="quickViewOverlay" onClick={handleClose}>
            <div className="modal-container" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal-btn" onClick={handleClose} aria-label="Close Quick View">&times;</button>
                <div className="modal-content" id="quickViewContent">
                    <div className="product-details-layout" style={{ marginBottom: 0, padding: 0, border: 'none' }}>
                        <div className="product-gallery">
                            <div className="main-image-container" style={{ cursor: 'default' }}>
                                <img src={product.image} alt={product.title} />
                            </div>
                        </div>
                        <div className="product-info-panel">
                            <div className="brand-tag">PRETUTE ORIGINAL</div>
                            <h1 className="product-title" style={{ fontSize: '1.8rem' }}>{product.title}</h1>
                            <div className="product-rating-box" style={{ marginBottom: '12px' }}>
                                <div className="stars">
                                    {renderStars(product.rating)}
                                </div>
                            </div>
                            <div className="price-box" style={{ marginBottom: '12px' }}>
                                <span className="discount-price" style={{ fontSize: '1.8rem' }}>₹{product.price.toFixed(2)}</span>
                                {product.originalPrice > product.price && (
                                    <span className="original-price" style={{ fontSize: '1.1rem' }}>₹{product.originalPrice.toFixed(2)}</span>
                                )}
                            </div>
                            <p className="product-short-desc" style={{ marginBottom: '20px' }}>{product.shortDesc}</p>
                            <div className="purchase-actions" style={{ marginBottom: 0 }}>
                                <button className="btn btn-primary modal-add-to-cart-btn" onClick={handleAddToCart}>
                                    <i className="fa-solid fa-bag-shopping"></i> Add to Bag
                                </button>
                                <button className="btn btn-outline modal-view-details-btn" onClick={handleViewDetails}>
                                    Full Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;
