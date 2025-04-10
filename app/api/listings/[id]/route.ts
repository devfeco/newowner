import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Listing from '@/app/models/Listing';
import { isValidObjectId } from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const id = params.id;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz ilan ID formatı' },
        { status: 400 }
      );
    }
    
    const listing = await Listing.findById(id);
    
    if (!listing) {
      return NextResponse.json(
        { success: false, message: 'İlan bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      listing
    });
  } catch (error) {
    console.error('Listing detail error:', error);
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 