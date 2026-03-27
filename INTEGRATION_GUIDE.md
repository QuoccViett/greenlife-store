# Integration Guide - Product & Login Pages

## 📝 Overview

Product page và Login page đã được tạo với:

- ✅ Redux integration
- ✅ Form validation
- ✅ Toast notifications
- ✅ Mock API calls (sẵn sàng cho real API)
- ✅ Responsive design

---

## 🛒 Product Page Features

### What It Does:

1. **Displays product details** - Image, name, price, description
2. **Add to Cart** - Dispatch Redux action `addToCart`
3. **Quantity selector** - Tăng/giảm số lượng
4. **Stock status** - Hiển thị tình trạng hàng
5. **Related products** - Gợi ý sản phẩm liên quan
6. **Toast notifications** - Thông báo thêm vào giỏ thành công

### Current State:

- 📦 Using **mock product data**
- 🔄 Ready for API integration

### How to Connect Real API:

**Replace this in `Product.jsx`:**

```javascript
useEffect(() => {
  const mockProduct = {
    /* ... */
  };
  setProduct(mockProduct);
}, [productId]);
```

**With real API call:**

```javascript
useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(productId);
      setProduct(response.data);
    } catch (error) {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };
  fetchProduct();
}, [productId]);
```

---

## 👤 Login Page Features

### What It Does:

1. **Email validation** - Kiểm tra format email
2. **Password validation** - Kiểm tra độ dài (min 6 chars)
3. **Show/hide password** - Toggle visibility
4. **Loading state** - Disable form during submission
5. **Error messages** - Display validation errors
6. **Redirect** - Navigate to home after login
7. **Store token** - Save JWT token to localStorage
8. **Redux dispatch** - Update auth state

### Current State:

- 📱 Using **mock API** (returns after 1.5s delay)
- 🔑 Demo credentials: `demo@example.com` / `password123`

### How to Connect Real API:

**Replace this in `Login.jsx`:**

```javascript
const response = await new Promise((resolve) => {
  setTimeout(() => {
    resolve({
      data: {
        userInfo: {
          /* ... */
        },
        token: "mock_token",
      },
    });
  }, 1500);
});
```

**With real API call:**

```javascript
const response = await authAPI.login({
  email: formData.email,
  password: formData.password,
});
```

---

## 🔗 API Integration Setup

### 1. Create `.env` file:

```bash
VITE_API_URL=http://localhost:5000/api
```

### 2. Use API functions from `utils/api.js`:

```javascript
import { authAPI, productAPI, cartAPI } from "@/utils/api";

// Login
const response = await authAPI.login(credentials);

// Get product
const product = await productAPI.getById(id);

// Add to cart
await cartAPI.addItem(item);
```

### 3. Backend API Endpoints Required:

#### Auth:

- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Register user
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout

#### Products:

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get by category
- `GET /api/products/search?q=query` - Search products

#### Cart:

- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item
- `DELETE /api/cart/remove/:productId` - Remove item
- `PUT /api/cart/update/:productId` - Update quantity

---

## 📂 File Structure

```
src/
├── pages/
│   ├── Product.jsx          # Product detail page
│   └── Login.jsx            # Login page
├── store/
│   ├── cartSlice.js         # Cart state
│   ├── authSlice.js         # Auth state
│   └── index.js             # Store config
└── utils/
    └── api.js               # API client & endpoints
```

---

## 🚀 Next Steps

### 1. Test Current Setup:

```bash
npm run dev
```

### 2. Test Features:

- ✅ Click "Add to Cart" → Should show toast
- ✅ Check Redux DevTools → Cart state updated
- ✅ Go to Login → Try demo credentials
- ✅ Check localStorage → Token saved

### 3. Connect Real Backend:

- Update `VITE_API_URL` in `.env`
- Replace mock API calls
- Test endpoints

### 4. Create Additional Pages:

- Collection page (browse products)
- Cart page (view cart items)
- Checkout page (place order)
- Profile page (user info)

---

## 🐛 Troubleshooting

### "Cannot find module" error:

- Import path issue - Check file paths
- Example: `import { addToCart } from "../store/cartSlice"`

### Redux not working:

- Verify `Provider` is wrapping app in `main.jsx`
- Check Redux DevTools if installed

### API calls failing:

- Verify `VITE_API_URL` in `.env`
- Check backend is running
- Check CORS settings on backend

### Toast not appearing:

- Verify `ToastContainer` is in component
- Import CSS: `import "react-toastify/dist/ReactToastify.css"`

---

## 💡 Tips

1. **Always use Redux for state** - Cart, auth, etc.
2. **Use API client** - All API calls through `utils/api.js`
3. **Handle errors** - Use try-catch, show toast
4. **Validate forms** - Prevent bad data submission
5. **Load states** - Disable buttons during loading

---

**Ready to connect with backend? Let me know! 🚀**
