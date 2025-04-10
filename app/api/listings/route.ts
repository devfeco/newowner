import { NextResponse } from 'next/server'
import Listing from '@/app/models/Listing'
import dbConnect from '@/lib/dbConnect'

export async function GET(request: Request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const isApproved = searchParams.get('isApproved') === 'true'
    
    console.log('Arama kriteri:', { isApproved })
    
    const listings = await Listing.find({ isApproved })
      .sort({ createdAt: -1 })
      .lean()
    
    console.log('Bulunan kayıtlar:', listings)
    
    return NextResponse.json({ success: true, listings })
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    
    const listing = new Listing(body)
    await listing.save()
    
    return NextResponse.json({ 
      success: true, 
      listing 
    })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json(
      { success: false, error: 'İlan oluşturulamadı' },
      { status: 500 }
    )
  }
} 