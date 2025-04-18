import mongoose from 'mongoose'

// mongoose bağlantısı için tip tanımı
type MongooseConnection = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// global namespace'i genişlet
declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: MongooseConnection | undefined
}

// MongoDB URI doğrulama
const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI env değişkeni tanımlanmamış')
}

// Global bağlantı önbelleği
const globalMongoose = global.mongooseConnection

// Önbelleği başlat
let cached: MongooseConnection = globalMongoose || {
  conn: null,
  promise: null,
}

// Global değişkene ata
if (!global.mongooseConnection) {
  global.mongooseConnection = cached
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
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