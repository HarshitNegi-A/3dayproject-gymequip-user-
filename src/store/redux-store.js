import { configureStore, createSlice } from "@reduxjs/toolkit";

const localToken = localStorage.getItem("token");
const localUserId = localStorage.getItem("userId");
const authInitialState = {
  login: true,
  isLoggedIn: localToken === "null" ? false : true,
  userId: localUserId,
  token: localToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    changeLogin(state) {
      state.login = !state.login;
    },
    login(state, action) {
      state.token = action.payload;
      state.isLoggedIn = !!state.token;
    },
    changeUserId(state, action) {
      state.userId = action.payload;
    },
    logout(state) {
      state.token = null;
      state.userId = null;
      state.isLoggedIn = !!state.token;
    },
  },
});

const cartInitialState = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState: cartInitialState,
  reducers: {
    addItem(state, action) {
      state.items = [...state.items, action.payload];
      
    },
    updateItem(state, action) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload; // Update item
      }
    },
    setCart(state, action) {
      state.items = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartSlice.reducer,
  },
});

export const authActions = authSlice.actions;
export const cartActions = cartSlice.actions;

export default store;
