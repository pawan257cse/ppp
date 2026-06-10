import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';

const Cart = () => {
    const { 
        cart, products, updateCartQty, removeCartItem, 
        promoApplied, applyPromoCode, getCartPricing, clearCart, showNotification 
    } = useContext(ShopContext);

    const navigate = useNavigate();
    const [promoInput, setPromoInput] = useState(promoApplied || '');
    const [promoFeedback, setPromoFeedback] = useState({ text: '', type: '' });
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
    const [successDetails, setSuccessDetails] = useState({ orderId: '', total: 0 });

    const { totalCount, subtotal, savings, grandTotal } = getCartPricing();

    const handleApplyPromo = () => {
        if (!promoInput.trim()) {
            setPromoFeedback({ text: 'Please enter a coupon code.', type: 'error' });
            return;
        }
        
        const result = applyPromoCode(promoInput);
        if (result.success) {
            setPromoFeedback({ text: `✓ ${result.desc}`, type: 'success' });
        } else {
            setPromoFeedback({ text: result.message, type: 'error' });
        }
    };

    const handleCheckoutSubmit = () => {
        if (cart.length === 0) return;
        
        // Generate random order ID
        const randomId = "PRT-" + Math.floor(1000000 + Math.random() * 9000000);
        
        setSuccessDetails({
            orderId: randomId,
            total: grandTotal
        });
        setShowSuccessOverlay(true);
    };

    const handleSuccessClose = () => {
        clearCart();
        setShowSuccessOverlay(false);
        navigate('/');
    };

    return (
        <section id="cartView" className="page-view active" style={{ display: 'block' }}>
            <div className="section-container">
                <h1 className="page-title">Shopping Bag</h1>
                
                {cart.length === 0 ? (
                    <div className="empty-cart-page" id="emptyCartPage" style={{ display: 'block' }}>
                        <div className="empty-message-box">
                            <div className="cart-icon-circle"><i className="fa-solid fa-basket-shopping"></i></div>
                            <h2>Your Shopping Bag is Empty</h2>
                            <p>Explore our beautiful collections of children apparel, high-quality wooden toys, nursery items, and maternity wear.</p>
                            <Link to="/" className="btn btn-primary">Go to Home</Link>
                        </div>
                    </div>
                ) : (
                    <div className="cart-layout" id="cartPageLayout" style={{ display: 'grid' }}>
                        {/* Left: Cart Items List */}
                        <div className="cart-items-wrapper">
                            <div className="cart-items-list" id="cartPageItemsList">
                                {cart.map((item, index) => {
                                    const prod = products.find(p => p.id === item.productId);
                                    if (!prod) return null;
                                    
                                    return (
                                        <div key={`${item.productId}-${item.size}`} className="cart-item-card">
                                            <Link to={`/product/${prod.id}`}>
                                                <img src={prod.image} alt={prod.title} />
                                            </Link>
                                            <div className="item-details">
                                                <h4 className="item-title">
                                                    <Link to={`/product/${prod.id}`}>{prod.title}</Link>
                                                </h4>
                                                <p className="item-meta">Size: <strong>{item.size}</strong></p>
                                                <div className="quantity-selector">
                                                    <button className="qty-btn dec" onClick={() => updateCartQty(index, -1)}>-</button>
                                                    <input type="number" className="qty-input" value={item.quantity} readOnly />
                                                    <button className="qty-btn inc" onClick={() => updateCartQty(index, 1)}>+</button>
                                                </div>
                                            </div>
                                            <div className="item-price-block">
                                                <span className="disc-price">₹{(prod.price * item.quantity).toFixed(2)}</span>
                                                {prod.originalPrice > prod.price && (
                                                    <span className="orig-price">₹{(prod.originalPrice * item.quantity).toFixed(2)}</span>
                                                )}
                                            </div>
                                            <button 
                                                className="remove-item-btn" 
                                                onClick={() => removeCartItem(index)}
                                                aria-label="Remove item"
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: Pricing Summary */}
                        <div className="cart-summary-wrapper">
                            <div className="summary-card">
                                <h3>Order Summary</h3>
                                <div className="summary-row">
                                    <span>Bag Total ({totalCount} items)</span>
                                    <span id="cartPageSubtotal">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-row text-success">
                                    <span>Promotion Savings</span>
                                    <span id="cartPagePromoSavings">-₹{savings.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping Cost</span>
                                    <span id="cartPageShipping" className="text-success">FREE</span>
                                </div>
                                <div className="divider"></div>
                                
                                {/* Coupon Code Application Box */}
                                <div className="promo-input-wrapper">
                                    <input 
                                        type="text" 
                                        placeholder="Enter coupon code" 
                                        className="promo-field"
                                        value={promoInput}
                                        onChange={(e) => setPromoInput(e.target.value)}
                                    />
                                    <button className="btn btn-secondary btn-apply" onClick={handleApplyPromo}>Apply</button>
                                </div>
                                {promoFeedback.text && (
                                    <div className={`promo-feedback ${promoFeedback.type === 'success' ? 'text-success' : 'text-danger'}`} style={{ display: 'block' }}>
                                        {promoFeedback.text}
                                    </div>
                                )}

                                <div className="divider"></div>
                                <div className="summary-row grand-total">
                                    <span>Order Total:</span>
                                    <span id="cartPageGrandTotal">₹{grandTotal.toFixed(2)}</span>
                                </div>

                                <button className="btn btn-primary btn-block checkout-trigger-btn" onClick={handleCheckoutSubmit}>
                                    Secure Checkout
                                </button>
                                
                                <div className="trust-badges">
                                    <span><i className="fa-solid fa-lock"></i> SSL Secured</span>
                                    <span><i className="fa-solid fa-shield"></i> Safe Payments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Success Overlay */}
                {showSuccessOverlay && (
                    <div className="success-screen-overlay active" id="successScreenOverlay" style={{ display: 'flex' }}>
                        <div className="success-card">
                            <div className="success-check-circle"><i className="fa-solid fa-check"></i></div>
                            <h2>Order Placed Successfully!</h2>
                            <p>Thank you for shopping with <strong>PRETUTE</strong>. We've sent a confirmation email containing details and tracking links to your registered email address.</p>
                            <div className="summary-receipt">
                                <p><strong>Order ID:</strong> <span id="successOrderId">{successDetails.orderId}</span></p>
                                <p><strong>Amount Paid:</strong> <span id="successTotalPaid">₹{successDetails.total.toFixed(2)}</span></p>
                            </div>
                            <button className="btn btn-primary" onClick={handleSuccessClose}>Continue Shopping</button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Cart;
