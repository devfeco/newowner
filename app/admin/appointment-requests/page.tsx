'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiCheck, FiX, FiClock, FiCalendar, FiUser, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi'

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
    <div className="min-h-screen bg-[#a9e4e8] bg-opacity-20 py-12">
      <div className="w-[70%] mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          {/* Başlık */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Randevu Talepleri</h1>
            </div>
            <div className="bg-blue-50 text-blue-700 py-1 px-3 rounded-lg text-sm">
              {appointments.length} Randevu
            </div>
          </div>
          
          {/* Filtreler */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setStatusFilter(null)}
              className={`px-4 py-2 rounded-lg text-sm border ${
                statusFilter === null ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm border ${
                statusFilter === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              Onay Bekleyen
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`px-4 py-2 rounded-lg text-sm border ${
                statusFilter === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              Onaylanan
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-4 py-2 rounded-lg text-sm border ${
                statusFilter === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              İptal Edilen
            </button>
          </div>
          
          {/* İçerik */}
          {loading ? (
            <div className="py-20 text-center">
              <p className="text-gray-500">Yükleniyor...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-500">Randevu talebi bulunmuyor.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {appointments.map((appointment) => (
                <div key={appointment._id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">İlan</span>
                        <span className="text-gray-900 font-medium">{appointment.listingId.brandName}</span>
                      </div>
                      <div className="w-px h-8 bg-gray-200 mx-2"></div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Lokasyon</span>
                        <span className="text-gray-900">{appointment.listingId.location}</span>
                      </div>
                      <div className="w-px h-8 bg-gray-200 mx-2"></div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Kategori</span>
                        <span className="text-gray-900">{appointment.listingId.category}</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-lg border text-sm ${getStatusColor(appointment.status)}`}>
                      {getStatusName(appointment.status)}
                    </div>
                  </div>
                  
                  <div className="p-4 grid grid-cols-3 gap-4">
                    <div className="flex items-start gap-2">
                      <FiCalendar className="mt-0.5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500 block">Randevu Tarihi</span>
                        <span className="text-gray-900">{formatDate(appointment.appointmentDate)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <FiUser className="mt-0.5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500 block">Ad Soyad</span>
                        <span className="text-gray-900">{appointment.fullName}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <FiMail className="mt-0.5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500 block">E-posta</span>
                        <span className="text-gray-900">{appointment.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <FiPhone className="mt-0.5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500 block">Telefon</span>
                        <span className="text-gray-900">{appointment.phone}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 col-span-2">
                      <FiMessageSquare className="mt-0.5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500 block">Notlar</span>
                        <span className="text-gray-900">{appointment.notes || 'Not belirtilmemiş'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Aksiyon Butonları */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                    {appointment.status !== 'confirmed' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm"
                      >
                        <FiCheck size={14} />
                        <span>Onayla</span>
                      </button>
                    )}
                    
                    {appointment.status !== 'cancelled' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm"
                      >
                        <FiX size={14} />
                        <span>İptal Et</span>
                      </button>
                    )}
                    
                    {appointment.status !== 'pending' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment._id, 'pending')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg text-sm"
                      >
                        <FiClock size={14} />
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