import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  // ...other auth-related states
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      // Optionally clear other state too
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
