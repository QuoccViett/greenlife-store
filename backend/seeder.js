const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')

const Category = require('./models/Category')
const Product = require('./models/Product')
const User = require('./models/User')
const bcrypt = require('bcryptjs')

const categories = [
    {
        name: 'Eco Home & Living',
        slug: 'eco-home-living',
        description: 'Bampoo products, kitchen tools anh cleaning supplies'
    },
    {
        name: 'Personal Care',
        slug: 'personal-care',
        description: 'Skincare, soap and shampoo bars'
    },
    {
        name: 'Reusable Bags',
        slug: 'reusable-bags',
        description: 'Tote bags and shopping bags'
    },
    {
        name: 'Zero Waste',
        slug: 'zero-waste',
        description: 'Straws, food wraps and storage'
    },
    {
        name: 'Daily Essentials',
        slug: 'daily-essentials',
        description: 'Water bottles and lunch boxes'
    },
]

const subCategories = [
    {
        name: 'Bamboo Products',
        slug: 'bamboo-products',
        parent: 'eco-home-living'
    },
    {
        name: 'Cleaning Supplies',
        slug: 'cleaning-supplies',
        parent: 'eco-home-living'
    },
    {
        name: 'Kitchen Tools',
        slug: 'kitchen-tools',
        parent: 'eco-home-living'
    },
    {
        name: 'Skincare',
        slug: 'skincare',
        parent: 'personal-care'
    },
    {
        name: 'Soap',
        slug: 'soap',
        parent: 'personal-care'
    },
    {
        name: 'Shampoo Bars',
        slug: 'shampoo-bars',
        parent: 'personal-care'
    },

    {
        name: 'Tote Bags',
        slug: 'tote-bags',
        parent: 'reusable-bags'
    },
    {
        name: 'Shopping Bags',
        slug: 'shopping-bags',
        parent: 'reusable-bags'
    },
    {
        name: 'Straws',
        slug: 'straws',
        parent: 'zero-waste'
    },
    {
        name: 'Food Wraps',
        slug: 'food-wraps',
        parent: 'zero-waste'
    },
    {
        name: 'Storage',
        slug: 'storage',
        parent: 'zero-waste'
    },
    {
        name: 'Water Bottles',
        slug: 'water-bottles',
        parent: 'daily-essentials'
    },
    {
        name: 'Lunch Boxes',
        slug: 'lunch-boxes',
        parent: 'daily-essentials'
    },
]

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected')

        await Category.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()
        console.log('Cleared old data')

        const createdCategories = await Category.insertMany(categories)
        console.log('Categories created:', createdCategories.length)

        const getCat = (slug) => createdCategories.find(c => c.slug === slug)._id

        const createdSubCategories = await Category.insertMany(
            subCategories.map(sub => ({
                name: sub.name,
                slug: sub.slug,
                parent: getCat(sub.parent),
            }))
        )
        console.log('Category sub created:', createdSubCategories.length)

        const getSub = (slug) => createdSubCategories.find(s => s.slug === slug)?._id

        const hashedPassword = await bcrypt.hash('admin123', 10)
        await User.create({
            name: 'Admin GreenLife',
            email: 'admin@greenlife.vn',
            password: hashedPassword,
            role: 'admin',
            phone: '0901234567',
            address: 'TP. Ho Chi Minh',
        })
        console.log('Admin user created: admin@greenlife.vn / admin123')

        const products = [

            // ================= ECO HOME & LIVING =================
            {
                name: 'Bamboo Cutting Board',
                description: 'Durable bamboo cutting board with natural antibacterial properties.',
                price: 35,
                salePrice: 28,
                stock: 60,
                image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
                category: getCat('eco-home-living'),
                sub: getSub('bamboo-products'),
                isFeatured: true,
                sold: 120,
            },
            {
                name: 'Reusable Paper Towels',
                description: 'Eco-friendly bamboo paper towels, washable and reusable.',
                price: 15,
                stock: 120,
                image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600',
                category: getCat('eco-home-living'),
                sub: getSub('cleaning-supplies'),
                isFeatured: false,
                sold: 300,
            },
            {
                name: 'Bamboo Dish Brush',
                description: 'Natural bamboo dish brush with durable bristles.',
                price: 12,
                stock: 80,
                image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600',
                category: getCat('eco-home-living'),
                sub: getSub('cleaning-supplies'),
                isFeatured: false,
                sold: 210,
            },
            {
                name: 'Compost Bin',
                description: 'Compact compost bin for kitchen waste.',
                price: 28,
                stock: 50,
                image: 'https://images.unsplash.com/photo-1606788075761-6f3c6b4d7b2f?w=600',
                category: getCat('eco-home-living'),
                sub: getSub('kitchen-tools'),
                isFeatured: true,
                sold: 90,
            },
            {
                name: 'Wooden Cooking Utensil Set',
                description: 'Set of eco-friendly wooden cooking utensils.',
                price: 22,
                stock: 70,
                image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
                category: getCat('eco-home-living'),
                sub: getSub('kitchen-tools'),
                isFeatured: false,
                sold: 140,
            },
            {
                name: 'Coconut Scrubber',
                description: 'Biodegradable scrubber made from coconut fibers.',
                price: 10,
                stock: 150,
                image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600',
                category: getCat('eco-home-living'),
                sub: getSub('cleaning-supplies'),
                isFeatured: false,
                sold: 260,
            },
            {
                name: 'Glass Spray Bottle',
                description: 'Reusable glass spray bottle for cleaning solutions.',
                price: 14,
                stock: 90,
                image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
                category: getCat('eco-home-living'),
                sub: getSub('cleaning-supplies'),
                isFeatured: false,
                sold: 130,
            },
            {
                name: 'Bamboo Storage Organizer',
                description: 'Stylish bamboo organizer for home storage.',
                price: 25,
                stock: 60,
                image: 'https://images.unsplash.com/photo-1616628182506-2c7b6b2d4c9c?w=600',
                category: getCat('eco-home-living'),
                sub: getSub('bamboo-products'),
                isFeatured: true,
                sold: 95,
            },
            {
                name: 'Reusable Cleaning Cloths',
                description: 'Highly absorbent reusable cleaning cloths.',
                price: 18,
                stock: 110,
                image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
                category: getCat('eco-home-living'),
                sub: getSub('cleaning-supplies'),
                isFeatured: false,
                sold: 175,
            },
            {
                name: 'Dish Drying Rack',
                description: 'Eco-friendly dish drying rack with modern design.',
                price: 35,
                stock: 40,
                image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600',
                category: getCat('eco-home-living'),
                sub: getSub('kitchen-tools'),
                isFeatured: true,
                sold: 80,
            },

            // ================= PERSONAL CARE =================
            {
                name: 'Bamboo Toothbrush',
                description: 'Eco-friendly toothbrush with soft bristles.',
                price: 5,
                stock: 300,
                image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600',
                category: getCat('personal-care'),
                sub: getSub('skincare'),
                isFeatured: true,
                sold: 500,
            },
            {
                name: 'Reusable Cotton Pads',
                description: 'Washable cotton pads for makeup removal.',
                price: 12,
                stock: 200,
                image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600',
                category: getCat('personal-care'),
                sub: getSub('skincare'),
                isFeatured: false,
                sold: 260,
            },
            {
                name: 'Natural Deodorant',
                description: 'Aluminum-free natural deodorant stick.',
                price: 14,
                stock: 90,
                image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600',
                category: getCat('personal-care'),
                sub: getSub('skincare'),
                isFeatured: true,
                sold: 180,
            },
            {
                name: 'Shampoo Bar',
                description: 'Plastic-free shampoo bar for all hair types.',
                price: 15,
                stock: 120,
                image: 'https://images.unsplash.com/photo-1631390563490-7ee95d82d668?w=600',
                category: getCat('personal-care'),
                sub: getSub('shampoo-bar'),
                isFeatured: true,
                sold: 210,
            },
            {
                name: 'Natural Soap Bar',
                description: 'Handmade soap with organic ingredients.',
                price: 8,
                stock: 200,
                image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f20c?w=600',
                category: getCat('personal-care'),
                sub: getSub('soap'),
                isFeatured: false,
                sold: 340,
            },
            {
                name: 'Face Cleansing Brush',
                description: 'Gentle facial cleansing brush with bamboo handle.',
                price: 10,
                stock: 130,
                image: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?w=600',
                category: getCat('personal-care'),
                sub: getSub('skincare'),
                isFeatured: false,
                sold: 150,
            },
            {
                name: 'Aloe Vera Gel',
                description: 'Soothing natural aloe vera gel.',
                price: 18,
                stock: 100,
                image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600',
                category: getCat('personal-care'),
                sub: getSub('skincare'),
                isFeatured: false,
                sold: 120,
            },
            {
                name: 'Lip Balm Natural',
                description: 'Moisturizing lip balm with organic oils.',
                price: 6,
                stock: 220,
                image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600',
                category: getCat('personal-care'),
                sub: getSub('skincare'),
                isFeatured: false,
                sold: 190,
            },
            {
                name: 'Reusable Razor',
                description: 'Eco-friendly stainless steel razor.',
                price: 25,
                stock: 80,
                image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=600',
                category: getCat('personal-care'),
                sub: getSub('skincare'),
                isFeatured: true,
                sold: 110,
            },
            {
                name: 'Hair Brush Bamboo',
                description: 'Natural bamboo hair brush for daily use.',
                price: 16,
                stock: 140,
                image: 'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=600',
                category: getCat('personal-care'),
                sub: getSub('skincare'),
                isFeatured: false,
                sold: 130,
            },

            // ================= REUSABLE BAGS =================
            {
                name: 'Organic Cotton Tote Bag',
                description: 'Reusable cotton tote bag for shopping.',
                price: 18,
                salePrice: 14,
                stock: 250,
                image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
                category: getCat('reusable-bags'),
                sub: getSub('tote-bags'),
                isFeatured: true,
                sold: 420,
            },
            {
                name: 'Foldable Shopping Bag',
                description: 'Compact reusable shopping bag.',
                price: 10,
                stock: 300,
                image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
                category: getCat('reusable-bags'),
                sub: getSub('shopping-bags'),
                isFeatured: true,
                sold: 350,
            },
            {
                name: 'Mesh Produce Bags',
                description: 'Reusable mesh bags for fruits and vegetables.',
                price: 16,
                stock: 180,
                image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
                category: getCat('reusable-bags'),
                sub: getSub('shopping-bags'),
                isFeatured: false,
                sold: 270,
            },
            {
                name: 'Canvas Grocery Bag',
                description: 'Durable canvas bag for groceries.',
                price: 20,
                stock: 150,
                image: 'https://images.unsplash.com/photo-1597484662317-9bd52c3c6f4b?w=600',
                category: getCat('reusable-bags'),
                sub: getSub('shopping-bags'),
                isFeatured: false,
                sold: 200,
            },
            {
                name: 'Reusable Bread Bag',
                description: 'Eco-friendly bag for storing bread.',
                price: 14,
                stock: 120,
                image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600',
                category: getCat('reusable-bags'),
                sub: getSub('shopping-bags'),
                isFeatured: false,
                sold: 95,
            },
            {
                name: 'Insulated Grocery Bag',
                description: 'Keeps food fresh during transport.',
                price: 22,
                stock: 90,
                image: 'https://images.unsplash.com/photo-1606788075761-6f3c6b4d7b2f?w=600',
                category: getCat('reusable-bags'),
                sub: getSub('shopping-bags'),
                isFeatured: true,
                sold: 140,
            },
            {
                name: 'Reusable Snack Bags',
                description: 'Washable snack storage bags.',
                price: 12,
                stock: 200,
                image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=600',
                category: getCat('reusable-bags'),
                sub: getSub('shopping-bags'),
                isFeatured: false,
                sold: 180,
            },
            {
                name: 'Drawstring Cotton Bag',
                description: 'Lightweight cotton drawstring bag.',
                price: 11,
                stock: 170,
                image: 'https://images.unsplash.com/photo-1526178613658-3f1622045557?w=600',
                category: getCat('reusable-bags'),
                sub: getSub('tote-bags'),
                isFeatured: false,
                sold: 150,
            },
            {
                name: 'Reusable Wine Bag',
                description: 'Eco-friendly wine carrier bag.',
                price: 13,
                stock: 100,
                image: 'https://images.unsplash.com/photo-1602526219047-1f1a1d9c9b5b?w=600',
                category: getCat('reusable-bags'),
                sub: getSub('shopping-bags'),
                isFeatured: false,
                sold: 80,
            },
            {
                name: 'Heavy Duty Shopping Bag',
                description: 'Extra strong reusable shopping bag.',
                price: 19,
                stock: 140,
                image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
                category: getCat('reusable-bags'),
                sub: getSub('shopping-bags'),
                isFeatured: true,
                sold: 220,
            },

            // ================= ZERO WASTE =================
            {
                name: 'Stainless Steel Straw Set',
                description: 'Reusable stainless steel straws with cleaning brush.',
                price: 12,
                stock: 300,
                image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600',
                category: getCat('zero-waste'),
                sub: getSub('straws'),
                isFeatured: true,
                sold: 600,
            },
            {
                name: 'Beeswax Food Wrap',
                description: 'Reusable food wrap made from beeswax.',
                price: 20,
                stock: 120,
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
                category: getCat('zero-waste'),
                sub: getSub('food-wraps'),
                isFeatured: true,
                sold: 200,
            },
            {
                name: 'Silicone Food Bags',
                description: 'Reusable silicone storage bags.',
                price: 22,
                stock: 140,
                image: 'https://images.unsplash.com/photo-1606813902913-38e31be8751f?w=600',
                category: getCat('zero-waste'),
                sub: getSub('storage'),
                isFeatured: false,
                sold: 160,
            },
            {
                name: 'Compostable Trash Bags',
                description: 'Biodegradable trash bags for home use.',
                price: 18,
                stock: 200,
                image: 'https://images.unsplash.com/photo-1598520106830-8c45c2035460?w=600',
                category: getCat('zero-waste'),
                sub: getSub('storage'),
                isFeatured: false,
                sold: 300,
            },
            {
                name: 'Reusable Coffee Cup',
                description: 'Eco-friendly reusable coffee cup.',
                price: 16,
                stock: 130,
                image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600',
                category: getCat('zero-waste'),
                sub: getSub('storage'),
                isFeatured: true,
                sold: 220,
            },
            {
                name: 'Bamboo Straw Set',
                description: 'Natural bamboo straws, biodegradable.',
                price: 10,
                stock: 200,
                image: 'https://images.unsplash.com/photo-1612538498456-e861df91d4d0?w=600',
                category: getCat('zero-waste'),
                sub: getSub('straws'),
                isFeatured: false,
                sold: 190,
            },
            {
                name: 'Refillable Cleaning Tablets',
                description: 'Eco cleaning tablets for spray bottles.',
                price: 14,
                stock: 160,
                image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
                category: getCat('zero-waste'),
                sub: getSub('storage'),
                isFeatured: false,
                sold: 140,
            },
            {
                name: 'Reusable Cutlery Set',
                description: 'Portable stainless steel cutlery set.',
                price: 15,
                stock: 180,
                image: 'https://images.unsplash.com/photo-1601314167099-232775b3d6fd?w=600',
                category: getCat('zero-waste'),
                sub: getSub('storage'),
                isFeatured: true,
                sold: 250,
            },
            {
                name: 'Eco Dish Soap Bar',
                description: 'Solid dish soap bar with natural ingredients.',
                price: 9,
                stock: 220,
                image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f20c?w=600',
                category: getCat('zero-waste'),
                sub: getSub('storage'),
                isFeatured: false,
                sold: 210,
            },
            {
                name: 'Reusable Dryer Balls',
                description: 'Wool dryer balls to reduce drying time.',
                price: 18,
                stock: 150,
                image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
                category: getCat('zero-waste'),
                sub: getSub('storage'),
                isFeatured: false,
                sold: 170,
            },

            // ================= DAILY ESSENTIALS =================
            {
                name: 'Insulated Water Bottle',
                description: 'Keeps drinks cold or hot for hours.',
                price: 30,
                salePrice: 25,
                stock: 120,
                image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
                category: getCat('daily-essentials'),
                sub: getSub('water-bottles'),
                isFeatured: true,
                sold: 400,
            },
            {
                name: 'Bamboo Lunch Box',
                description: 'Eco-friendly lunch box made from bamboo fiber.',
                price: 26,
                stock: 90,
                image: 'https://images.unsplash.com/photo-1611601322175-ef8ec8c85f01?w=600',
                category: getCat('daily-essentials'),
                sub: getSub('lunch-boxes'),
                isFeatured: true,
                sold: 230,
            },
            {
                name: 'Glass Water Bottle',
                description: 'Reusable glass water bottle with bamboo lid.',
                price: 28,
                stock: 70,
                image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
                category: getCat('daily-essentials'),
                sub: getSub('water-bottles'),
                isFeatured: false,
                sold: 150,
            },
            {
                name: 'Travel Coffee Mug',
                description: 'Reusable insulated travel mug.',
                price: 20,
                stock: 140,
                image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600',
                category: getCat('daily-essentials'),
                sub: getSub('water-bottles'),
                isFeatured: true,
                sold: 210,
            },
            {
                name: 'Reusable Food Container',
                description: 'Eco-friendly food storage container.',
                price: 18,
                stock: 110,
                image: 'https://images.unsplash.com/photo-1571942676516-bcab84649e44?w=600',
                category: getCat('daily-essentials'),
                sub: getSub('lunch-boxes'),
                isFeatured: false,
                sold: 130,
            },
            {
                name: 'Thermal Lunch Bag',
                description: 'Insulated lunch bag for daily use.',
                price: 22,
                stock: 100,
                image: 'https://images.unsplash.com/photo-1606788075761-6f3c6b4d7b2f?w=600',
                category: getCat('daily-essentials'),
                sub: getSub('lunch-boxes'),
                isFeatured: false,
                sold: 120,
            },
            {
                name: 'Portable Utensil Set',
                description: 'Compact utensil set for travel.',
                price: 15,
                stock: 160,
                image: 'https://images.unsplash.com/photo-1601314167099-232775b3d6fd?w=600',
                category: getCat('daily-essentials'),
                sub: getSub('lunch-boxes'),
                isFeatured: true,
                sold: 180,
            },
            {
                name: 'Eco Notebook',
                description: 'Notebook made from recycled paper.',
                price: 12,
                stock: 200,
                image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600',
                category: getCat('daily-essentials'),
                sub: getSub('lunch-boxes'),
                isFeatured: false,
                sold: 160,
            },
            {
                name: 'Reusable Face Mask',
                description: 'Washable and reusable face mask.',
                price: 8,
                stock: 300,
                image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=600',
                category: getCat('daily-essentials'),
                sub: getSub('lunch-boxes'),
                isFeatured: false,
                sold: 220,
            },
            {
                name: 'Eco Backpack',
                description: 'Backpack made from recycled materials.',
                price: 45,
                stock: 70,
                image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
                category: getCat('daily-essentials'),
                sub: getSub('lunch-boxes'),
                isFeatured: true,
                sold: 95,
            },

        ]

        await Product.insertMany(products)
        console.log(`Created ${products.length} products`)
        console.log('Seeding completed!')
        process.exit(0)
    } catch (err) {
        console.error('Seeding error:', err)
        process.exit(1)
    }
}

seedDB()