import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext(null);

export const PROMOTIONS = {
    "PRETUTE20": { type: "flat_percent", value: 20, description: "Flat 20% Off Order" },
    "GEAR25": { type: "category_percent", category: "baby-gear", value: 25, description: "25% Off Nursery Gear" },
    "MOM15": { type: "min_spend_maternity", value: 1000, threshold: 4999, description: "₹1,000 Off Maternity (₹4,999 Min Spend)" },
    "PLAYFREE": { type: "flat_amount", value: 500, description: "Flat ₹500 Off Toys/Accessories" }
};

export const ShopContextProvider = (props) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(() => {
        const local = localStorage.getItem('pretute_cart');
        return local ? JSON.parse(local) : [];
    });
    const [wishlist, setWishlist] = useState(() => {
        const local = localStorage.getItem('pretute_wishlist');
        return local ? JSON.parse(local) : [];
    });
    const [promoApplied, setPromoApplied] = useState(() => {
        const local = localStorage.getItem('pretute_promo');
        return local ? JSON.parse(local) : null;
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [quickViewProductId, setQuickViewProductId] = useState(null);

    // Fetch products from server on mount
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch products from backend:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Sync to localStorage
    useEffect(() => {
        localStorage.setItem('pretute_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('pretute_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    useEffect(() => {
        if (promoApplied) {
            localStorage.setItem('pretute_promo', JSON.stringify(promoApplied));
        } else {
            localStorage.removeItem('pretute_promo');
        }
    }, [promoApplied]);

    // Cart Handlers
    const addToCart = (productId, quantity, size) => {
        setCart(prev => {
            const existingIndex = prev.findIndex(item => item.productId === productId && item.size === size);
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            } else {
                return [...prev, { productId, quantity, size }];
            }
        });
        showNotification("Added to bag", "success");
    };

    const updateCartQty = (index, change) => {
        setCart(prev => {
            const updated = [...prev];
            if (!updated[index]) return prev;
            updated[index].quantity += change;
            if (updated[index].quantity <= 0) {
                updated.splice(index, 1);
            }
            return updated;
        });
    };

    const removeCartItem = (index) => {
        setCart(prev => {
            const updated = [...prev];
            if (!updated[index]) return prev;
            updated.splice(index, 1);
            return updated;
        });
        showNotification("Removed from bag");
    };

    const clearCart = () => {
        setCart([]);
        setPromoApplied(null);
    };

    // Wishlist Handlers
    const toggleWishlist = (productId) => {
        setWishlist(prev => {
            const index = prev.indexOf(productId);
            if (index > -1) {
                const updated = [...prev];
                updated.splice(index, 1);
                showNotification("Removed from wishlist");
                return updated;
            } else {
                showNotification("Added to wishlist", "success");
                return [...prev, productId];
            }
        });
    };

    // Promo Code Handler
    const applyPromoCode = (code) => {
        const normalized = code.trim().toUpperCase();
        if (PROMOTIONS[normalized]) {
            setPromoApplied(normalized);
            showNotification("Coupon applied successfully!", "success");
            return { success: true, desc: PROMOTIONS[normalized].description };
        }
        return { success: false, message: "Invalid coupon code." };
    };

    // Toast notification helper
    const showNotification = (message, type = "info") => {
        const toast = document.createElement("div");
        toast.className = `toast-banner ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add("active"), 10);
        setTimeout(() => {
            toast.classList.remove("active");
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    };

    // Pricing calculation helper
    const getCartPricing = () => {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cart.reduce((sum, item) => {
            const prod = products.find(p => p.id === item.productId);
            return sum + (prod ? prod.price * item.quantity : 0);
        }, 0);

        let savings = 0;
        if (promoApplied && PROMOTIONS[promoApplied]) {
            const promo = PROMOTIONS[promoApplied];
            if (promo.type === "flat_percent") {
                savings = subtotal * (promo.value / 100);
            } else if (promo.type === "category_percent") {
                const catTotal = cart.reduce((sum, item) => {
                    const prod = products.find(p => p.id === item.productId);
                    if (prod && prod.category === promo.category) {
                        return sum + (prod.price * item.quantity);
                    }
                    return sum;
                }, 0);
                savings = catTotal * (promo.value / 100);
            } else if (promo.type === "min_spend_maternity") {
                const matTotal = cart.reduce((sum, item) => {
                    const prod = products.find(p => p.id === item.productId);
                    if (prod && prod.category === "maternity") {
                        return sum + (prod.price * item.quantity);
                    }
                    return sum;
                }, 0);
                if (matTotal >= promo.threshold) {
                    savings = promo.value;
                } else {
                    // Reset promo
                    setPromoApplied(null);
                    showNotification(`MOM15 needs ₹${promo.threshold} min spend in Maternity`, "error");
                }
            } else if (promo.type === "flat_amount") {
                savings = promo.value;
            }
        }

        const grandTotal = Math.max(0, subtotal - savings);
        return { totalCount, subtotal, savings, grandTotal };
    };

    // API Contact Submission
    const submitContactMessage = async (contactData) => {
        try {
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData)
            });
            return response.ok;
        } catch (error) {
            console.error("Failed to submit contact message:", error);
            return false;
        }
    };

    // API Booking Submission
    const submitBooking = async (bookingData) => {
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            return response.ok;
        } catch (error) {
            console.error("Failed to submit booking:", error);
            return false;
        }
    };

    // ADMIN ENDPOINTS
    const addProduct = async (productData) => {
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            if (response.ok) {
                fetchProducts();
                showNotification("Product added!", "success");
                return true;
            }
        } catch (error) {
            console.error(error);
        }
        return false;
    };

    const updateProduct = async (id, productData) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            if (response.ok) {
                fetchProducts();
                showNotification("Product updated!", "success");
                return true;
            }
        } catch (error) {
            console.error(error);
        }
        return false;
    };

    const deleteProduct = async (id) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchProducts();
                showNotification("Product deleted!");
                return true;
            }
        } catch (error) {
            console.error(error);
        }
        return false;
    };

    const getBookings = async () => {
        try {
            const response = await fetch('/api/bookings');
            if (response.ok) return await response.json();
        } catch (error) {
            console.error(error);
        }
        return [];
    };

    const updateBookingStatus = async (id, status) => {
        try {
            const response = await fetch(`/api/bookings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                showNotification("Booking status updated!", "success");
                return true;
            }
        } catch (error) {
            console.error(error);
        }
        return false;
    };

    const deleteBooking = async (id) => {
        try {
            const response = await fetch(`/api/bookings/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                showNotification("Booking deleted!");
                return true;
            }
        } catch (error) {
            console.error(error);
        }
        return false;
    };

    const getContacts = async () => {
        try {
            const response = await fetch('/api/contacts');
            if (response.ok) return await response.json();
        } catch (error) {
            console.error(error);
        }
        return [];
    };

    const deleteContact = async (id) => {
        try {
            const response = await fetch(`/api/contacts/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                showNotification("Message cleared.");
                return true;
            }
        } catch (error) {
            console.error(error);
        }
        return false;
    };

    return (
        <ShopContext.Provider value={{
            products, loading, cart, wishlist, promoApplied,
            isCartOpen, setIsCartOpen,
            isMobileSidebarOpen, setIsMobileSidebarOpen,
            quickViewProductId, setQuickViewProductId,
            addToCart, updateCartQty, removeCartItem, clearCart,
            toggleWishlist, applyPromoCode, setPromoApplied,
            getCartPricing, submitContactMessage, submitBooking, showNotification,
            addProduct, updateProduct, deleteProduct, getBookings, updateBookingStatus, deleteBooking, getContacts, deleteContact
        }}>
            {props.children}
        </ShopContext.Provider>
    );
};
