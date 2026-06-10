import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext.jsx';

const Dashboard = () => {
    const { 
        products, addProduct, updateProduct, deleteProduct, 
        getBookings, updateBookingStatus, deleteBooking, 
        getContacts, deleteContact, showNotification 
    } = useContext(ShopContext);

    // Authentication State
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem('pretute_admin_authenticated') === 'true';
    });
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const expectedUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
        const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

        if (usernameInput.trim() === expectedUsername && passwordInput === expectedPassword) {
            setIsAuthenticated(true);
            sessionStorage.setItem('pretute_admin_authenticated', 'true');
            showNotification("Logged in successfully!", "success");
            setLoginError('');
        } else {
            setLoginError("Invalid username or password");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('pretute_admin_authenticated');
        setUsernameInput('');
        setPasswordInput('');
        showNotification("Logged out.");
    };

    const [activeTab, setActiveTab] = useState('products'); // 'products', 'bookings', 'contacts'
    const [bookings, setBookings] = useState([]);
    const [contacts, setContacts] = useState([]);
    
    // Stats
    const [stats, setStats] = useState({ products: 0, bookings: 0, contacts: 0 });

    // Modals
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // null when adding new
    
    const [productForm, setProductForm] = useState({
        title: '',
        category: 'baby-fashion',
        categoryLabel: 'Baby & Kids Wear',
        image: 'assets/prod_romper.png',
        price: '',
        originalPrice: '',
        discount: '',
        shortDesc: '',
        longDesc: '',
        sizes: '0-3M, 3-6M, 6-12M',
        specsMaterial: '100% Organic Cotton',
        specsOrigin: 'Handcrafted in Portugal'
    });

    const loadData = async () => {
        if (!isAuthenticated) return;
        const b = await getBookings();
        const c = await getContacts();
        setBookings(b);
        setContacts(c);
        setStats({
            products: products.length,
            bookings: b.length,
            contacts: c.length
        });
    };

    useEffect(() => {
        loadData();
    }, [products, isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="login-page-container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 120px)',
                backgroundColor: 'var(--color-bg)',
                padding: '40px 20px'
            }}>
                <div className="contact-form-container" style={{
                    width: '100%',
                    maxWidth: '450px',
                    background: 'white',
                    padding: '40px',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 4px 20px var(--color-shadow)',
                    border: '1px solid var(--color-border)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <img src="assets/logo.png" alt="Logo" style={{ height: '40px', margin: '0 auto 16px', display: 'block' }} />
                        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-navy)', fontSize: '1.8rem', fontWeight: 700 }}>Admin Portal</h2>
                        <p style={{ color: 'var(--color-navy-light)', fontSize: '0.9rem' }}>Please log in to manage products and bookings.</p>
                    </div>

                    <form className="contact-form" onSubmit={handleLogin}>
                        {loginError && (
                            <div style={{
                                backgroundColor: '#FEE2E2',
                                color: '#EF4444',
                                padding: '12px',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.88rem',
                                marginBottom: '20px',
                                border: '1px solid #FCA5A5',
                                textAlign: 'center',
                                fontWeight: '600'
                            }}>
                                <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }}></i>
                                {loginError}
                            </div>
                        )}

                        <div className="form-group floating-label-group" style={{ marginBottom: '20px' }}>
                            <input 
                                type="text" 
                                required 
                                placeholder=" " 
                                className="form-input" 
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value)}
                            />
                            <label>Username</label>
                        </div>

                        <div className="form-group floating-label-group" style={{ marginBottom: '30px' }}>
                            <input 
                                type="password" 
                                required 
                                placeholder=" " 
                                className="form-input" 
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                            />
                            <label>Password</label>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block btn-submit" style={{ padding: '14px 24px', fontSize: '1rem' }}>
                            <span>Login to Dashboard</span> <i className="fa-solid fa-right-to-bracket"></i>
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Handle Tab Switch
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Open Add Product modal
    const openAddProductModal = () => {
        setEditingProduct(null);
        setProductForm({
            title: '',
            category: 'baby-fashion',
            categoryLabel: 'Baby & Kids Wear',
            image: 'assets/prod_romper.png',
            price: '',
            originalPrice: '',
            discount: '',
            shortDesc: '',
            longDesc: '',
            sizes: '0-3M, 3-6M, 6-12M',
            specsMaterial: '100% Organic Cotton',
            specsOrigin: 'Handcrafted in Portugal'
        });
        setIsProductModalOpen(true);
    };

    // Open Edit Product modal
    const openEditProductModal = (prod) => {
        setEditingProduct(prod);
        setProductForm({
            title: prod.title || '',
            category: prod.category || 'baby-fashion',
            categoryLabel: prod.categoryLabel || 'Baby & Kids Wear',
            image: prod.image || 'assets/prod_romper.png',
            price: prod.price || '',
            originalPrice: prod.originalPrice || '',
            discount: prod.discount || '',
            shortDesc: prod.shortDesc || '',
            longDesc: prod.longDesc || '',
            sizes: prod.sizes ? prod.sizes.join(', ') : 'Standard',
            specsMaterial: prod.specs && prod.specs['Material'] ? prod.specs['Material'] : '100% Organic Cotton',
            specsOrigin: prod.specs && prod.specs['Origin'] ? prod.specs['Origin'] : 'Handcrafted in Portugal'
        });
        setIsProductModalOpen(true);
    };

    // Form Field Change
    const handleProductFormChange = (e) => {
        const { name, value } = e.target;
        
        // Auto sync category Label if category changes
        if (name === 'category') {
            const catLabels = {
                'baby-fashion': 'Baby & Kids Wear',
                'wooden-toys': 'Montessori Toys',
                'baby-gear': 'Baby Gear',
                'maternity': 'Maternity'
            };
            setProductForm(prev => ({
                ...prev,
                category: value,
                categoryLabel: catLabels[value] || 'Category Showcase'
            }));
        } else {
            setProductForm(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle Save Product
    const handleSaveProduct = async (e) => {
        e.preventDefault();

        // Validate
        if (!productForm.title || !productForm.price || !productForm.originalPrice) {
            showNotification("Please fill in the product title and prices.", "error");
            return;
        }

        const sizeArray = productForm.sizes.split(',').map(s => s.trim()).filter(s => s.length > 0);
        const data = {
            title: productForm.title,
            category: productForm.category,
            categoryLabel: productForm.categoryLabel,
            image: productForm.image,
            price: parseFloat(productForm.price),
            originalPrice: parseFloat(productForm.originalPrice),
            discount: parseInt(productForm.discount) || 0,
            shortDesc: productForm.shortDesc,
            longDesc: productForm.longDesc,
            sizes: sizeArray.length > 0 ? sizeArray : ["Standard"],
            specs: {
                "Material": productForm.specsMaterial,
                "Origin": productForm.specsOrigin,
                "Care Instructions": "Machine wash cold, tumble dry low"
            }
        };

        let success = false;
        if (editingProduct) {
            success = await updateProduct(editingProduct.id, data);
        } else {
            success = await addProduct(data);
        }

        if (success) {
            setIsProductModalOpen(false);
        }
    };

    // Handle Delete Product
    const handleDeleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await deleteProduct(id);
        }
    };

    // Handle Booking Status Change
    const handleStatusChange = async (id, status) => {
        const success = await updateBookingStatus(id, status);
        if (success) {
            loadData();
        }
    };

    // Handle Delete Booking
    const handleDeleteBooking = async (id) => {
        if (window.confirm("Delete this booking registration?")) {
            const success = await deleteBooking(id);
            if (success) {
                loadData();
            }
        }
    };

    // Handle Delete Contact message
    const handleDeleteContact = async (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            const success = await deleteContact(id);
            if (success) {
                loadData();
            }
        }
    };

    return (
        <div className="dashboard-container">
            {/* Dashboard Sidebar */}
            <aside className="dashboard-sidebar">
                <h3 className="dashboard-title">PRETUTE Admin</h3>
                <nav className="dashboard-menu">
                    <button 
                        className={`dashboard-menu-btn ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => handleTabChange('products')}
                    >
                        <i className="fa-solid fa-shirt"></i> Product Manager
                    </button>
                    <button 
                        className={`dashboard-menu-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => handleTabChange('bookings')}
                    >
                        <i className="fa-solid fa-calendar-check"></i> Booking Control
                    </button>
                    <button 
                        className={`dashboard-menu-btn ${activeTab === 'contacts' ? 'active' : ''}`}
                        onClick={() => handleTabChange('contacts')}
                    >
                        <i className="fa-solid fa-envelope-open-text"></i> Message Inbox
                    </button>
                </nav>
                <button 
                    className="dashboard-menu-btn" 
                    onClick={handleLogout} 
                    style={{ marginTop: 'auto', color: '#FCA5A5', border: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'transparent' }}
                >
                    <i className="fa-solid fa-right-from-bracket"></i> Log Out
                </button>
            </aside>

            {/* Dashboard Content area */}
            <main className="dashboard-content">
                {/* Stats row */}
                <div className="dashboard-stats-grid">
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-icon stat-icon-blue">
                            <i className="fa-solid fa-boxes-stacked"></i>
                        </div>
                        <div className="dashboard-stat-info">
                            <h4>Products</h4>
                            <p>{stats.products}</p>
                        </div>
                    </div>
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-icon stat-icon-pink">
                            <i className="fa-solid fa-calendar-days"></i>
                        </div>
                        <div className="dashboard-stat-info">
                            <h4>Bookings</h4>
                            <p>{stats.bookings}</p>
                        </div>
                    </div>
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-icon stat-icon-gold">
                            <i className="fa-solid fa-comments"></i>
                        </div>
                        <div className="dashboard-stat-info">
                            <h4>Messages</h4>
                            <p>{stats.contacts}</p>
                        </div>
                    </div>
                </div>

                {/* Tab: Products */}
                {activeTab === 'products' && (
                    <div>
                        <div className="dashboard-header-row">
                            <h2 className="dashboard-view-title">Product Manager</h2>
                            <button className="btn btn-primary" onClick={openAddProductModal}>
                                <i className="fa-solid fa-plus"></i> Add Product
                            </button>
                        </div>

                        <div className="dashboard-table-container">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Product Info</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Original</th>
                                        <th>Discount</th>
                                        <th style={{ width: '120px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(prod => (
                                        <tr key={prod.id}>
                                            <td>
                                                <div className="table-product-info">
                                                    <img src={prod.image} alt={prod.title} />
                                                    <div>
                                                        <strong>{prod.title}</strong>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-navy-light)' }}>
                                                            Sizes: {prod.sizes ? prod.sizes.join(', ') : 'Standard'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{prod.categoryLabel}</td>
                                            <td><strong>₹{prod.price.toFixed(2)}</strong></td>
                                            <td><span style={{ textDecoration: 'line-through', opacity: 0.6 }}>₹{prod.originalPrice.toFixed(2)}</span></td>
                                            <td><span className="status-badge status-confirmed" style={{ fontSize: '0.7rem' }}>{prod.discount}% OFF</span></td>
                                            <td>
                                                <div className="table-actions">
                                                    <button 
                                                        className="action-btn-circle action-btn-edit" 
                                                        onClick={() => openEditProductModal(prod)}
                                                        title="Edit Product"
                                                    >
                                                        <i className="fa-solid fa-pencil"></i>
                                                    </button>
                                                    <button 
                                                        className="action-btn-circle action-btn-delete" 
                                                        onClick={() => handleDeleteProduct(prod.id)}
                                                        title="Delete Product"
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab: Bookings */}
                {activeTab === 'bookings' && (
                    <div>
                        <div className="dashboard-header-row">
                            <h2 className="dashboard-view-title">Booking Control</h2>
                        </div>

                        <div className="dashboard-table-container">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Client Info</th>
                                        <th>Service Scheduled</th>
                                        <th>Date & Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>
                                                No bookings scheduled yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        bookings.map(b => (
                                            <tr key={b.id}>
                                                <td>
                                                    <div>
                                                        <strong>{b.name}</strong>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-navy-light)' }}>{b.email}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-navy-light)' }}>{b.phone}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <strong>{b.service}</strong>
                                                        {b.notes && (
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontStyle: 'italic', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={b.notes}>
                                                                "{b.notes}"
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>{b.date}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-navy-light)' }}>{b.time}</div>
                                                </td>
                                                <td>
                                                    <select 
                                                        value={b.status} 
                                                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                                                        className="form-field-select"
                                                        style={{ 
                                                            padding: '4px 8px', 
                                                            fontSize: '0.8rem', 
                                                            width: '120px', 
                                                            fontWeight: '700',
                                                            color: b.status === 'Confirmed' ? 'var(--color-success)' : b.status === 'Cancelled' ? '#EF4444' : 'var(--color-accent-dark)'
                                                        }}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Confirmed">Confirmed</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <button 
                                                        className="action-btn-circle action-btn-delete" 
                                                        onClick={() => handleDeleteBooking(b.id)}
                                                        title="Delete Booking"
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab: Contacts */}
                {activeTab === 'contacts' && (
                    <div>
                        <div className="dashboard-header-row">
                            <h2 className="dashboard-view-title">Message Inbox</h2>
                        </div>

                        <div className="message-list-grid">
                            {contacts.length === 0 ? (
                                <p style={{ gridColumn: 'span 3', textAlign: 'center', padding: '40px' }}>
                                    No contact messages received.
                                </p>
                            ) : (
                                contacts.map(c => (
                                    <div key={c.id} className="message-card">
                                        <div>
                                            <div className="message-card-header">
                                                <h5>{c.subject}</h5>
                                                <span className="message-card-date">
                                                    {new Date(c.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="message-card-meta">
                                                From: <strong>{c.name}</strong> ({c.email}) {c.phone && `| ${c.phone}`}
                                            </div>
                                            <div className="message-card-body">
                                                {c.message}
                                            </div>
                                        </div>
                                        <button 
                                            className="btn btn-secondary btn-block" 
                                            onClick={() => handleDeleteContact(c.id)}
                                            style={{ padding: '8px 16px', fontSize: '0.85rem', color: '#EF4444', backgroundColor: '#FEE2E2' }}
                                        >
                                            <i className="fa-solid fa-trash-can"></i> Delete Message
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Product Modal (Add/Edit) */}
            {isProductModalOpen && (
                <div className="dashboard-modal-overlay" onClick={() => setIsProductModalOpen(false)}>
                    <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="dashboard-modal-header">
                            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <button className="dashboard-modal-close" onClick={() => setIsProductModalOpen(false)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSaveProduct}>
                            <div className="dashboard-modal-body">
                                <div className="dashboard-form-grid">
                                    <div className="form-field-group full-width">
                                        <label>Product Title *</label>
                                        <input 
                                            type="text" 
                                            name="title" 
                                            required 
                                            value={productForm.title} 
                                            onChange={handleProductFormChange} 
                                            className="form-field-input" 
                                        />
                                    </div>
                                    <div className="form-field-group">
                                        <label>Category</label>
                                        <select 
                                            name="category" 
                                            value={productForm.category} 
                                            onChange={handleProductFormChange} 
                                            className="form-field-select"
                                        >
                                            <option value="baby-fashion">Baby & Kids Wear</option>
                                            <option value="wooden-toys">Montessori Toys</option>
                                            <option value="baby-gear">Baby Gear</option>
                                            <option value="maternity">Maternity</option>
                                        </select>
                                    </div>
                                    <div className="form-field-group">
                                        <label>Image Source path</label>
                                        <input 
                                            type="text" 
                                            name="image" 
                                            value={productForm.image} 
                                            onChange={handleProductFormChange} 
                                            className="form-field-input" 
                                        />
                                    </div>
                                    <div className="form-field-group">
                                        <label>Sales Price (₹) *</label>
                                        <input 
                                            type="number" 
                                            name="price" 
                                            required 
                                            value={productForm.price} 
                                            onChange={handleProductFormChange} 
                                            className="form-field-input" 
                                        />
                                    </div>
                                    <div className="form-field-group">
                                        <label>Original Price (₹) *</label>
                                        <input 
                                            type="number" 
                                            name="originalPrice" 
                                            required 
                                            value={productForm.originalPrice} 
                                            onChange={handleProductFormChange} 
                                            className="form-field-input" 
                                        />
                                    </div>
                                    <div className="form-field-group">
                                        <label>Discount Percentage (%)</label>
                                        <input 
                                            type="number" 
                                            name="discount" 
                                            value={productForm.discount} 
                                            onChange={handleProductFormChange} 
                                            className="form-field-input" 
                                        />
                                    </div>
                                    <div className="form-field-group">
                                        <label>Available Sizes (comma separated)</label>
                                        <input 
                                            type="text" 
                                            name="sizes" 
                                            value={productForm.sizes} 
                                            onChange={handleProductFormChange} 
                                            className="form-field-input" 
                                        />
                                    </div>
                                    <div className="form-field-group full-width">
                                        <label>Short Description</label>
                                        <input 
                                            type="text" 
                                            name="shortDesc" 
                                            value={productForm.shortDesc} 
                                            onChange={handleProductFormChange} 
                                            className="form-field-input" 
                                        />
                                    </div>
                                    <div className="form-field-group full-width">
                                        <label>Long Description</label>
                                        <textarea 
                                            name="longDesc" 
                                            rows="3" 
                                            value={productForm.longDesc} 
                                            onChange={handleProductFormChange} 
                                            className="form-field-textarea"
                                        ></textarea>
                                    </div>
                                    <div className="form-field-group">
                                        <label>Specification: Material</label>
                                        <input 
                                            type="text" 
                                            name="specsMaterial" 
                                            value={productForm.specsMaterial} 
                                            onChange={handleProductFormChange} 
                                            className="form-field-input" 
                                        />
                                    </div>
                                    <div className="form-field-group">
                                        <label>Specification: Origin</label>
                                        <input 
                                            type="text" 
                                            name="specsOrigin" 
                                            value={productForm.specsOrigin} 
                                            onChange={handleProductFormChange} 
                                            className="form-field-input" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="dashboard-modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsProductModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
