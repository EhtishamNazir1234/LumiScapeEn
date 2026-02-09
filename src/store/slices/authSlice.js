import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';
import { userService } from '../../services/user.service';

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    if (!token || !userInfo) return null;
    try {
      const currentUser = await authService.getCurrentUser();
      return currentUser;
    } catch (err) {
      authService.logout();
      return rejectWithValue(err);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, rememberMe = false }, { rejectWithValue }) => {
    try {
      const userData = await authService.login(email, password, rememberMe);
      return userData;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { getState, rejectWithValue }) => {
    const { user } = getState().auth;
    if (!user?._id) return rejectWithValue(new Error('Not authenticated'));
    try {
      const updatedUser = await userService.update(user._id, profileData);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
    isAuthenticated: false,
  },
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.isAuthenticated = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(updateProfile.pending, (state, action) => {
        const { profileImage, name, email, phone } = action.meta?.arg || {};
        if (state.user && (profileImage !== undefined || name !== undefined || email !== undefined || phone !== undefined)) {
          if (profileImage !== undefined) state.user.profileImage = profileImage;
          if (name !== undefined) state.user.name = name;
          if (email !== undefined) state.user.email = email;
          if (phone !== undefined) state.user.phone = phone;
        }
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, () => {
        /* On failure, fulfilled is not run; optimistic update remains until user retries or refreshes */
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
