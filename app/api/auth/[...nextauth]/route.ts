import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/app/lib/mongodb';
import { connectToDatabase } from '@/app/lib/mongodb';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async jwt({ 
      token,
      user,
      account 
    }: {
      token: any;
      user: any; 
      account: any;
    }) {
      // İlk giriş sırasında user ve account nesneleri mevcuttur
      if (account && user) {
        return {
          ...token,
          userId: user.id,
          provider: account.provider,
        };
      }
      return token;
    },
    async session({ 
      session,
      token, 
      user 
    }: {
      session: any;
      token: any;
      user: any;
    }) {
      // Session'a kullanıcı bilgilerini ekle
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
    async signIn({ 
      user,
      account, 
      profile 
    }: {
      user: any;
      account: any;
      profile: any;
    }) {
      try {
        console.log('Google SignIn çalıştı - User:', user?.email)
        const { db } = await connectToDatabase();
        // MongoDB'deki users koleksiyonuna kullanıcı bilgilerini kaydet
        const existingUser = await db.collection('users').findOne({ 
          email: user.email 
        });
        
        if (!existingUser) {
          console.log(`Yeni kullanıcı kaydediliyor: ${user.email}`)
          // Yeni kullanıcı oluştur
          await db.collection('users').insertOne({
            email: user.email,
            name: user.name,
            image: user.image,
            provider: account?.provider,
            providerAccountId: account?.providerAccountId,
            userType: null, // Kullanıcı tipi henüz belirlenmedi
            createdAt: new Date(),
            updatedAt: new Date()
          });
        } else {
          console.log(`Mevcut kullanıcı güncelleniyor: ${user.email}`)
          // Mevcut kullanıcıyı güncelle
          await db.collection('users').updateOne(
            { email: user.email },
            { 
              $set: { 
                updatedAt: new Date(),
                provider: account?.provider,
                providerAccountId: account?.providerAccountId
              } 
            }
          );
        }
        
        return true;
      } catch (error) {
        console.error('Google SignIn Error:', error);
        return false;
      }
    },
    async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
      // Eğer belirtilen bir callback URL varsa ona yönlendir
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      
      // URL zaten tam bir URL ise kullan
      else if (url.startsWith('http')) {
        return url
      }
      
      // Varsayılan olarak baseUrl'e yönlendir
      return baseUrl
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
    signOut: '/auth/login'
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions as NextAuthOptions);

export { handler as GET, handler as POST }; 