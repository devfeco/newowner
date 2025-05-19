import { Schema, model, models } from 'mongoose'

const listingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  brandName: { type: String, required: true },
  category: { type: String, required: true },
  foundingDate: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  transferItems: { type: [String], default: [] },
  
  hasMarketplaces: { type: Boolean, default: false },
  marketplaces: { type: [String], default: [] },
  trendyolSales: { type: String },
  trendyolRating: { type: String },
  trendyolProfitMargin: { type: String },
  trendyolMonthlySales: {
    month1: String,
    month2: String,
    month3: String,
    month4: String,
    month5: String,
    month6: String
  },
  amazonSales: { type: String },
  amazonRating: { type: String },
  amazonProfitMargin: { type: String },
  amazonMonthlySales: {
    month1: String,
    month2: String,
    month3: String,
    month4: String,
    month5: String,
    month6: String
  },
  hepsiburadaSales: { type: String },
  hepsiburadaRating: { type: String },
  hepsiburadaProfitMargin: { type: String },
  hepsiburadaMonthlySales: {
    month1: String,
    month2: String,
    month3: String,
    month4: String,
    month5: String,
    month6: String
  },
  n11Sales: { type: String },
  n11Rating: { type: String },
  n11ProfitMargin: { type: String },
  n11MonthlySales: {
    month1: String,
    month2: String,
    month3: String,
    month4: String,
    month5: String,
    month6: String
  },
  
  hasWebsite: { type: Boolean, default: false },
  websiteUrl: { type: String },
  salesCount: { type: Number, default: 0 },
  websiteSales: { type: String },
  websiteMonthlySales: {
    month1: String,
    month2: String,
    month3: String,
    month4: String,
    month5: String,
    month6: String
  },
  visitCount: { type: String },
  websiteProfitMargin: { type: String },
  ecommerceInfrastructure: { type: String },
  licenseRenewalDate: { type: String },
  hasSearchEngineBan: { type: Boolean, default: false },
  searchEngineBanDetails: { type: String },
  
  hasSocialMedia: { type: Boolean, default: false },
  socialMediaAccounts: {
    instagram: { type: Boolean, default: false },
    instagramFollowers: { type: String },
    tiktok: { type: Boolean, default: false },
    tiktokFollowers: { type: String },
    facebook: { type: Boolean, default: false },
    facebookFollowers: { type: String },
    twitter: { type: Boolean, default: false },
    twitterFollowers: { type: String },
    youtube: { type: Boolean, default: false },
    youtubeFollowers: { type: String },
    linkedin: { type: Boolean, default: false },
    linkedinFollowers: { type: String }
  },
  
  inventoryValue: { type: String, required: true },
  inventoryDetails: { type: String, required: true },
  yearlyProfit: { type: Number, required: true },
  yearlySales: { type: Number, required: true },
  monthlyExpenses: { type: String, required: true },
  hasLegalObstacles: { type: Boolean, default: false },
  legalObstacleDetails: { type: String },
  founderExperience: { type: String, required: true },
  
  willProvideSupport: { type: Boolean, default: false },
  supportDuration: { type: String },
  supportDetails: { type: String },
  listingDescription: { type: String, required: true },
  listingTitle: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
}, {
  timestamps: true
})

export type ListingDocument = Document & {
  [K in keyof typeof listingSchema.obj]: typeof listingSchema.obj[K] extends { type: any }
    ? typeof listingSchema.obj[K]['type']
    : typeof listingSchema.obj[K]
}

const Listing = models.Listing || model<ListingDocument>('Listing', listingSchema)

export default Listing