'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiClock, FiUser, FiPhone, FiMail, FiX, FiMessageSquare, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '@/app/contexts/AuthContext';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
}

interface Appointment {
  _id: string;
  listingId: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  appointmentDate: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export default function AppointmentModal({ isOpen, onClose, listingId }: AppointmentModalProps) {
  const { state } = useAuth();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingExisting, setIsCheckingExisting] = useState(true);
  const [existingAppointment, setExistingAppointment] = useState<Appointment | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Form state
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [fullName, setFullName] = useState(state.user?.name || '');
  const [email, setEmail] = useState(state.user?.email || '');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  // Mevcut tarih ve sonraki 14 günü oluştur
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });
  
  // Saat dilimleri (09:00 - 18:00)
  const availableTimes = Array.from({ length: 18 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });
  
  // Modal açıldığında kullanıcının bu liste için daha önce randevu oluşturup oluşturmadığını kontrol et
  useEffect(() => {
    if (isOpen && state.user) {
      checkExistingAppointment();
    }
  }, [isOpen, listingId]);
  
  // Mevcut randevuyu kontrol et
  const checkExistingAppointment = async () => {
    setIsCheckingExisting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsCheckingExisting(false);
        return;
      }
      
      const response = await fetch('/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.appointments) {
        // Bu listeleme için mevcut randevuyu kontrol et
        const appointment = data.appointments.find((a: Appointment) => a.listingId === listingId);
        
        if (appointment) {
          setExistingAppointment(appointment);
          
          // Mevcut randevu bilgilerini form alanlarına doldur
          const appointmentDate = new Date(appointment.appointmentDate);
          const dateStr = appointmentDate.toISOString().split('T')[0];
          const hours = appointmentDate.getHours().toString().padStart(2, '0');
          const minutes = appointmentDate.getMinutes().toString().padStart(2, '0');
          const timeStr = `${hours}:${minutes}`;
          
          setSelectedDate(dateStr);
          setSelectedTime(timeStr);
          setFullName(appointment.fullName);
          setEmail(appointment.email);
          setPhone(appointment.phone);
          setNotes(appointment.notes || '');
        }
      }
    } catch (error) {
      console.error('Mevcut randevuları kontrol ederken hata:', error);
    } finally {
      setIsCheckingExisting(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleNextStep = () => {
    if (currentStep === 1 && (!selectedDate || !selectedTime)) {
      setError('Lütfen tarih ve saat seçiniz');
      return;
    }
    
    setError('');
    setCurrentStep(currentStep + 1);
  };
  
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleEnterEditMode = () => {
    setIsEditMode(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !phone) {
      setError('Lütfen tüm alanları doldurunuz');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Randevu tarihi oluştur
      const [year, month, day] = selectedDate.split('-').map(Number);
      const [hour, minute] = selectedTime.split(':').map(Number);
      
      const appointmentDateTime = new Date(year, month - 1, day, hour, minute);
      
      // API isteği yap
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      let response;
      
      if (existingAppointment && isEditMode) {
        // Mevcut randevuyu güncelle
        response = await fetch(`/api/appointments/${existingAppointment._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            fullName,
            email,
            phone,
            appointmentDate: appointmentDateTime.toISOString(),
            notes
          })
        });
      } else {
        // Yeni randevu oluştur
        response = await fetch('/api/appointments', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            listingId,
            fullName,
            email,
            phone,
            appointmentDate: appointmentDateTime.toISOString(),
            notes
          })
        });
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          router.refresh();
        }, 3000);
      } else {
        setError(data.message || 'Randevu işlemi sırasında bir hata oluştu');
      }
    } catch (error: any) {
      console.error('Randevu işlemi hatası:', error);
      setError(error.message || 'Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  // Yükleme durumu
  if (isCheckingExisting) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
        <div className="fixed inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }} onClick={onClose}></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4">
          <div className="text-center py-10">
            <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-900">Randevu bilgileri kontrol ediliyor...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Kullanıcının bu liste için zaten bir randevusu varsa ve edit modunda değilse
  if (existingAppointment && !isEditMode) {
    const appointmentDate = new Date(existingAppointment.appointmentDate);
    const formattedDate = appointmentDate.toLocaleDateString('tr-TR');
    const formattedTime = appointmentDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
        <div className="fixed inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }} onClick={onClose}></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md m-4 overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Mevcut Randevu</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
              <p className="text-gray-900">Bu ilan için zaten bir randevunuz bulunmaktadır. Aşağıdaki seçeneklerden birini seçebilirsiniz:</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-base font-medium text-gray-900 mb-2">Randevu Bilgileri</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Tarih</p>
                  <p className="text-gray-900">{formattedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Saat</p>
                  <p className="text-gray-900">{formattedTime}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Durum</p>
                  <p className="text-gray-900">
                    {existingAppointment.status === 'pending' && 'Onay Bekliyor'}
                    {existingAppointment.status === 'confirmed' && 'Onaylandı'}
                    {existingAppointment.status === 'cancelled' && 'İptal Edildi'}
                  </p>
                </div>
                {existingAppointment.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Notlar</p>
                    <p className="text-gray-900">{existingAppointment.notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handleEnterEditMode}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FiEdit2 />
                <span>Randevuyu Düzenle</span>
              </button>
              
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }} onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl m-4 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Randevuyu Düzenle' : 'Randevu Oluştur'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="relative p-6">
          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {isEditMode ? 'Randevunuz Güncellendi!' : 'Randevunuz Oluşturuldu!'}
              </h3>
              <p className="text-gray-600 mb-6">
                Randevu detayları e-posta adresinize gönderildi. Randevu saatinden önce sizinle iletişime geçilecektir.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Kapat
              </button>
            </div>
          ) : (
            <>
              {/* Adımlar */}
              <div className="flex items-center mb-8">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                }`}>
                  <FiCalendar />
                </div>
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep > 1 ? 'bg-blue-600' : 'bg-gray-200'
                }`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                }`}>
                  <FiUser />
                </div>
              </div>
              
              {/* Hata Mesajı */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg">
                  {error}
                </div>
              )}
              
              {/* Adım 1: Tarih ve Saat Seçimi */}
              {currentStep === 1 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Randevu Tarihi ve Saati Seçin</h3>
                  
                  {/* Tarih Seçimi */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Tarih</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {availableDates.map((date, index) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const isSelected = selectedDate === dateStr;
                        
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleDateSelect(dateStr)}
                            className={`px-3 py-2 rounded-lg text-sm ${
                              isSelected 
                                ? 'bg-blue-600 text-white' 
                                : 'border border-gray-200 text-gray-900 hover:border-blue-300'
                            }`}
                          >
                            {formatDate(date)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Saat Seçimi */}
                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Saat</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {availableTimes.map((time, index) => {
                          const isSelected = selectedTime === time;
                          
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleTimeSelect(time)}
                              className={`px-3 py-2 rounded-lg text-sm ${
                                isSelected 
                                  ? 'bg-blue-600 text-white' 
                                  : 'border border-gray-200 text-gray-900 hover:border-blue-300'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Adım 2: Kişisel Bilgiler */}
              {currentStep === 2 && (
                <form onSubmit={handleSubmit}>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Kişisel Bilgilerinizi Girin</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-1">
                        Ad Soyad
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="text-gray-400" />
                        </div>
                        <input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          placeholder="Adınız ve soyadınız"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                        E-posta Adresi
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="text-gray-400" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          placeholder="ornek@mail.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1">
                        Telefon Numarası
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiPhone className="text-gray-400" />
                        </div>
                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          placeholder="05XX XXX XX XX"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-1">
                        Notlar (İsteğe Bağlı)
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FiMessageSquare className="text-gray-400" />
                        </div>
                        <textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                          placeholder="Eklemek istediğiniz notlar..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Seçilen randevu: <span className="font-medium text-gray-900">
                        {selectedDate && new Date(selectedDate).toLocaleDateString('tr-TR')} - {selectedTime}
                      </span>
                    </p>
                  </div>
                </form>
              )}
              
              {/* Footer */}
              <div className="mt-8 flex justify-between">
                {currentStep > 1 ? (
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Geri
                  </button>
                ) : (
                  <div></div>
                )}
                
                {currentStep < 2 ? (
                  <button
                    onClick={handleNextStep}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Devam Et
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    {loading ? 'İşleniyor...' : isEditMode ? 'Randevuyu Güncelle' : 'Randevu Oluştur'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// FiCheck ikonu için
const FiCheck = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
); 