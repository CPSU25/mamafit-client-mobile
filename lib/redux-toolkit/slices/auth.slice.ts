import { createSlice } from '@reduxjs/toolkit'

export interface StorageState {
  accessToken: string | null
  refreshToken: string | null
}

interface AuthState {
  isAuthenticated: boolean
  tokens: StorageState | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  tokens: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.tokens = action.payload
      state.isAuthenticated = true
    },
    clearTokens: (state) => {
      state.tokens = null
      state.isAuthenticated = false
    }
  }
})

export const { setTokens, clearTokens } = authSlice.actions
export default authSlice.reducer
