import { NextResponse, NextRequest } from 'next/server'
import Listing from '@/app/models/Listing'
import dbConnect from '@/lib/dbConnect'
import { verify } from 'jsonwebtoken'
import User from '@/app/models/User'

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

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const isApproved = searchParams.get('isApproved') === 'true'
    const searchTerm = searchParams.get('searchTerm')
    
    // Filtre parametrelerini al
    const category = searchParams.get('category')
    const priceMinStr = searchParams.get('priceMin')
    const priceMaxStr = searchParams.get('priceMax')
    const yearlySalesMinStr = searchParams.get('yearlySalesMin')
    const yearlySalesMaxStr = searchParams.get('yearlySalesMax')
    const yearlyProfitMinStr = searchParams.get('yearlyProfitMin')
    const yearlyProfitMaxStr = searchParams.get('yearlyProfitMax')
    
    // String'den sayıya dönüştür (geçersiz değerler için NaN olur)
    const priceMin = priceMinStr ? parseFloat(priceMinStr) : undefined
    const priceMax = priceMaxStr ? parseFloat(priceMaxStr) : undefined
    const yearlySalesMin = yearlySalesMinStr ? parseFloat(yearlySalesMinStr) : undefined
    const yearlySalesMax = yearlySalesMaxStr ? parseFloat(yearlySalesMaxStr) : undefined
    const yearlyProfitMin = yearlyProfitMinStr ? parseFloat(yearlyProfitMinStr) : undefined
    const yearlyProfitMax = yearlyProfitMaxStr ? parseFloat(yearlyProfitMaxStr) : undefined
    
    console.log('Arama kriterleri (ham):', { 
      isApproved, 
      searchTerm, 
      category, 
      priceMinStr, 
      priceMaxStr, 
      yearlySalesMinStr, 
      yearlySalesMaxStr, 
      yearlyProfitMinStr, 
      yearlyProfitMaxStr 
    })
    
    console.log('Arama kriterleri (dönüştürülmüş):', { 
      isApproved, 
      searchTerm, 
      category, 
      priceMin, 
      priceMax, 
      yearlySalesMin, 
      yearlySalesMax, 
      yearlyProfitMin, 
      yearlyProfitMax 
    })
    
    // Arama kriterlerini oluştur
    let query: any = { isApproved }
    
    // Kategori filtresi
    if (category) {
      query.category = category
    }
    
    // Eğer arama terimi varsa, uygun alanları aramaya ekle
    let orQueries = [] // OR sorguları için ayrı bir dizi
    
    if (searchTerm && searchTerm.trim() !== '') {
      const searchRegex = new RegExp(searchTerm.trim(), 'i')
      orQueries.push(
        { listingTitle: searchRegex },
        { listingDescription: searchRegex },
        { location: searchRegex },
        { category: searchRegex },
        { brandName: searchRegex }
      )
    }
    
    // Sayısal filtreler
    // Fiyat filtresi - NaN kontrolü ekle
    if ((priceMin !== undefined && !isNaN(priceMin)) || (priceMax !== undefined && !isNaN(priceMax))) {
      const priceQuery = {}
      if (priceMin !== undefined && !isNaN(priceMin)) {
        priceQuery['$gte'] = priceMin
      }
      if (priceMax !== undefined && !isNaN(priceMax)) {
        priceQuery['$lte'] = priceMax
      }
      
      // Ana sorguda doğrudan kullan
      query.price = priceQuery
    }
    
    // Yıllık ciro filtresi - NaN kontrolü ekle
    if ((yearlySalesMin !== undefined && !isNaN(yearlySalesMin)) || (yearlySalesMax !== undefined && !isNaN(yearlySalesMax))) {
      const yearlySalesQuery = {}
      if (yearlySalesMin !== undefined && !isNaN(yearlySalesMin)) {
        yearlySalesQuery['$gte'] = yearlySalesMin
      }
      if (yearlySalesMax !== undefined && !isNaN(yearlySalesMax)) {
        yearlySalesQuery['$lte'] = yearlySalesMax
      }
      
      // Ana sorguda doğrudan kullan
      query.yearlySales = yearlySalesQuery
    }
    
    // Yıllık kar filtresi - NaN kontrolü ekle
    if ((yearlyProfitMin !== undefined && !isNaN(yearlyProfitMin)) || (yearlyProfitMax !== undefined && !isNaN(yearlyProfitMax))) {
      const yearlyProfitQuery = {}
      if (yearlyProfitMin !== undefined && !isNaN(yearlyProfitMin)) {
        yearlyProfitQuery['$gte'] = yearlyProfitMin
      }
      if (yearlyProfitMax !== undefined && !isNaN(yearlyProfitMax)) {
        yearlyProfitQuery['$lte'] = yearlyProfitMax
      }
      
      // Ana sorguda doğrudan kullan
      query.yearlyProfit = yearlyProfitQuery
    }
    
    // OR sorgularını ana sorguya ekle (eğer varsa)
    if (orQueries.length > 0) {
      query.$or = orQueries
    }
    
    console.log('MongoDB sorgusu:', JSON.stringify(query, null, 2))
    
    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .lean()
    
    console.log('Bulunan kayıtlar:', listings.length)
    if (listings.length > 0) {
      console.log('İlk kayıt örneği - fiyat:', listings[0].price, typeof listings[0].price)
    }

    // Kullanıcı bilgisini al
    const user = await getUserFromToken(request);
    console.log('Kullanıcı rolü:', user?.userType);
    
    // Kullanıcı admin değilse, hassas alanları maskele
    if (!user || user.userType !== 'admin') {
      console.log('Kullanıcı admin değil, alanlar maskeleniyor');
      for (const listing of listings) {
        listing.brandName = '********';
        
        if (listing.hasWebsite && listing.websiteUrl) {
          listing.websiteUrl = '********';
        }
      }
    } else {
      console.log('Kullanıcı admin, tüm alanlar gösteriliyor');
    }
    
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