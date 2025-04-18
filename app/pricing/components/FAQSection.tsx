'use client'

import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'

type FAQItem = {
  question: string
  answer: string
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqItems: FAQItem[] = [
    {
      question: 'Premium üyelik nasıl çalışır?',
      answer: 'Premium üyelik, aylık veya yıllık olarak satın alabileceğiniz bir abonelik modelidir. Premium üye olarak, iş operasyonlarının tüm detaylarına erişim, öncelikli bildirimler, aracılık hizmetleri gibi birçok ekstra özellikten yararlanabilirsiniz. Yıllık abonelik seçeneği ile daha fazla tasarruf sağlayabilirsiniz.'
    },
    {
      question: 'Premium üyeliğimi nasıl iptal edebilirim?',
      answer: 'Premium üyeliğinizi hesap ayarları bölümünden istediğiniz zaman iptal edebilirsiniz. İptal etmeniz durumunda, mevcut ödeme döneminin sonuna kadar premium özelliklerden yararlanmaya devam edeceksiniz. Otomatik yenileme devre dışı bırakılacak ve sonraki ödeme alınmayacaktır.'
    },
    {
      question: 'Komisyon ücretleri nasıl hesaplanır?',
      answer: 'Başarılı olarak satışı gerçekleştirilen tüm marka ve operasyonlardan hem alıcı hem de satıcıdan %5 komisyon alınmaktadır. Bu komisyon, işlemin toplam değeri üzerinden hesaplanır ve işlem tamamlandığında tahsil edilir. Komisyon, platformun işlem güvenliği, aracılık hizmetleri ve destek maliyetlerini karşılamak için kullanılmaktadır.'
    },
    {
      question: 'Premium üyelik olmadan ilanları görebilir miyim?',
      answer: 'Evet, ücretsiz üyelik ile tüm ilanları görüntüleyebilirsiniz. Ancak, ilanların detaylı bilgilerine, finansal verilerine ve satıcı iletişim bilgilerine erişmek için premium üyelik gereklidir. Premium üyelik ayrıca öncelikli bildirimlere erişim, gelişmiş arama özellikleri ve aracılık hizmetleri gibi avantajlar sağlar.'
    },
    {
      question: 'Ödemeler nasıl yapılır ve hangi ödeme yöntemlerini kabul ediyorsunuz?',
      answer: 'Tüm ödemeler PAYTR ödeme sistemi üzerinden güvenli bir şekilde gerçekleştirilmektedir. Kredi kartı, banka kartı ve banka havalesi gibi çeşitli ödeme yöntemlerini kabul ediyoruz. Ödemeler otomatik olarak belirlenen dönemlerde (aylık veya yıllık) yenilenir, ancak istediğiniz zaman aboneliğinizi iptal edebilirsiniz.'
    },
    {
      question: 'Premium üyelik satın aldıktan ne kadar süre sonra özelliklere erişebilirim?',
      answer: 'Ödemeniz başarıyla tamamlandıktan hemen sonra premium özelliklere anında erişim sağlayabilirsiniz. Herhangi bir aktivasyon süreci veya bekleme süresi bulunmamaktadır. Ödeme onayının ardından hesabınız otomatik olarak premium statüsüne yükseltilir.'
    },
    {
      question: 'İade politikanız nedir?',
      answer: 'Satın alma işleminden itibaren 7 gün içinde, herhangi bir sebep belirtmeksizin iade talep edebilirsiniz. İade talepleriniz için destek ekibimizle iletişime geçmeniz yeterlidir. Ancak, premium özellikleri aktif olarak kullandıysanız (örneğin, ilan detaylarına erişim sağladıysanız), kısmen iade yapılabilir veya iade talebi reddedilebilir.'
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div>
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 relative inline-block">
          Sık Sorulan Sorular
          <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transform translate-y-2"></div>
        </h2>
        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          Merak ettiklerinizi yanıtlıyoruz
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto space-y-5">
        {faqItems.map((faq, index) => (
          <div 
            key={index}
            className={`border rounded-xl overflow-hidden transition-all duration-300 ${
              openIndex === index 
                ? 'border-indigo-200 bg-white shadow-md' 
                : 'border-gray-200 bg-white hover:border-indigo-200'
            }`}
          >
            <button
              className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              <span className={`text-lg font-medium ${openIndex === index ? 'text-indigo-700' : 'text-gray-800'}`}>
                {faq.question}
              </span>
              <div className={`flex-shrink-0 ml-4 p-1 rounded-full ${openIndex === index ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                {openIndex === index ? (
                  <ChevronUpIcon className="h-5 w-5 text-indigo-600" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </button>
            
            {openIndex === index && (
              <div className="px-6 pb-6">
                <div className="h-px bg-gray-200 mb-6"></div>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-gray-600">
          Başka sorularınız mı var?{' '}
          <a href="/contact" className="text-indigo-600 font-medium hover:underline">
            Bizimle iletişime geçin
          </a>
        </p>
      </div>
    </div>
  )
} 