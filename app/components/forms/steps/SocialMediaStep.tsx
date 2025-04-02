'use client'

import React from 'react'
import { FormValues } from '../CreateListingForm'

interface SocialMediaStepProps {
  values: FormValues
  onChange: (values: Partial<FormValues>) => void
}

export default function SocialMediaStep({ values, onChange }: SocialMediaStepProps) {
  const handleSocialMediaChange = (platform: keyof typeof values.socialMediaAccounts, value: boolean) => {
    onChange({
      socialMediaAccounts: {
        ...values.socialMediaAccounts,
        [platform]: value
      }
    })
  }

  const handleFollowersChange = (platform: keyof typeof values.socialMediaAccounts, followers: string) => {
    const followersKey = `${platform}Followers` as keyof typeof values.socialMediaAccounts
    onChange({
      socialMediaAccounts: {
        ...values.socialMediaAccounts,
        [followersKey]: followers
      }
    })
  }

  // Sosyal medya hesabı yoksa, bu adımı atla
  if (!values.hasSocialMedia) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Sosyal medya hesabınız olmadığını belirttiniz. Bir sonraki adıma geçebilirsiniz.
        </p>
      </div>
    )
  }

  const socialPlatforms = [
    { 
      id: 'instagram', 
      name: 'Instagram',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      icon: '📸'
    },
    { 
      id: 'tiktok', 
      name: 'TikTok',
      color: 'bg-gradient-to-r from-black to-gray-800',
      icon: '🎵'
    },
    { 
      id: 'facebook', 
      name: 'Facebook',
      color: 'bg-blue-600',
      icon: '👥'
    },
    { 
      id: 'twitter', 
      name: 'Twitter',
      color: 'bg-blue-400',
      icon: '🐦'
    },
    { 
      id: 'youtube', 
      name: 'YouTube',
      color: 'bg-red-600',
      icon: '🎬'
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn',
      color: 'bg-blue-800',
      icon: '💼'
    }
  ]

  return (
    <div className="space-y-6">
      <p className="text-gray-600 mb-4">
        Sosyal medya hesaplarınızı seçin ve takipçi sayılarınızı paylaşın.
      </p>

      <div className="grid md:grid-cols-3 gap-5">
        {socialPlatforms.map(platform => (
          <div 
            key={platform.id} 
            className={`
              relative rounded-xl overflow-hidden transition-all duration-300 
              ${values.socialMediaAccounts[platform.id as keyof typeof values.socialMediaAccounts] 
                ? `border-2 border-blue-500 shadow-md bg-opacity-10` 
                : 'border border-gray-200 bg-white hover:border-gray-300'}
            `}
          >
            <div className="absolute top-2 right-2">
              <input
                id={`has-${platform.id}`}
                type="checkbox"
                checked={values.socialMediaAccounts[platform.id as keyof typeof values.socialMediaAccounts] as boolean}
                onChange={(e) => handleSocialMediaChange(platform.id as keyof typeof values.socialMediaAccounts, e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500"
              />
            </div>
            
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="font-medium text-black">{platform.name}</h3>
              </div>

              {values.socialMediaAccounts[platform.id as keyof typeof values.socialMediaAccounts] && (
                <div className="mt-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={values.socialMediaAccounts[`${platform.id}Followers` as keyof typeof values.socialMediaAccounts] as string}
                      onChange={(e) => handleFollowersChange(platform.id as keyof typeof values.socialMediaAccounts, e.target.value)}
                      className="bg-white/70 backdrop-blur-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10"
                      placeholder="Takipçi sayısı"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                      <span className="text-xs">takipçi</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 