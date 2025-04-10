'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiCheck, FiX, FiClock, FiCalendar, FiUser, FiMail, FiPhone, FiMessageSquare, FiFilter } from 'react-icons/fi'

interface Appointment {
  _id: string
  listingId: {
    _id: string
    brandName: string
    location: string
    category: string
  }
  userId: string
  fullName: string
  email: string
  phone: string
  appointmentDate: string
  notes: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export default function AppointmentRequestsPage() {
  const { state } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  useEffect(() => {
    // Admin değilse ana sayfaya yönlendir
    if (state.user?.userType !== 'admin') {
      router.push('/')
      return
    }
    
    fetchAppointments()
  }, [state.user, router, statusFilter])
  
  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.error('Token bulunamadı!')
        return
      }
      
      let url = '/api/admin/appointments'
      if (statusFilter) {
        url += `?status=${statusFilter}`
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setAppointments(data.appointments)
      } else {
        console.error('Randevu talepleri getirilemedi:', data.message)
      }
    } catch (error) {
      console.error('Randevu talepleri getirme hatası:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const updateAppointmentStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        alert('Oturum bulunamadı! Lütfen tekrar giriş yapın.')
        return
      }
      
      const response = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(`Randevu ${status === 'confirmed' ? 'onaylandı' : status === 'cancelled' ? 'iptal edildi' : 'beklemede olarak işaretlendi'}!`)
        // Listeyi güncelle
        fetchAppointments()
      } else {
        alert(`İşlem sırasında bir hata oluştu: ${data.message}`)
      }
    } catch (error) {
      console.error('İşlem hatası:', error)
      alert('İşlem sırasında bir hata oluştu')
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const getStatusName = (status: string) => {
    switch (status) {
      case 'pending': return 'Onay Bekliyor'
      case 'confirmed': return 'Onaylandı'
      case 'cancelled': return 'İptal Edildi'
      default: return status
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'confirmed': return 'bg-green-50 text-green-700 border-green-200'
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }
  
  return (
    <div className="min-h-screen bg-[#a9e4e8] bg-opacity-20 py-4 sm:py-8 md:py-12">
      <div className="w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] xl:w-[70%] mx-auto">
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-sm">
          {/* Başlık */}
          <div className="flex flex-wrap items-center justify-between mb-3 sm:mb-6 gap-2">
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => router.push('/')}
                className="p-1 sm:p-2 hover:bg-gray-100 rounded-full"
              >
                <FiArrowLeft size={16} className="sm:hidden" />
                <FiArrowLeft size={20} className="hidden sm:block" />
              </button>
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">Randevu Talepleri</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 text-blue-700 py-0.5 sm:py-1 px-2 sm:px-3 rounded-md sm:rounded-lg text-xs sm:text-sm">
                {appointments.length} Randevu
              </div>
              <button 
                className="sm:hidden p-1 bg-gray-100 rounded-full text-gray-700"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <FiFilter size={16} />
              </button>
            </div>
          </div>
          
          {/* Filtreler (Desktop) */}
          <div className="mb-3 sm:mb-6 hidden sm:flex gap-2">
            <button
              onClick={() => setStatusFilter(null)}
              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm border ${
                statusFilter === null ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm border ${
                statusFilter === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              Onay Bekleyen
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm border ${
                statusFilter === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              Onaylanan
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm border ${
                statusFilter === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              İptal Edilen
            </button>
          </div>
          
          {/* Filtreler (Mobile) */}
          {showMobileFilters && (
            <div className="mb-3 sm:hidden grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setStatusFilter(null)
                  setShowMobileFilters(false)
                }}
                className={`px-2 py-1 rounded-md text-xs border ${
                  statusFilter === null ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => {
                  setStatusFilter('pending')
                  setShowMobileFilters(false)
                }}
                className={`px-2 py-1 rounded-md text-xs border ${
                  statusFilter === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                Onay Bekleyen
              </button>
              <button
                onClick={() => {
                  setStatusFilter('confirmed')
                  setShowMobileFilters(false)
                }}
                className={`px-2 py-1 rounded-md text-xs border ${
                  statusFilter === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                Onaylanan
              </button>
              <button
                onClick={() => {
                  setStatusFilter('cancelled')
                  setShowMobileFilters(false)
                }}
                className={`px-2 py-1 rounded-md text-xs border ${
                  statusFilter === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                İptal Edilen
              </button>
            </div>
          )}
          
          {/* İçerik */}
          {loading ? (
            <div className="py-10 sm:py-20 text-center">
              <p className="text-gray-500 text-sm sm:text-base">Yükleniyor...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="py-10 sm:py-20 text-center">
              <p className="text-gray-500 text-sm sm:text-base">Randevu talebi bulunmuyor.</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-6">
              {appointments.map((appointment) => (
                <div key={appointment._id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-3 sm:p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between gap-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm text-gray-500">İlan</span>
                        <span className="text-sm sm:text-base text-gray-900 font-medium">{appointment.listingId.brandName}</span>
                      </div>
                      <div className="hidden sm:block w-px h-8 bg-gray-200 mx-1 sm:mx-2"></div>
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm text-gray-500">Lokasyon</span>
                        <span className="text-sm sm:text-base text-gray-900">{appointment.listingId.location}</span>
                      </div>
                      <div className="hidden sm:block w-px h-8 bg-gray-200 mx-1 sm:mx-2"></div>
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm text-gray-500">Kategori</span>
                        <span className="text-sm sm:text-base text-gray-900">{appointment.listingId.category}</span>
                      </div>
                    </div>
                    <div className={`self-start sm:self-auto px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg border text-xs sm:text-sm ${getStatusColor(appointment.status)}`}>
                      {getStatusName(appointment.status)}
                    </div>
                  </div>
                  
                  <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <div className="flex items-start gap-2">
                      <FiCalendar className="mt-0.5 text-gray-400 flex-shrink-0" size={14} />
                      <div>
                        <span className="text-xs sm:text-sm text-gray-500 block">Randevu Tarihi</span>
                        <span className="text-xs sm:text-sm text-gray-900">{formatDate(appointment.appointmentDate)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <FiUser className="mt-0.5 text-gray-400 flex-shrink-0" size={14} />
                      <div>
                        <span className="text-xs sm:text-sm text-gray-500 block">Ad Soyad</span>
                        <span className="text-xs sm:text-sm text-gray-900">{appointment.fullName}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <FiMail className="mt-0.5 text-gray-400 flex-shrink-0" size={14} />
                      <div className="overflow-hidden">
                        <span className="text-xs sm:text-sm text-gray-500 block">E-posta</span>
                        <span className="text-xs sm:text-sm text-gray-900 truncate block">{appointment.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <FiPhone className="mt-0.5 text-gray-400 flex-shrink-0" size={14} />
                      <div>
                        <span className="text-xs sm:text-sm text-gray-500 block">Telefon</span>
                        <span className="text-xs sm:text-sm text-gray-900">{appointment.phone}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 col-span-1 sm:col-span-2">
                      <FiMessageSquare className="mt-0.5 text-gray-400 flex-shrink-0" size={14} />
                      <div>
                        <span className="text-xs sm:text-sm text-gray-500 block">Notlar</span>
                        <span className="text-xs sm:text-sm text-gray-900">{appointment.notes || 'Not belirtilmemiş'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Aksiyon Butonları */}
                  <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap justify-end gap-1 sm:gap-2">
                    {appointment.status !== 'confirmed' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                        className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-md sm:rounded-lg text-xs sm:text-sm"
                      >
                        <FiCheck size={12} className="sm:hidden" />
                        <FiCheck size={14} className="hidden sm:block" />
                        <span>Onayla</span>
                      </button>
                    )}
                    
                    {appointment.status !== 'cancelled' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                        className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-md sm:rounded-lg text-xs sm:text-sm"
                      >
                        <FiX size={12} className="sm:hidden" />
                        <FiX size={14} className="hidden sm:block" />
                        <span>İptal Et</span>
                      </button>
                    )}
                    
                    {appointment.status !== 'pending' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment._id, 'pending')}
                        className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-md sm:rounded-lg text-xs sm:text-sm"
                      >
                        <FiClock size={12} className="sm:hidden" />
                        <FiClock size={14} className="hidden sm:block" />
                        <span>Beklemede</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 