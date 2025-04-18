import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

const uri = process.env.MONGODB_URI as string;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Development modunda global değişken kullanarak bağlantıyı yeniden kullan
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };
  
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Production modunda yeni bir bağlantı oluştur
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Tüm uygulama için promise'i dışa aktar
export default clientPromise;

// Mongoose için dbConnect fonksiyonu (geri uyumluluk için)
const dbConnect = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || '';
    const options = {
      bufferCommands: false,
    };
    
    await mongoose.connect(MONGODB_URI, options);
    console.log('MongoDB bağlantısı başarılı (mongoose)');
    return mongoose;
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    throw error;
  }
};

// Eski dbConnect fonksiyonunu varsayılan olarak dışa aktar
export { dbConnect };

// Eski fonksiyonu uyumluluk için koruyalım
export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db();
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
} 