'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { AuthState, AuthAction, IUser } from '../lib/types'
import { verifyToken, validateAndLoadUser } from '../lib/jwt'

// AuthContext için başlangıç değeri
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
}

// AuthContext oluşturma
const AuthContext = createContext<{
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
  login: (email: string, password: string) => Promise<any>
  register: (name: string, email: string, password: string) => Promise<any>
  logout: () => void
  updateUserType: (userType: 'buyer' | 'seller') => Promise<any>
}>({
  state: initialState,
  dispatch: () => null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUserType: async () => {}
})

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, isLoading: true, error: null }
    
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }
    
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      }
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      }
    
    case 'SET_USER_TYPE':
      return {
        ...state,
        user: state.user ? { ...state.user, userType: action.payload } : null
      }
    
    default:
      return state
  }
}

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  
  // Local storage'dan kullanıcı bilgilerini yükleme
  useEffect(() => {
    const loadUser = async () => {
      dispatch({ type: 'LOGIN_START' }) // Loading durumunu aktif et
      
      try {
        const token = localStorage.getItem('token')
        
        if (!token) {
          console.log('Token bulunamadı, kullanıcı kimliği doğrulanmadı')
          dispatch({ type: 'LOGOUT' })
          return
        }
        
        console.log('Token bulundu, doğrulanıyor:', token.substring(0, 15) + '...')
        const userData = await validateAndLoadUser(token)
        
        if (!userData) {
          console.log('Token geçersiz, kullanıcı çıkış yapıldı')
          localStorage.removeItem('token')
          dispatch({ type: 'LOGOUT' })
          return
        }
        
        console.log('Kullanıcı verileri yüklendi:', userData)
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user: userData, token }
        })
      } catch (error) {
        console.error('Kullanıcı yükleme hatası:', error)
        localStorage.removeItem('token')
        dispatch({ type: 'LOGOUT' })
      }
    }
    
    loadUser()

    // useEffect'te addEventListener ekleyip localStorage'daki değişiklikleri dinle
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        if (!e.newValue) {
          console.log('Token silindi, kullanıcı çıkış yapıldı')
          dispatch({ type: 'LOGOUT' })
        } else if (e.newValue !== e.oldValue) {
          console.log('Token değişti, kullanıcı bilgileri yeniden yükleniyor')
          loadUser()
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, []) // Component mount olduğunda bir kez çalışır
  
  // Login fonksiyonu
  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      // Debug için yanıtı konsola yazdır
      console.log('Login API yanıtı:', data)
      
      if (!data.success) {
        throw new Error(data.message || 'Giriş başarısız')
      }
      
      // Token'ı localStorage'a kaydet
      if (data.token) {
        localStorage.setItem('token', data.token)
        console.log('Token localStorage\'a kaydedildi:', data.token.substring(0, 15) + '...')
      } else {
        console.error('Token alınamadı!')
        throw new Error('Token alınamadı!')
      }
      
      // Kullanıcı verilerini state'e ekle
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: data.user, token: data.token }
      })
      
      return data // Başarılı yanıtı döndür
    } catch (error: any) {
      console.error('Login hatası:', error)
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message || 'Giriş başarısız'
      })
      throw error
    }
  }
  
  // Register fonksiyonu
  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: 'REGISTER_START' })
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      
      const data = await response.json()
      console.log('Register API yanıtı:', data)
      
      if (!data.success) {
        throw new Error(data.message || 'Kayıt başarısız')
      }
      
      // Token'ı localStorage'a kaydet
      if (data.token) {
        localStorage.setItem('token', data.token)
        console.log('Token localStorage\'a kaydedildi:', data.token.substring(0, 15) + '...')
      } else {
        console.error('Token alınamadı!')
        throw new Error('Token alınamadı!')
      }
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { user: data.user, token: data.token }
      })
      
      return data // Başarılı yanıtı döndür
    } catch (error: any) {
      console.error('Register hatası:', error)
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: error.message || 'Kayıt başarısız'
      })
      throw error
    }
  }
  
  // Logout fonksiyonu
  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
  }
  
  // Kullanıcı tipini güncelleme fonksiyonu
  const updateUserType = async (userType: 'buyer' | 'seller') => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Oturum bulunamadı')
      }
      
      const response = await fetch('/api/user/type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userType })
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Kullanıcı tipi güncellenemedi')
      }
      
      // Kullanıcı verilerini state'e güncelle
      if (state.user) {
        dispatch({
          type: 'SET_USER_TYPE',
          payload: userType
        })
        
        // Token'ı yenilememiz gerekirse burada token'ı güncelleyebiliriz
        if (data.token) {
          localStorage.setItem('token', data.token)
          console.log('Yeni token kaydedildi')
        }
      }
      
      return data
    } catch (error) {
      console.error('Kullanıcı tipi güncelleme hatası:', error)
      throw error
    }
  }
  
  return (
    <AuthContext.Provider value={{ state, dispatch, login, register, logout, updateUserType }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook
export const useAuth = () => useContext(AuthContext)

export default AuthContext 