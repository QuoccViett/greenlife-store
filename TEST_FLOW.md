# Test Flow Guide

## ✅ Build Status: PASSED
```
✓ 100 modules transformed
✓ Built in 256ms (No errors)
```

---

## 🧪 Manual Testing Steps

### 1️⃣ **Login Flow Test**

**Steps:**
1. Go to `http://localhost:5173/login`
2. Try invalid email:
   - Input: `invalidemail`
   - Expected: "Please enter a valid email" error
3. Try valid email but short password:
   - Input: `demo@example.com` / `short`
   - Expected: "Password must be at least 6 characters" error
4. Try demo credentials:
   - Email: `demo@example.com`
   - Password: `password123`
   - Expected: Login succeeds, redirected to home

**Redux Check:**
- Open DevTools → Redux tab
- Should see `auth` state:
  ```javascript
  {
    userInfo: { id: 1, name: "John Doe", email, role },
    token: "mock_jwt_token_...",
    isLoading: false,
    error: null
  }
  ```

**localStorage Check:**
- DevTools → Application → localStorage
- Should have `token` key with value

**Navbar Check:**
- Navbar should show user name instead of "Login" button

---

### 2️⃣ **Product Page Test**

**Steps:**
1. Go to `http://localhost:5173/product/1`
2. See product details loaded
3. Try quantity:
   - Click + → Quantity increases
   - Click - → Quantity decreases
   - Can't go below 1
4. Click "Add to Cart"
   - Expected: Green toast notification "Added to cart!"

**Redux Check:**
- DevTools → Redux tab
- `cart` state should update:
  ```javascript
  {
    items: [
      {
        id: 1,
        name: "Bamboo Toothbrush Set",
        price: 15.99,
        quantity: 1
      }
    ],
    totalPrice: 15.99,
    totalQuantity: 1
  }
  ```

**Navbar Check:**
- Navbar cart icon should show "1" badge
- Badge number matches `totalQuantity`

---

### 3️⃣ **Add Multiple Items**

**Steps:**
1. On product page, set quantity to 3
2. Click "Add to Cart"
3. Change product ID in URL to `/product/2`
4. Set quantity to 2
5. Click "Add to Cart"
6. Go to cart (or check Redux)

**Expected Redux State:**
```javascript
{
  items: [
    { id: 1, name: "...", price: 15.99, quantity: 3 },
    { id: 2, name: "...", price: 19.99, quantity: 2 }
  ],
  totalQuantity: 5,
  totalPrice: 95.95
}
```

**Navbar Badge:**
- Should show "5" items

---

### 4️⃣ **Cart Functionality**

**Redux Actions Test:**
```javascript
// In browser console:

// Get cart state
store.getState().cart

// Add item manually
dispatch(addToCart({ id: 3, name: "Test", price: 10, quantity: 1 }))

// Update quantity
dispatch(updateQuantity({ id: 1, quantity: 5 }))

// Remove item
dispatch(removeFromCart(2))

// Clear cart
dispatch(clearCart())
```

---

### 5️⃣ **Forms Validation**

**Login Form:**
- ✅ Email validation (format check)
- ✅ Password min 6 chars
- ✅ Submit button disabled during loading
- ✅ Show/hide password toggle
- ✅ Error messages clear on input

---

## 🐛 Known Behaviors (Not Bugs)

| Item | Current State | Note |
|------|---------------|------|
| Product data | Mock data | Connected to real API when backend ready |
| Login response | Mock (1.5s delay) | Simulates real API delay |
| Cart persistence | RAM only | Need localStorage sync or backend |
| Related products | Placeholder grid | Need real data |
| API endpoints | Not connected | Waiting for backend |

---

## ❌ Common Issues & Fixes

### Issue: "Cannot find module" error

**Causes:**
- Wrong import path
- File not created

**Fix:**
```javascript
// ✅ Correct
import { addToCart } from "@/store/cartSlice"

// ❌ Wrong
import { addToCart } from "./store/cartSlice"
```

---

### Issue: Redux state not updating

**Causes:**
- Provider not wrapping app
- Reducer not defined
- Dispatch called wrong

**Fix - Check main.jsx:**
```javascript
<Provider store={store}>
  <App />
</Provider>
```

---

### Issue: Toast notifications not showing

**Causes:**
- ToastContainer missing
- CSS not imported
- Component not isolated

**Fix:**
```javascript
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// In component:
<ToastContainer />

// In handler:
toast.success("Message", { position: "bottom-right" })
```

---

### Issue: Navbar still shows "Login" after login

**Causes:**
- Redux state not updated
- Navbar using wrong selector

**Fix - Check Navbar:**
```javascript
const { userInfo } = useSelector(state => state.auth)

{userInfo ? (
  <span>{userInfo.name}</span>
) : (
  <Link to="/login">Login</Link>
)}
```

---

## 📊 Test Results Checklist

- [ ] Build succeeds without errors
- [ ] Login page loads
- [ ] Login validation works
- [ ] Demo login succeeds
- [ ] Redux auth state updates
- [ ] Token saved to localStorage
- [ ] Navbar shows user name
- [ ] Product page loads
- [ ] Add to cart works
- [ ] Redux cart state updates
- [ ] Navbar badge shows item count
- [ ] Toast notification appears
- [ ] Quantity selector works
- [ ] Multiple products can be added
- [ ] Total price calculates correctly

---

## 🚀 Ready for Backend Integration

Once backend is running on `http://localhost:5000/api`:

1. Update `.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

2. Uncomment real API calls in pages

3. Run tests again with real data

---

**All systems GO! 🎉**
