import React, { useContext, useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

const Category = () => {
    const { cat } = useParams();
    const location = useLocation();
    const { products, loading } = useContext(ShopContext);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [titleText, setTitleText] = useState('Collections');

    // Get query search param
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q');

    useEffect(() => {
        if (loading) return;

        let result = [];
        if (searchQuery) {
            const matchQuery = searchQuery.toLowerCase().trim();
            result = products.filter(p => 
                p.title.toLowerCase().includes(matchQuery) || 
                p.categoryLabel.toLowerCase().includes(matchQuery) ||
                (p.longDesc && p.longDesc.toLowerCase().includes(matchQuery))
            );
            setTitleText(`Search results for: "${searchQuery}"`);
        } else {
            if (cat === "all") {
                result = products;
                setTitleText("All Collections");
            } else {
                result = products.filter(p => p.category === cat);
                const catMap = {
                    "baby-fashion": "Baby & Kids Apparel",
                    "wooden-toys": "Montessori Play & Toys",
                    "baby-gear": "Nursery Items & Strollers",
                    "maternity": "Elegant Maternity Wear"
                };
                setTitleText(catMap[cat] || "Category Showcase");
            }
        }
        setFilteredProducts(result);
    }, [cat, searchQuery, products, loading]);

    if (loading) {
        return (
            <div className="section-container" style={{ padding: '80px 24px', textAlign: 'center' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}></i>
                <p style={{ marginTop: '16px' }}>Loading collections...</p>
            </div>
        );
    }

    return (
        <section id="searchView" className="page-view active" style={{ display: 'block' }}>
            <div className="section-container">
                <div className="search-results-header">
                    <h1 className="page-title" id="searchResultTitle">{titleText}</h1>
                    <span className="results-count" id="searchResultsCount">{filteredProducts.length} items found</span>
                </div>
                
                {filteredProducts.length === 0 ? (
                    <div className="no-results-state" id="noResultsState" style={{ display: 'block' }}>
                        <div className="empty-message-box">
                            <div className="search-icon-circle"><i className="fa-solid fa-magnifying-glass"></i></div>
                            <h2>No Matches Found</h2>
                            <p>We couldn't find anything matching your search. Please check your spelling or try another keyword.</p>
                            <Link to="/category/all" className="btn btn-primary">Browse All Products</Link>
                        </div>
                    </div>
                ) : (
                    <div className="products-grid" id="searchProductsGrid" style={{ display: 'grid' }}>
                        {filteredProducts.map(prod => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Category;
