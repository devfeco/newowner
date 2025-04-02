import { Schema, model, models, Document } from 'mongoose'

export interface ListingDocument extends Document {
  userId: string
  brandName: string
  category: string
  foundingDate: string
  location: string
  price: string
  transferItems: string[]
  
  hasMarketplaces: boolean
  marketplaces: string[]
  trendyolSales?: string
  trendyolRating?: string
  trendyolProfitMargin?: string
  trendyolMonthlySales?: {
    month1: string
    month2: string
    month3: string
    month4: string
    month5: string
    month6: string
  }
  amazonSales?: string
  amazonRating?: string
  amazonProfitMargin?: string
  amazonMonthlySales?: {
    month1: string
    month2: string
    month3: string
    month4: string
    month5: string
    month6: string
  }
  hepsiburadaSales?: string
  hepsiburadaRating?: string
  hepsiburadaProfitMargin?: string
  hepsiburadaMonthlySales?: {
    month1: string
    month2: string
    month3: string
    month4: string
    month5: string
    month6: string
  }
  n11Sales?: string
  n11Rating?: string
  n11ProfitMargin?: string
  n11MonthlySales?: {
    month1: string
    month2: string
    month3: string
    month4: string
    month5: string
    month6: string
  }
  
  hasWebsite: boolean
  websiteUrl?: string
  salesCount?: string
  websiteSales?: string
  websiteMonthlySales?: {
    month1: string
    month2: string
    month3: string
    month4: string
    month5: string
    month6: string
  }
  visitCount?: string
  websiteProfitMargin?: string
  ecommerceInfrastructure?: string
  licenseRenewalDate?: string
  hasSearchEngineBan?: boolean
  searchEngineBanDetails?: string
  
  hasSocialMedia: boolean
  socialMediaAccounts?: {
    instagram: boolean
    instagramFollowers: string
    tiktok: boolean
    tiktokFollowers: string
    facebook: boolean
    facebookFollowers: string
    twitter: boolean
    twitterFollowers: string
    youtube: boolean
    youtubeFollowers: string
    linkedin: boolean
    linkedinFollowers: string
  }
  
  inventoryValue: string
  inventoryDetails: string
  yearlyProfit: string
  yearlySales: string
  monthlyExpenses: string
  hasLegalObstacles: boolean
  legalObstacleDetails?: string
  founderExperience: string
  
  willProvideSupport: boolean
  supportDuration?: string
  supportDetails?: string
  listingDescription: string

  createdAt: Date
  updatedAt: Date
}

const monthlySalesSchema = new Schema({
  month1: { type: String, default: '' },
  month2: { type: String, default: '' },
  month3: { type: String, default: '' },
  month4: { type: String, default: '' },
  month5: { type: String, default: '' },
  month6: { type: String, default: '' },
})

const socialMediaAccountsSchema = new Schema({
  instagram: { type: Boolean, default: false },
  instagramFollowers: { type: String, default: '' },
  tiktok: { type: Boolean, default: false },
  tiktokFollowers: { type: String, default: '' },
  facebook: { type: Boolean, default: false },
  facebookFollowers: { type: String, default: '' },
  twitter: { type: Boolean, default: false },
  twitterFollowers: { type: String, default: '' },
  youtube: { type: Boolean, default: false },
  youtubeFollowers: { type: String, default: '' },
  linkedin: { type: Boolean, default: false },
  linkedinFollowers: { type: String, default: '' },
})

const listingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    brandName: { type: String, required: true },
    category: { type: String, required: true },
    foundingDate: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    transferItems: { type: [String], default: [] },
    
    hasMarketplaces: { type: Boolean, default: false },
    marketplaces: { type: [String], default: [] },
    trendyolSales: { type: String, default: '' },
    trendyolRating: { type: String, default: '' },
    trendyolProfitMargin: { type: String, default: '' },
    trendyolMonthlySales: { type: monthlySalesSchema, default: () => ({}) },
    amazonSales: { type: String, default: '' },
    amazonRating: { type: String, default: '' },
    amazonProfitMargin: { type: String, default: '' },
    amazonMonthlySales: { type: monthlySalesSchema, default: () => ({}) },
    hepsiburadaSales: { type: String, default: '' },
    hepsiburadaRating: { type: String, default: '' },
    hepsiburadaProfitMargin: { type: String, default: '' },
    hepsiburadaMonthlySales: { type: monthlySalesSchema, default: () => ({}) },
    n11Sales: { type: String, default: '' },
    n11Rating: { type: String, default: '' },
    n11ProfitMargin: { type: String, default: '' },
    n11MonthlySales: { type: monthlySalesSchema, default: () => ({}) },
    
    hasWebsite: { type: Boolean, default: false },
    websiteUrl: { type: String, default: '' },
    salesCount: { type: String, default: '' },
    websiteSales: { type: String, default: '' },
    websiteMonthlySales: { type: monthlySalesSchema, default: () => ({}) },
    visitCount: { type: String, default: '' },
    websiteProfitMargin: { type: String, default: '' },
    ecommerceInfrastructure: { type: String, default: '' },
    licenseRenewalDate: { type: String, default: '' },
    hasSearchEngineBan: { type: Boolean, default: false },
    searchEngineBanDetails: { type: String, default: '' },
    
    hasSocialMedia: { type: Boolean, default: false },
    socialMediaAccounts: { type: socialMediaAccountsSchema, default: () => ({}) },
    
    inventoryValue: { type: String, required: true },
    inventoryDetails: { type: String, required: true },
    yearlyProfit: { type: String, required: true },
    yearlySales: { type: String, required: true },
    monthlyExpenses: { type: String, required: true },
    hasLegalObstacles: { type: Boolean, default: false },
    legalObstacleDetails: { type: String, default: '' },
    founderExperience: { type: String, required: true },
    
    willProvideSupport: { type: Boolean, default: false },
    supportDuration: { type: String, default: '' },
    supportDetails: { type: String, default: '' },
    listingDescription: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

export default models.Listing || model<ListingDocument>('Listing', listingSchema) 