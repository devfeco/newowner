import { NextRequest, NextResponse } from 'next/server'
import { isValidObjectId } from 'mongoose'
import { dbConnect } from '@/app/lib/mongodb'
import Question from '@/app/models/Question'
import { getUser } from '@/app/lib/auth'
import Listing from '@/app/models/Listing'

// Soruya yanıt ekle
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const user = await getUser(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Giriş yapmalısınız' },
        { status: 401 }
      )
    }
    
    const questionId = params.id
    
    if (!isValidObjectId(questionId)) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz soru ID formatı' },
        { status: 400 }
      )
    }
    
    const question = await Question.findById(questionId)
    
    if (!question) {
      return NextResponse.json(
        { success: false, message: 'Soru bulunamadı' },
        { status: 404 }
      )
    }
    
    // Sorunun ait olduğu ilanı kontrol et
    const listing = await Listing.findById(question.listingId)
    
    if (!listing) {
      return NextResponse.json(
        { success: false, message: 'İlan bulunamadı' },
        { status: 404 }
      )
    }
    
    // Eğer kullanıcı ilan sahibi değilse, yanıt veremez (admin hariç)
    if (user.userType !== 'admin' && String(listing.userId) !== String(user._id)) {
      return NextResponse.json(
        { success: false, message: 'Bu soruyu yanıtlama yetkiniz yok' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { content } = body
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Yanıt boş olamaz' },
        { status: 400 }
      )
    }
    
    // Yanıtı ekle
    question.answers.push({
      userId: user._id,
      content,
      createdAt: new Date()
    })
    
    // Soru yanıtlandı olarak işaretle
    question.isAnswered = true
    
    await question.save()
    
    return NextResponse.json({
      success: true,
      question
    })
  } catch (error) {
    console.error('Yanıt ekleme hatası:', error)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
} 