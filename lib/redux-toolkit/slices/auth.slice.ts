import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { JwtUser } from '~/types/common'

export interface StorageState {
  accessToken: string | null
  refreshToken: string | null
}

interface AuthState {
  isAuthenticated: boolean
  tokens: StorageState | null
  user: JwtUser | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  tokens: null,
  user: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<JwtUser>) => {
      state.user = action.payload
    },
    setTokens: (state, action: PayloadAction<StorageState>) => {
      state.tokens = action.payload
      state.isAuthenticated = true
    },
    clear: (state) => {
      state.tokens = null
      state.isAuthenticated = false
      state.user = null
    }
  }
})

export const { setTokens, clear, setUser } = authSlice.actions
export default authSlice.reducer
