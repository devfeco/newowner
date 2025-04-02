# NextJS Kullanıcı Yetkilendirme Sistemi

Bu proje, Next.js ile oluşturulmuş tam kapsamlı bir JWT tabanlı kullanıcı yetkilendirme sistemini içerir.

## Özellikler

- JWT tabanlı kimlik doğrulama
- Kullanıcı kaydı ve girişi
- Oturum yönetimi
- Güvenli şifre depolama (bcrypt ile hash'leme)
- Form doğrulama
- TypeScript ile tip güvenliği
- MongoDB veritabanı entegrasyonu
- Responsive tasarım

## Kurulum

1. Repoyu klonlayın:

```bash
git clone https://github.com/sizin-kullanici-adiniz/next-auth-app.git
cd next-auth-app
```

2. Bağımlılıkları yükleyin:

```bash
npm install
# veya
yarn install
```

3. `.env.local` dosyasını oluşturun:

```bash
cp .env.example .env.local
```

4. `.env.local` dosyasını düzenleyin ve gerekli ortam değişkenlerini ayarlayın:

```
MONGODB_URI=mongodb://localhost:27017/newowner
JWT_SECRET=sizin_gizli_anahtariniz
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

5. Geliştirme sunucusunu başlatın:

```bash
npm run dev
# veya
yarn dev
```

6. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

## API Rotaları

### `POST /api/auth/register`

Yeni bir kullanıcı kaydeder.

**İstek Gövdesi:**

```json
{
  "name": "Kullanıcı Adı",
  "email": "kullanici@ornek.com",
  "password": "sifre123"
}
```

**Başarılı Yanıt:**

```json
{
  "success": true,
  "message": "Kayıt başarılı",
  "user": {
    "_id": "user_id",
    "name": "Kullanıcı Adı",
    "email": "kullanici@ornek.com"
  },
  "token": "jwt_token"
}
```

### `POST /api/auth/login`

Mevcut bir kullanıcıyı giriş yapar.

**İstek Gövdesi:**

```json
{
  "email": "kullanici@ornek.com",
  "password": "sifre123"
}
```

**Başarılı Yanıt:**

```json
{
  "success": true,
  "message": "Giriş başarılı",
  "user": {
    "_id": "user_id",
    "name": "Kullanıcı Adı",
    "email": "kullanici@ornek.com"
  },
  "token": "jwt_token"
}
```

## Proje Yapısı

```
/app
  /api
    /auth
      /login
        route.ts
      /register
        route.ts
  /auth
    /login
      page.tsx
    /register
      page.tsx
  /components
    /ui
      Button.tsx
      FormContainer.tsx
      Input.tsx
      ...
    TermsModal.tsx
    ...
  /contexts
    AuthContext.tsx
  /lib
    jwt.ts
    mongodb.ts
    types.ts
  /models
    User.ts
  layout.tsx
  page.tsx
  globals.css
```

## Teknolojiler

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [Tailwind CSS](https://tailwindcss.com/)

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.
