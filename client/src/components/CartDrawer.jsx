import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';

const CartDrawer = () => {
    const { 
        cart, products, isCartOpen, setIsCartOpen, 
        updateCartQty, removeCartItem, getCartPricing 
    } = useContext(ShopContext);

    const navigate = useNavigate();
    const { totalCount, subtotal } = getCartPricing();

    const handleClose = () => {
        setIsCartOpen(false);
    };

    const handleCheckoutClick = () => {
        setIsCartOpen(false);
        navigate('/cart');
    };

    return (
        <>
            <div 
                className={`cart-drawer-overlay ${isCartOpen ? 'active' : ''}`} 
                onClick={handleClose}
            ></div>
            
            <div 
                className={`cart-drawer ${isCartOpen ? 'active' : ''}`} 
                role="dialog" 
                aria-modal="true" 
                aria-label="Shopping Cart Drawer"
            >
                <div className="drawer-header">
                    <h3>Shopping Bag (<span id="cartDrawerCount">{totalCount}</span>)</h3>
                    <button className="close-drawer-btn" onClick={handleClose} aria-label="Close Cart">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                {/* Cart Drawer Body */}
                <div className="drawer-body" id="cartDrawerBody">
                    {cart.length === 0 ? (
                        <div className="empty-cart-message">
                            <i className="fa-solid fa-basket-shopping"></i>
                            <p>Your bag is empty!</p>
                            <button 
                                className="btn btn-primary" 
                                onClick={() => { handleClose(); navigate('/'); }}
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        cart.map((item, index) => {
                            const prod = products.find(p => p.id === item.productId);
                            if (!prod) return null;
                            
                            return (
                                <div key={`${item.productId}-${item.size}`} className="cart-item-card">
                                    <Link to={`/product/${prod.id}`} onClick={handleClose}>
                                        <img src={prod.image} alt={prod.title} />
                                    </Link>
                                    <div className="item-details">
                                        <h5 className="item-title" style={{ fontSize: '0.88rem' }}>
                                            <Link to={`/product/${prod.id}`} onClick={handleClose}>
                                                {prod.title}
                                            </Link>
                                        </h5>
                                        <p className="item-meta" style={{ marginBottom: '6px' }}>Size: {item.size}</p>
                                        <div className="quantity-selector" style={{ height: '32px' }}>
                                            <button 
                                                className="qty-btn dec-drawer" 
                                                onClick={() => updateCartQty(index, -1)}
                                            >
                                                -
                                            </button>
                                            <input 
                                                type="number" 
                                                className="qty-input" 
                                                value={item.quantity} 
                                                style={{ width: '24px', fontSize: '0.85rem' }} 
                                                readOnly 
                                            />
                                            <button 
                                                className="qty-btn inc-drawer" 
                                                onClick={() => updateCartQty(index, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="item-price-block" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 0 }}>
                                        <span className="disc-price" style={{ fontSize: '0.95rem' }}>
                                            ₹{(prod.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                    <button 
                                        className="remove-item-btn" 
                                        onClick={() => removeCartItem(index)}
                                        style={{ fontSize: '0.95rem' }} 
                                        aria-label="Remove item"
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Cart Drawer Footer */}
                {cart.length > 0 && (
                    <div className="drawer-footer" id="cartDrawerFooter">
                        <div className="subtotal-row">
                            <span>Subtotal:</span>
                            <span className="subtotal-amount" id="cartDrawerSubtotal">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <p className="shipping-notice">Shipping & taxes calculated at checkout.</p>
                        <div className="drawer-actions">
                            <Link to="/cart" className="btn btn-secondary btn-block" onClick={handleClose} id="viewCartDrawerBtn">
                                View Full Bag
                            </Link>
                            <button className="btn btn-primary btn-block" onClick={handleCheckoutClick} id="checkoutDrawerBtn">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
