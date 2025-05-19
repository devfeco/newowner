import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Listing from '@/app/models/Listing';
import { isValidObjectId } from 'mongoose';
import { verify } from 'jsonwebtoken';
import User from '@/app/models/User';

type Params = Promise<{ id: string }>;

// JWT token'dan kullanıcı bilgisini çıkaran yardımcı fonksiyon
const getUserFromToken = async (request: NextRequest) => {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    console.log('Token bulunamadı');
    return null;
  }
  
  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'default_secret') as { id: string };
    const userId = decoded.id; // JWT'deki doğru alan 'id'
    console.log('Decoded token:', decoded);
    
    await dbConnect();
    const user = await User.findById(userId).lean();
    console.log('Bulunan kullanıcı:', user ? `${user._id} - ${user.userType}` : 'Kullanıcı bulunamadı');
    return user;
  } catch (error) {
    console.error('Token doğrulama hatası:', error);
    return null;
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await dbConnect();
    
    const id = (await params).id;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz ilan ID formatı' },
        { status: 400 }
      );
    }
    
    const listing = await Listing.findById(id).lean();
    
    if (!listing) {
      return NextResponse.json(
        { success: false, message: 'İlan bulunamadı' },
        { status: 404 }
      );
    }

    // Kullanıcı bilgisini al
    const user = await getUserFromToken(request);
    console.log('Kullanıcı rolü:', user?.userType);
    
    // Kullanıcı admin değilse, hassas alanları maskele
    if (!user || user.userType !== 'admin') {
      console.log('Kullanıcı admin değil, alanlar maskeleniyor');
      listing.brandName = '********';
      
      if (listing.hasWebsite && listing.websiteUrl) {
        listing.websiteUrl = '********';
      }
    } else {
      console.log('Kullanıcı admin, tüm alanlar gösteriliyor');
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