import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null, 
  token: null,
  email: null,
  firstName: null,
  lastName: null,
  userType: null,
  profileImageUrl: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { id, token, email, firstName, lastName, userType, profileImageUrl } = action.payload;
      state.id = id; 
      state.token = token;
      state.email = email;
      state.firstName = firstName;
      state.lastName = lastName;
      state.userType = userType;
      state.profileImageUrl = profileImageUrl || null;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.id = null; 
      state.token = null;
      state.email = null;
      state.firstName = null;
      state.lastName = null;
      state.userType = null;
      state.profileImageUrl = null;
      state.isAuthenticated = false;
    },
    updateProfileImage(state, action) {
      state.profileImageUrl = action.payload;
    },
  },
});

export const { loginSuccess, logout, updateProfileImage } = userSlice.actions;
export default userSlice.reducer;