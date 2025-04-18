'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthState, AuthAction, IUser } from '../lib/types'
import { verifyToken, validateAndLoadUser } from '../lib/jwt'
import { signIn, signOut, useSession } from 'next-auth/react'

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
  loginWithGoogle: () => Promise<void>
}>({
  state: initialState,
  dispatch: () => null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUserType: async () => {},
  loginWithGoogle: async () => {}
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
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Next-Auth session'dan kullanıcı verilerini kontrol et ve JWT token al
  useEffect(() => {
    const getGoogleToken = async (email: string) => {
      try {
        const response = await fetch(`/api/auth/session-token?email=${encodeURIComponent(email)}`, {
          method: 'GET',
        })
        
        const data = await response.json()
        
        if (!data.success) {
          console.error('Google token alma hatası:', data.message)
          return null
        }
        
        // Token'ı localStorage'a kaydet
        if (data.token) {
          localStorage.setItem('token', data.token)
          // Cookie'ye de ekle (middleware için)
          document.cookie = `token=${data.token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
          console.log('Google kullanıcısı için token kaydedildi')
          
          // Kullanıcı verisini mevcut session verisiyle birleştir
          const userData: IUser = {
            ...data.user,
            email: session?.user?.email || data.user.email,
            name: session?.user?.name || data.user.name,
            image: session?.user?.image || data.user.image,
            _id: data.user._id, // MongoDB ObjectId'yi user._id olarak kullan
          }
          
          // Kullanıcı verilerini state'e ekle
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: userData, token: data.token }
          })
          
          // Kullanıcının tipine göre yönlendirme yap
          if (data.user.userType) {
            console.log('Kullanıcı tipi mevcut, ana sayfaya yönlendiriliyor...')
            router.push('/')
          } else {
            console.log('Kullanıcı tipi belirlenmemiş, onboarding sayfasına yönlendiriliyor...')
            router.push('/onboarding')
          }
        }
        
        return data
      } catch (error) {
        console.error('Google token alma hatası:', error)
        return null
      }
    }
    
    if (status === 'authenticated' && session?.user?.email) {
      // Google ile giriş başarılı, JWT token almak için API'ye istek at
      getGoogleToken(session.user.email)
    }
  }, [session, status, router])
  
  // Local storage'dan kullanıcı bilgilerini yükleme
  useEffect(() => {
    // Eğer OAuth giriş yapıldıysa, token kontrolünü atla
    if (state.isAuthenticated) return
    
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
          // Cookie'den de sil
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          dispatch({ type: 'LOGOUT' })
          return
        }
        
        console.log('Kullanıcı verileri yüklendi:', userData)
        // Cookie'ye de ekle (middleware için)
        document.cookie = `token=${token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
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
  }, [state.isAuthenticated]) // Component mount olduğunda bir kez çalışır
  
  // Login fonksiyonu
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (!data.success) {
        console.error('Giriş başarısız:', data.message)
        throw new Error(data.message || 'Giriş yapılamadı')
      }
      
      // Token'ı localStorage'a kaydet
      if (data.token) {
        localStorage.setItem('token', data.token)
        // Cookie'ye de ekle (middleware için)
        document.cookie = `token=${data.token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
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
  
  // Google ile giriş
  const loginWithGoogle = async () => {
    try {
      // Google oturumunu başlat, sonucu döndür
      return await signIn('google', { 
        redirect: false
      })
    } catch (error: any) {
      console.error('Google giriş hatası:', error)
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message || 'Google ile giriş başarısız'
      })
      throw error
    }
  }
  
  // Register fonksiyonu
  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: 'REGISTER_START' })
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      
      const data = await response.json()
      
      if (!data.success) {
        console.error('Kayıt başarısız:', data.message)
        throw new Error(data.message || 'Kayıt yapılamadı')
      }
      
      console.log('Kayıt başarılı:', data)
      
      // Token'ı localStorage'a kaydet
      if (data.token) {
        localStorage.setItem('token', data.token)
        // Cookie'ye de ekle (middleware için)
        document.cookie = `token=${data.token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
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
    // NextAuth session'ı sonlandır
    signOut({ redirect: false }).then(() => {
      // Local storage'dan token'ı sil
      localStorage.removeItem('token')
      // Cookie'den token'ı sil
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      // State'i temizle
      dispatch({ type: 'LOGOUT' })
      // Login sayfasına yönlendir
      router.push('/auth/login')
    })
  }
  
  // Kullanıcı tipini güncelleme fonksiyonu
  const updateUserType = async (userType: 'buyer' | 'seller') => {
    try {
      // NextAuth kullanıcısı ise
      if (session?.user) {
        const response = await fetch('/api/user/nextauth-type', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            email: session.user.email, 
            userType 
          })
        })
        
        const data = await response.json()
        
        if (!data.success) {
          throw new Error(data.message || 'Kullanıcı tipi güncellenemedi')
        }
        
        dispatch({ type: 'SET_USER_TYPE', payload: userType })
        return data
      }
      
      // Normal kullanıcı ise
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
      
      dispatch({ type: 'SET_USER_TYPE', payload: userType })
      return data
    } catch (error: any) {
      console.error('Kullanıcı tipi güncelleme hatası:', error)
      throw error
    }
  }
  
  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        login,
        register,
        logout,
        updateUserType,
        loginWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook
export const useAuth = () => useContext(AuthContext)

export default AuthContext 