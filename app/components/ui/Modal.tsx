'use client'

import { ReactNode, useEffect, useState } from 'react'
import { theme } from '@/app/theme'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setTimeout(() => {
        setIsVisible(false)
      }, 300)
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      {/* Arka plan overlay */}
      <div 
        className="absolute inset-0" 
        style={{ backgroundColor: 'rgba(0, 0, 0, .1)', backdropFilter: 'none' }}
      />
      
      {/* Modal içeriği */}
      <div 
        className={`relative bg-white rounded-lg w-[90%] max-h-[90vh] overflow-hidden shadow-xl transform transition-all duration-300 ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Başlık çubuğu */}
        <div 
          className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10"
          style={{ borderColor: theme.colors.border.main }}
        >
          <h3 
            className="text-xl font-semibold"
            style={{ color: theme.colors.text.primary }}
          >
            {title}
          </h3>
          <button
            className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Modal içeriği */}
        <div 
          className="px-8 py-6 overflow-y-auto"
          style={{ maxHeight: 'calc(90vh - 140px)' }}
        >
          {children}
        </div>
        
        {/* Alt button alanı */}
        <div 
          className="px-6 py-4 border-t border-gray-200 sticky bottom-0 bg-white"
          style={{ borderColor: theme.colors.border.main }}
        >
          <button
            className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium transition-colors"
            onClick={onClose}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
} 