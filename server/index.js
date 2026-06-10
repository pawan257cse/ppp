const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'data', 'db.json');

// Default product catalog seed
const DEFAULT_PRODUCTS = [
    {
        id: 1,
        title: "Organic Cotton Ribbed Romper",
        category: "baby-fashion",
        categoryLabel: "Baby & Kids Wear",
        image: "assets/prod_romper.png",
        images: ["assets/prod_romper.png", "assets/logo.png"],
        originalPrice: 1299.00,
        price: 999.00,
        discount: 23,
        rating: 4.8,
        reviewsCount: 42,
        shortDesc: "Made from ultra-soft GOTS-certified organic knit cotton, keeping your little bundle comfortable all day long. Features simple nickel-free snap buttons.",
        longDesc: "Our Organic Cotton Ribbed Romper is engineered for pure comfort. Designed to support flexible mobility and easy movements, this item features flat seams that will not irritate your child's delicate skin. The nickel-free snaps along the inseam ensure quick diaper changes without fully undressing, while the breathable knit prevents overheating. GOTS certification represents the highest environmental and social standard in organic textiles.",
        specs: {
            "Material": "100% Organic Cotton (GOTS Certified)",
            "Origin": "Handcrafted in Portugal",
            "Care Instructions": "Machine wash cold, tumble dry low",
            "Safety Standards": "OEKO-TEX Standard 100 Certified"
        },
        sizes: ["0-3M", "3-6M", "6-12M", "12-18M"],
        reviews: [
            { name: "Sarah M.", rating: 5, date: "May 24, 2026", comment: "Absolutely love the fabric quality! It is incredibly soft and washes so well without stretching out." },
            { name: "Jessica K.", rating: 4, date: "April 18, 2026", comment: "So cute! Snaps are very sturdy. Deducted one star only because shipping took 4 days." }
        ]
    },
    {
        id: 2,
        title: "Artisan Wooden Rainbow Stacker",
        category: "wooden-toys",
        categoryLabel: "Montessori Toys",
        image: "assets/prod_rainbow.png",
        images: ["assets/prod_rainbow.png", "assets/logo.png"],
        originalPrice: 1999.00,
        price: 1599.00,
        discount: 20,
        rating: 4.9,
        reviewsCount: 56,
        shortDesc: "Aesthetic wooden rainbow stacking blocks to promote creative exploration, spatial reasoning, and hand-eye coordination.",
        longDesc: "Our Waldorf-inspired rainbow stacker is handcrafted from solid FSC-certified beechwood and tinted with non-toxic, water-based stains. The soft matte texture makes it easy for little hands to stack, sort, and build. This open-ended toy can be used as bridges, tunnels, cradles for dolls, or abstract sculptures, growing alongside your child's imagination.",
        specs: {
            "Material": "Solid Sustainable Beechwood",
            "Origin": "Hand-painted in Germany",
            "Paint Style": "Toxin-Free Water-Based Stains",
            "Recommended Age": "12 Months +"
        },
        sizes: ["Standard", "Large"],
        reviews: [
            { name: "David L.", rating: 5, date: "June 02, 2026", comment: "Stunning open-ended toy! Looks beautiful on the nursery shelf and my 2-year-old plays with it every single day." },
            { name: "Emily P.", rating: 5, date: "May 10, 2026", comment: "Top tier craftsmanship. Solid wood pieces, no rough edges. Completely safe for teething toddlers." }
        ]
    },
    {
        id: 3,
        title: "AeroGlide Premium Stroller",
        category: "baby-gear",
        categoryLabel: "Baby Gear",
        image: "assets/prod_stroller.png",
        images: ["assets/prod_stroller.png", "assets/logo.png"],
        originalPrice: 14999.00,
        price: 11999.00,
        discount: 20,
        rating: 4.7,
        reviewsCount: 31,
        shortDesc: "Aesthetic, ultra-lightweight travel stroller with one-hand folding, multi-position recline, and dynamic shock absorbers.",
        longDesc: "The AeroGlide Premium Stroller is designed for the modern family on the move. Featuring a carbon graphite chassis, it is exceptionally strong yet lightweight. The water-resistant extendable UPF 50+ canopy shields your child from rain and sun, while the all-terrain puncture-proof wheels and advanced suspension deliver a smooth glide across any sidewalk.",
        specs: {
            "Frame Material": "Anodized Aerospace-Grade Aluminum",
            "Weight Capacity": "Up to 50 lbs",
            "Fold Dimensions": "20\" x 18\" x 10\" (Carry-On Approved)",
            "Safety Certification": "ASTM F833 Certified"
        },
        sizes: ["One Size"],
        reviews: [
            { name: "Michael S.", rating: 5, date: "May 29, 2026", comment: "Literally folds in one second with one hand. Fits perfectly in the overhead bin. Absolute lifesaver for travel!" },
            { name: "Rachel G.", rating: 4, date: "May 01, 2026", comment: "Very smooth steering and high-quality leather handlebar. Basket is slightly smaller than expected, but manageable." }
        ]
    },
    {
        id: 4,
        title: "Sage Linen Maternity Dress",
        category: "maternity",
        categoryLabel: "Maternity",
        image: "assets/prod_dress.png",
        images: ["assets/prod_dress.png", "assets/logo.png"],
        originalPrice: 3499.00,
        price: 2799.00,
        discount: 20,
        rating: 4.6,
        reviewsCount: 19,
        shortDesc: "Breathable organic linen midi dress featuring a flexible smocked bodice and nursing-friendly concealed zippers.",
        longDesc: "Embrace elegance and comfort throughout pregnancy and beyond. Crafted from 100% natural, breathable European flax linen, this midi dress adjusts to your changing silhouette. Hidden side zippers allow easy, discreet access for nursing, while the relaxed tier skirt drapes beautifully over a growing bump.",
        specs: {
            "Material": "100% European Flax Linen",
            "Nursing Access": "Invisible side zippers",
            "Care Instructions": "Dry clean or wash gentle cold, hang dry",
            "Features": "Smocked elastic bodice, side pockets"
        },
        sizes: ["XS", "S", "M", "L", "XL"],
        reviews: [
            { name: "Olivia R.", rating: 5, date: "June 03, 2026", comment: "The smocking makes it so comfortable! Fits perfectly at 32 weeks, and I know I can wear this postpartum too." }
        ]
    },
    {
        id: 5,
        title: "Organic Cotton Ribbed Knit Set",
        category: "baby-fashion",
        categoryLabel: "Baby & Kids Wear",
        image: "assets/prod_romper.png",
        images: ["assets/prod_romper.png", "assets/logo.png"],
        originalPrice: 1799.00,
        price: 1399.00,
        discount: 22,
        rating: 4.8,
        reviewsCount: 22,
        shortDesc: "Cozy two-piece pullover sweater and jogger pants set made from warm, breathable organic cotton yarns.",
        longDesc: "Keep your little explorer snug in this stylish knit set. Features a matching long-sleeve top and elastic-waist joggers with clean ribbed cuffs. Ideal for layering during cooler months, keeping kids comfortable in pure GOTS-certified cotton.",
        specs: {
            "Material": "100% GOTS Organic Cotton Yarn",
            "Set Includes": "1x Long-Sleeve Pullover, 1x Jogger Pants",
            "Care Instructions": "Wash inside out, lay flat to dry"
        },
        sizes: ["3-6M", "6-12M", "12-18M", "2T", "3T"],
        reviews: [
            { name: "Anna D.", rating: 5, date: "May 15, 2026", comment: "Thick knit fabric, beautiful sage color. Excellent value for a 2-piece set!" }
        ]
    },
    {
        id: 6,
        title: "Montessori Wooden Balancing Blocks",
        category: "wooden-toys",
        categoryLabel: "Montessori Toys",
        image: "assets/prod_rainbow.png",
        images: ["assets/prod_rainbow.png", "assets/logo.png"],
        originalPrice: 1199.00,
        price: 999.00,
        discount: 16,
        rating: 4.7,
        reviewsCount: 18,
        shortDesc: "Set of 10 faceted wooden stones to develop concentration, problem-solving, and hand-eye balance skills.",
        longDesc: "Unlike traditional square blocks, these gemstone-shaped balancing blocks feature asymmetrical flat surfaces that require deep focus to stack. Made from solid hardwood and coated in safe, natural pigments, they double as beautiful modern decor.",
        specs: {
            "Material": "Solid Hardwood",
            "Set Includes": "10x Blocks in various sizes & pastel shades",
            "Safety": "Non-toxic EN71 certified paint"
        },
        sizes: ["Standard (10 pcs)"],
        reviews: [
            { name: "John T.", rating: 5, date: "May 12, 2026", comment: "Extremely challenging and fun even for adults. My 4-year-old is hooked." }
        ]
    },
    {
        id: 7,
        title: "Convertible 3-in-1 Wooden Crib",
        category: "baby-gear",
        categoryLabel: "Baby Gear",
        image: "assets/prod_stroller.png",
        images: ["assets/prod_stroller.png", "assets/logo.png"],
        originalPrice: 21999.00,
        price: 17999.00,
        discount: 18,
        rating: 4.9,
        reviewsCount: 14,
        shortDesc: "Beautiful solid pine crib that easily converts from infant crib, to toddler bed, to daybed as your child grows.",
        longDesc: "Crafted from sustainably sourced New Zealand pine wood, this modern mid-century crib features clean lines and tapered legs. Adjustable mattress support positions let you lower the height as your baby begins to sit and stand.",
        specs: {
            "Material": "New Zealand Pine Wood",
            "Conversions": "Crib, Toddler Bed, Daybed (Toddler rail included)",
            "Certifications": "GREENGUARD Gold Certified"
        },
        sizes: ["Standard Crib Size"],
        reviews: [
            { name: "Sophia V.", rating: 5, date: "April 20, 2026", comment: "Beautiful styling, extremely sturdy. GREENGUARD certification was very important for us." }
        ]
    },
    {
        id: 8,
        title: "Organic Bamboo Maternity Loungewear",
        category: "maternity",
        categoryLabel: "Maternity",
        image: "assets/prod_dress.png",
        images: ["assets/prod_dress.png", "assets/logo.png"],
        originalPrice: 3299.00,
        price: 2599.00,
        discount: 21,
        rating: 4.7,
        reviewsCount: 25,
        shortDesc: "Two-piece cozy loungewear set crafted from buttery-soft, thermal-regulating organic bamboo viscose.",
        longDesc: "Relax in absolute luxury. This set includes a drape-neck short-sleeve top and elastic drawstring trousers designed to fit comfortability under or over your bump. The cooling qualities of bamboo fabric help regulate body temperature for a peaceful night's rest.",
        specs: {
            "Material": "95% Bamboo Viscose, 5% Spandex",
            "Inseam": "29 inches",
            "Features": "Hypoallergenic, Moisture-wicking"
        },
        sizes: ["S", "M", "L", "XL"],
        reviews: [
            { name: "Laura H.", rating: 5, date: "June 05, 2026", comment: "Buttery soft is an understatement. I live in these sets now!" }
        ]
    }
];

