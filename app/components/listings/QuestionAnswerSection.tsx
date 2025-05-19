'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { formatDistance } from 'date-fns'
import { tr } from 'date-fns/locale'
import { FiMessageSquare, FiLock, FiSend, FiCheck, FiUser } from 'react-icons/fi'

interface Answer {
  _id: string
  userId: {
    _id: string
    name: string
  }
  content: string
  createdAt: string
}

interface Question {
  _id: string
  userId: {
    _id: string
    name: string
  }
  question: string
  answers: Answer[]
  isAnswered: boolean
  createdAt: string
}

interface QuestionAnswerSectionProps {
  listingId: string
  isListingOwner: boolean
}

export default function QuestionAnswerSection({ listingId, isListingOwner }: QuestionAnswerSectionProps) {
  const { state } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState<{[key: string]: string}>({})
  const [submitting, setSubmitting] = useState(false)
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)

  const isLoggedIn = Boolean(state.user)
  const isPremium = state.user?.isPremium || false

  useEffect(() => {
    if (isLoggedIn && listingId) {
      fetchQuestions()
    } else {
      setLoading(false)
    }
  }, [listingId, isLoggedIn])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/listings/${listingId}/questions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()

      if (data.success) {
        setQuestions(data.questions)
      } else {
        setError(data.message || 'Sorular yüklenirken bir hata oluştu')
      }
    } catch (error) {
      setError('Sorular yüklenirken bir hata oluştu')
      console.error('Sorular getirme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newQuestion.trim()) return
    
    try {
      setSubmitting(true)
      const response = await fetch(`/api/listings/${listingId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ question: newQuestion })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setNewQuestion('')
        fetchQuestions() // Soruları yeniden yükle
      } else {
        alert(data.message || 'Soru gönderilirken bir hata oluştu')
      }
    } catch (error) {
      alert('Soru gönderilirken bir hata oluştu')
      console.error('Soru gönderme hatası:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitAnswer = async (questionId: string) => {
    if (!newAnswer[questionId]?.trim()) return
    
    try {
      setSubmitting(true)
      const response = await fetch(`/api/questions/${questionId}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newAnswer[questionId] })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setNewAnswer({...newAnswer, [questionId]: ''})
        setActiveQuestionId(null)
        fetchQuestions() // Soruları yeniden yükle
      } else {
        alert(data.message || 'Yanıt gönderilirken bir hata oluştu')
      }
    } catch (error) {
      alert('Yanıt gönderilirken bir hata oluştu')
      console.error('Yanıt gönderme hatası:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-8 mb-4 sm:mb-8 shadow-sm border border-gray-100">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-6 flex items-center gap-2">
          <FiLock className="text-gray-400" />
          <span>Soru ve Cevaplar</span>
        </h2>
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-100 flex flex-col items-center justify-center">
          <FiMessageSquare className="w-12 h-12 text-gray-300 mb-3" />
          <h3 className="text-gray-900 font-medium text-center mb-2">Bu bölümü görmek için giriş yapmalısınız</h3>
          <p className="text-gray-600 text-sm text-center mb-4">
            Satıcıya sorular sorabilmek ve diğer kullanıcıların sorularını görebilmek için giriş yapın.
          </p>
          <button 
            onClick={() => window.location.href = '/auth/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    )
  }

  if (!isPremium && !isListingOwner) {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-8 mb-4 sm:mb-8 shadow-sm border border-gray-100">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-6 flex items-center gap-2">
          <FiLock className="text-gray-400" />
          <span>Soru ve Cevaplar</span>
        </h2>
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-100 flex flex-col items-center justify-center">
          <FiMessageSquare className="w-12 h-12 text-gray-300 mb-3" />
          <h3 className="text-gray-900 font-medium text-center mb-2">Premium Üyelere Özel</h3>
          <p className="text-gray-600 text-sm text-center mb-4">
            Satıcıya sorular sorabilmek ve diğer kullanıcıların sorularını görebilmek için premium üye olmalısınız.
          </p>
          <button 
            onClick={() => window.location.href = '/premium'}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm font-medium"
          >
            Premium Üye Ol
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-8 mb-4 sm:mb-8 shadow-sm border border-gray-100">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-6 flex items-center gap-2">
        <FiMessageSquare className="text-gray-700" />
        <span>Soru ve Cevaplar</span>
      </h2>
      
      {/* Soru Gönderme Formu */}
      {!isListingOwner && (
        <div className="mb-6">
          <form onSubmit={handleSubmitQuestion} className="flex flex-col gap-2">
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Satıcıya sormak istediğiniz soruyu yazın..."
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows={3}
              disabled={submitting}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !newQuestion.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend />
                <span>Gönder</span>
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Sorular ve Cevaplar Listesi */}
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-6">
          {questions.map((question) => (
            <div key={question._id} className="border border-gray-100 rounded-lg overflow-hidden">
              {/* Soru */}
              <div className="bg-gray-50 p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-gray-200 rounded-full p-1">
                    <FiUser className="text-gray-500 w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-900 text-sm">{question.userId.name}</span>
                  <span className="text-gray-500 text-xs">
                    {formatDistance(new Date(question.createdAt), new Date(), {
                      addSuffix: true,
                      locale: tr
                    })}
                  </span>
                </div>
                <p className="text-gray-800 text-sm sm:text-base">{question.question}</p>
              </div>
              
              {/* Cevaplar */}
              {question.answers.length > 0 && (
                <div className="p-3 sm:p-4 border-t border-gray-100">
                  {question.answers.map((answer, idx) => (
                    <div key={answer._id || idx} className="mb-3 last:mb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="bg-blue-100 rounded-full p-1">
                          <FiCheck className="text-blue-500 w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{answer.userId.name} (Satıcı)</span>
                        <span className="text-gray-500 text-xs">
                          {formatDistance(new Date(answer.createdAt), new Date(), {
                            addSuffix: true,
                            locale: tr
                          })}
                        </span>
                      </div>
                      <p className="text-gray-800 text-sm sm:text-base pl-7">{answer.content}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Yanıt Formu (Sadece ilan sahibi için) */}
              {isListingOwner && !question.isAnswered && (
                <div className="p-3 sm:p-4 border-t border-gray-100">
                  {activeQuestionId === question._id ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={newAnswer[question._id] || ''}
                        onChange={(e) => setNewAnswer({...newAnswer, [question._id]: e.target.value})}
                        placeholder="Yanıtınızı yazın..."
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        rows={3}
                        disabled={submitting}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setActiveQuestionId(null)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm"
                          disabled={submitting}
                        >
                          İptal
                        </button>
                        <button
                          onClick={() => handleSubmitAnswer(question._id)}
                          disabled={submitting || !newAnswer[question._id]?.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiSend />
                          <span>Yanıtla</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveQuestionId(question._id)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Yanıtla
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Henüz soru bulunmuyor.</p>
          {!isListingOwner && (
            <p className="text-gray-500 text-sm mt-2">İlk soruyu soran siz olun!</p>
          )}
        </div>
      )}
    </div>
  )
} 