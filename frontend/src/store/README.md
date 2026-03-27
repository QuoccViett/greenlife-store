# Redux Store Setup - Hướng Dẫn Sử Dụng

## 📁 Cấu trúc Store

```
src/store/
├── index.js              # Redux store configuration
├── cartSlice.js         # Cart state & actions
├── authSlice.js         # Auth state & actions  
└── wishlistSlice.js     # Wishlist state & actions
```

---

## 🛒 Cart Slice

### State:
```javascript
{
  items: [
    { id, name, price, image, quantity }
  ],
  totalPrice: 0,
  totalQuantity: 0
}
```

### Actions:
```javascript
import { addToCart, removeFromCart, updateQuantity, clearCart } from "@/store/cartSlice";
import { useDispatch } from "react-redux";

const dispatch = useDispatch();

// Add item
dispatch(addToCart({ id: 1, name: "Product", price: 100, image: "url", quantity: 1 }));

// Remove item
dispatch(removeFromCart(1));

// Update quantity
dispatch(updateQuantity({ id: 1, quantity: 5 }));

// Clear all
dispatch(clearCart());
```

### Usage in Component:
```javascript
import { useSelector } from "react-redux";

const MyComponent = () => {
  const cart = useSelector(state => state.cart);
  const totalItems = useSelector(state => state.cart.totalQuantity);
  
  return <div>{totalItems} items in cart</div>;
};
```

---

## 👤 Auth Slice

### State:
```javascript
{
  userInfo: null,      // { id, name, email, role }
  isLoading: false,
  error: null,
  token: null          // Stored in localStorage
}
```

### Actions:
```javascript
import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  setUserInfo 
} from "@/store/authSlice";

// Login process
dispatch(loginStart());
dispatch(loginSuccess({ 
  userInfo: userData, 
  token: jwtToken 
}));

// Logout
dispatch(logout());

// Set user info
dispatch(setUserInfo(userData));
```

### Usage in Component (Navbar example):
```javascript
const userInfo = useSelector(state => state.auth.userInfo);

{userInfo ? (
  <span>{userInfo.name}</span>
) : (
  <Link to="/login">Login</Link>
)}
```

---

## ❤️ Wishlist Slice

### State:
```javascript
{
  items: [
    { id, name, price, image }
  ]
}
```

### Actions:
```javascript
import { addToWishlist, removeFromWishlist } from "@/store/wishlistSlice";

// Add to wishlist
dispatch(addToWishlist({ id: 1, name: "Product", price: 100, image: "url" }));

// Remove from wishlist
dispatch(removeFromWishlist(1));
```

---

## 🔗 Navbar Integration

Navbar hiện đang sử dụng Redux:

```javascript
const cartItems = useSelector(state => state.cart.items);
const { userInfo } = useSelector(state => state.auth);

const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
```

✅ **Navbar sẽ tự động cập nhật khi cart hoặc user thay đổi!**

---

## 📝 Ví dụ: Add to Cart Flow

```javascript
// ProductCard.jsx
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    }));
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
};
```

---

## ⚙️ Thêm Redux DevTools (Optional)

Để debug Redux, cài Redux DevTools:

```bash
npm install --save-dev @redux-devtools/extension
```

Rồi update `store/index.js`:

```javascript
import { configureStore } from "@reduxjs/toolkit";
import { composeWithDevTools } from "@redux-devtools/extension";

export const store = configureStore({
  reducer: { /* ... */ },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat([]),
}, composeWithDevTools());
```

---

## ✅ Checklist

- [x] Store setup
- [x] Redux Provider thêm vào main.jsx
- [x] Cart slice
- [x] Auth slice
- [x] Wishlist slice
- [ ] Thêm API integration (async actions)
- [ ] Add to Cart button functionality
- [ ] Login functionality
- [ ] Checkout flow

---

**Ready to use! Bắt đầu dispatch actions từ components! 🚀**
