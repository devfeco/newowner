import { NextRequest, NextResponse } from 'next/server'
import { isValidObjectId } from 'mongoose'
import { dbConnect } from '@/app/lib/mongodb'
import Question from '@/app/models/Question'
import { getUser } from '@/app/lib/auth'
import Listing from '@/app/models/Listing'

// Belirli bir ilan için tüm soruları getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const listingId = params.id
    
    if (!isValidObjectId(listingId)) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz ilan ID formatı' },
        { status: 400 }
      )
    }
    
    // Kullanıcı bilgilerini kontrol et
    const user = await getUser(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Giriş yapmalısınız' },
        { status: 401 }
      )
    }
    
    // İlanı bul
    const listing = await Listing.findById(listingId)
    
    if (!listing) {
      return NextResponse.json(
        { success: false, message: 'İlan bulunamadı' },
        { status: 404 }
      )
    }
    
    // Kullanıcının premium üye olup olmadığını veya ilan sahibi olup olmadığını kontrol et
    const isListingOwner = String(listing.userId) === String(user._id)
    const isPremium = user.isPremium === true
    const isAdmin = user.userType === 'admin'
    
    if (!isPremium && !isListingOwner && !isAdmin) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Bu bölümü görüntüleyebilmek için premium üye olmalısınız' 
        },
        { status: 403 }
      )
    }
    
    // Soruları ve yanıtları kullanıcı bilgileriyle birlikte getir
    const questions = await Question.find({ listingId })
      .populate('userId', 'name')
      .populate('answers.userId', 'name')
      .sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      questions
    })
  } catch (error) {
    console.error('Sorular getirme hatası:', error)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

// Yeni soru ekle
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
    
    const listingId = params.id
    
    if (!isValidObjectId(listingId)) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz ilan ID formatı' },
        { status: 400 }
      )
    }
    
    // İlanın var olup olmadığını kontrol et
    const listing = await Listing.findById(listingId)
    
    if (!listing) {
      return NextResponse.json(
        { success: false, message: 'İlan bulunamadı' },
        { status: 404 }
      )
    }
    
    // Kullanıcının premium üye olup olmadığını veya ilan sahibi olup olmadığını kontrol et
    const isListingOwner = String(listing.userId) === String(user._id)
    const isPremium = user.isPremium === true
    const isAdmin = user.userType === 'admin'
    
    if (!isPremium && !isListingOwner && !isAdmin) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Bu özelliği kullanabilmek için premium üye olmalısınız' 
        },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { question } = body
    
    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Soru boş olamaz' },
        { status: 400 }
      )
    }
    
    const newQuestion = new Question({
      listingId,
      userId: user._id,
      question
    })
    
    await newQuestion.save()
    
    return NextResponse.json({
      success: true,
      question: newQuestion
    }, { status: 201 })
  } catch (error) {
    console.error('Soru ekleme hatası:', error)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
} 