import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

const Wishlist = () => {
    const { wishlist, products } = useContext(ShopContext);

    // Filter products that exist in wishlist
    const wishedItems = products.filter(p => wishlist.includes(p.id));

    return (
        <section id="wishlistView" className="page-view active" style={{ display: 'block' }}>
            <div className="section-container">
                <h1 className="page-title">My Wishlist</h1>
                
                {wishedItems.length === 0 ? (
                    <div className="empty-wishlist-state" id="emptyWishlistState" style={{ display: 'block' }}>
                        <div className="empty-message-box">
                            <div className="wishlist-icon-circle"><i className="fa-regular fa-heart"></i></div>
                            <h2>Your Wishlist is Empty</h2>
                            <p>Save items you like here by clicking the heart button on product cards.</p>
                            <Link to="/" className="btn btn-primary">Discover Products</Link>
                        </div>
                    </div>
                ) : (
                    <div className="products-grid" id="wishlistProductsGrid" style={{ display: 'grid' }}>
                        {wishedItems.map(prod => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Wishlist;