// Helper functions for file-based database
function readDB() {
    try {
        if (!fs.existsSync(dbPath)) {
            // Seed database
            fs.mkdirSync(path.dirname(dbPath), { recursive: true });
            const initialData = {
                products: DEFAULT_PRODUCTS,
                bookings: [],
                contacts: []
            };
            fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 4), 'utf8');
            return initialData;
        }
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading database:", err);
        return { products: DEFAULT_PRODUCTS, bookings: [], contacts: [] };
    }
}

function writeDB(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 4), 'utf8');
        return true;
    } catch (err) {
        console.error("Error writing database:", err);
        return false;
    }
}

// Initial call to seed database if not exists
readDB();

// --- PRODUCT ROUTING ---
app.get('/api/products', (req, res) => {
    const db = readDB();
    res.json(db.products || []);
});

app.post('/api/products', (req, res) => {
    const db = readDB();
    const newProduct = {
        id: db.products.length > 0 ? Math.max(...db.products.map(p => p.id)) + 1 : 1,
        ...req.body
    };
    
    // Ensure default shapes
    if (!newProduct.images) newProduct.images = [newProduct.image || "assets/logo.png"];
    if (!newProduct.specs) newProduct.specs = {};
    if (!newProduct.sizes) newProduct.sizes = ["Standard"];
    if (!newProduct.reviews) newProduct.reviews = [];
    if (!newProduct.reviewsCount) newProduct.reviewsCount = 0;
    if (!newProduct.rating) newProduct.rating = 5.0;
    
    db.products.push(newProduct);
    writeDB(db);
    res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const db = readDB();
    const index = db.products.findIndex(p => p.id === id);
    if (index !== -1) {
        db.products[index] = { 
            ...db.products[index], 
            ...req.body, 
            id // Protect original ID 
        };
        writeDB(db);
        res.json(db.products[index]);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const db = readDB();
    db.products = db.products.filter(p => p.id !== id);
    writeDB(db);
    res.json({ message: 'Product deleted successfully' });
});

// --- BOOKINGS ROUTING ---
app.get('/api/bookings', (req, res) => {
    const db = readDB();
    res.json(db.bookings || []);
});

app.post('/api/bookings', (req, res) => {
    const db = readDB();
    const newBooking = {
        id: db.bookings.length > 0 ? Math.max(...db.bookings.map(b => b.id)) + 1 : 1,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        ...req.body
    };
    db.bookings.push(newBooking);
    writeDB(db);
    res.status(201).json(newBooking);
});

app.put('/api/bookings/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const db = readDB();
    const index = db.bookings.findIndex(b => b.id === id);
    if (index !== -1) {
        db.bookings[index] = { 
            ...db.bookings[index], 
            ...req.body, 
            id 
        };
        writeDB(db);
        res.json(db.bookings[index]);
    } else {
        res.status(404).json({ message: 'Booking not found' });
    }
});

app.delete('/api/bookings/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const db = readDB();
    db.bookings = db.bookings.filter(b => b.id !== id);
    writeDB(db);
    res.json({ message: 'Booking deleted successfully' });
});

// --- CONTACTS ROUTING ---
app.get('/api/contacts', (req, res) => {
    const db = readDB();
    res.json(db.contacts || []);
});

app.post('/api/contacts', (req, res) => {
    const db = readDB();
    const newContact = {
        id: db.contacts.length > 0 ? Math.max(...db.contacts.map(c => c.id)) + 1 : 1,
        createdAt: new Date().toISOString(),
        ...req.body
    };
    db.contacts.push(newContact);
    writeDB(db);
    res.status(201).json(newContact);
});

app.delete('/api/contacts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const db = readDB();
    db.contacts = db.contacts.filter(c => c.id !== id);
    writeDB(db);
    res.json({ message: 'Contact message deleted successfully' });
});

// Serve frontend build in production
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
    const indexPath = path.join(clientBuildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(200).send("PRETUTE API Server (React app is building or not found. Run 'npm run build' inside client/)");
    }
});

app.listen(PORT, () => {
    console.log(`Express Server running on port ${PORT}`);
});
