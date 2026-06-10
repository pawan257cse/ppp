import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';

const ProductCard = ({ product }) => {
    const { wishlist, toggleWishlist, addToCart, setIsCartOpen, setQuickViewProductId } = useContext(ShopContext);

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

    const handleWishlistClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product.id);
    };

    const handleAddToCartClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product.id, 1, product.sizes && product.sizes[0] ? product.sizes[0] : "Standard");
        setIsCartOpen(true);
    };

    const handleQuickViewClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setQuickViewProductId(product.id);
    };

    return (
        <div className="product-card" data-id={product.id}>
            <div className="card-img-wrapper">
                {product.discount > 0 && (
                    <span className="card-badge">{product.discount}% OFF</span>
                )}
                <button 
                    className={`card-wishlist-btn ${isWished ? 'wished' : ''}`} 
                    onClick={handleWishlistClick}
                    aria-label="Wishlist"
                >
                    <i className={`${isWished ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                </button>
                <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.title} loading="lazy" />
                </Link>
                <div className="card-hover-actions">
                    <button className="btn btn-quickview quickview-trigger" onClick={handleQuickViewClick}>
                        Quick View
                    </button>
                </div>
            </div>
            
            <div className="card-body">
                <span className="card-category">{product.categoryLabel}</span>
                <h4 className="card-title">
                    <Link to={`/product/${product.id}`}>{product.title}</Link>
                </h4>
                <div className="card-ratings">
                    <div className="stars">
                        {renderStars(product.rating)}
                    </div>
                    <span className="rating-score">{product.rating}</span>
                </div>
                <div className="card-price-row">
                    <div className="card-prices">
                        <span className="disc-price">₹{product.price.toFixed(2)}</span>
                        {product.originalPrice > product.price && (
                            <span className="orig-price">₹{product.originalPrice.toFixed(2)}</span>
                        )}
                    </div>
                    <button 
                        className="btn-add-cart-circle add-cart-trigger" 
                        onClick={handleAddToCartClick}
                        aria-label="Add to bag"
                    >
                        <i className="fa-solid fa-basket-shopping"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
