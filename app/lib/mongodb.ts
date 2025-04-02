import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/newowner"

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI ortam değişkeni tanımlanmamış.')
}

// Global mongoose tipi için arayüz tanımlama
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global değişken tipi tanımı
declare global {
  var mongoose: MongooseCache | undefined;
}

// Önbelleğe alınmış bağlantı değişkenini başlat
const cached: MongooseCache = global.mongoose || { conn: null, promise: null }

// Global değişkeni güncelle
if (!global.mongoose) {
  global.mongoose = cached
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then(mongoose => {
        console.log('MongoDB bağlantısı başarılı')
        return mongoose
      })
      .catch(error => {
        console.error('MongoDB bağlantı hatası:', error)
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect 