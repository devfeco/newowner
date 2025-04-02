'use client'

import { useState } from 'react'
import { Modal } from './ui/Modal'
import { theme } from '@/app/theme'

interface TermsModalProps {
  trigger?: React.ReactNode
  isOpen?: boolean
  onClose?: () => void
}

export const TermsModal = ({ trigger, isOpen: externalIsOpen, onClose }: TermsModalProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  
  // İç state veya dış prop kullanımını belirle
  const isControlled = externalIsOpen !== undefined && onClose !== undefined
  const isOpen = isControlled ? externalIsOpen : internalIsOpen

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isControlled) {
      setInternalIsOpen(true)
    }
  }
  
  const handleClose = () => {
    if (isControlled && onClose) {
      onClose()
    } else {
      setInternalIsOpen(false)
    }
  }

  return (
    <>
      {trigger && (
        <span onClick={openModal} className="cursor-pointer font-medium hover:underline text-black">
          {trigger}
        </span>
      )}
      
      <Modal isOpen={isOpen} onClose={handleClose} title="Üyelik Sözleşmesi">
        <div className="prose prose-sm max-w-none">
          <h2 className="text-lg font-bold mb-4">NewOwner Üyelik Sözleşmesi</h2>
          
          <p className="mb-4">
            Bu Üyelik Sözleşmesi ("Sözleşme"), NewOwner platformunu ("Platform") kullanımınızı düzenleyen şart ve koşulları içerir.
            Üye olarak kaydolarak veya Platformu kullanarak bu Sözleşme'yi kabul etmiş sayılırsınız.
          </p>
          
          <h3 className="text-md font-semibold mt-5 mb-2">1. Tanımlar</h3>
          <p className="mb-3">
            <strong>Platform:</strong> NewOwner tarafından sunulan e-ticaret hizmetleri ve ürünleri ifade eder.<br />
            <strong>Üye:</strong> Platforma kayıt olan ve bu sözleşmedeki şartları kabul eden gerçek veya tüzel kişiyi ifade eder.<br />
            <strong>Hizmetler:</strong> Platform üzerinden sunulan tüm ürün ve hizmetleri ifade eder.
          </p>
          
          <h3 className="text-md font-semibold mt-5 mb-2">2. Üyelik</h3>
          <p className="mb-3">
            2.1. Platforma üye olabilmek için 18 yaşını doldurmuş olmanız gerekmektedir.<br />
            2.2. Üyelik için doğru ve güncel bilgileri sağlamanız gerekmektedir.<br />
            2.3. Üyelik hesabınızın güvenliğinden siz sorumlusunuz. Hesap bilgilerinizin izinsiz kullanımını derhal bildirmeniz gerekmektedir.
          </p>
          
          <h3 className="text-md font-semibold mt-5 mb-2">3. Kullanım Koşulları</h3>
          <p className="mb-3">
            3.1. Platform'u yasal amaçlar için ve bu Sözleşme'ye uygun olarak kullanacağınızı kabul edersiniz.<br />
            3.2. Platform'u haksız rekabet yaratacak, aldatıcı, yanıltıcı veya başkalarını rahatsız edecek şekilde kullanamaz veya böyle bir amaçla içerik paylaşamazsınız.<br />
            3.3. Platform'un güvenliğini tehlikeye atacak faaliyetlerde bulunamazsınız.
          </p>
          
          <h3 className="text-md font-semibold mt-5 mb-2">4. Fikri Mülkiyet</h3>
          <p className="mb-3">
            4.1. Platform'daki tüm içerik ve materyaller NewOwner'a veya lisans verenlere aittir ve telif hakkı, ticari marka ve diğer fikri mülkiyet kanunları tarafından korunmaktadır.<br />
            4.2. NewOwner'ın önceden yazılı izni olmadan, Platform'daki içerikleri kopyalayamaz, çoğaltamaz, dağıtamaz veya türev çalışmalar yapamazsınız.
          </p>
          
          <h3 className="text-md font-semibold mt-5 mb-2">5. Gizlilik</h3>
          <p className="mb-3">
            5.1. Kişisel verileriniz Gizlilik Politikamıza uygun olarak işlenir.<br />
            5.2. Üyelik sırasında sağladığınız bilgilerin doğru, güncel ve eksiksiz olduğunu taahhüt edersiniz.
          </p>
          
          <h3 className="text-md font-semibold mt-5 mb-2">6. Sözleşme Değişiklikleri</h3>
          <p className="mb-3">
            NewOwner, bu Sözleşme'yi herhangi bir zamanda değiştirebilir. Değişiklikler Platform'da yayınlandığı tarihte yürürlüğe girer.
            Değişikliklerden sonra Platform'u kullanmaya devam etmeniz, güncellenmiş Sözleşme'yi kabul ettiğiniz anlamına gelir.
          </p>
          
          <h3 className="text-md font-semibold mt-5 mb-2">7. Sözleşmenin Feshi</h3>
          <p className="mb-3">
            7.1. Bu Sözleşme'yi istediğiniz zaman hesabınızı kapatarak feshedebilirsiniz.<br />
            7.2. NewOwner, herhangi bir sebeple veya sebep göstermeksizin hesabınızı askıya alma veya sonlandırma hakkını saklı tutar.
          </p>
          
          <h3 className="text-md font-semibold mt-5 mb-2">8. Sorumluluğun Sınırlandırılması</h3>
          <p className="mb-5">
            Platform "olduğu gibi" sunulmaktadır. NewOwner, Platform'un kesintisiz, hatasız veya güvenli olacağını garanti etmez.
            Yürürlükteki kanunların izin verdiği azami ölçüde, NewOwner, doğrudan, dolaylı, arızi, özel, cezai veya sonuç olarak ortaya çıkan zararlardan sorumlu tutulamaz.
          </p>
          
          <div className="border-t pt-4 mt-8 text-sm text-gray-500">
            <p>Son güncelleme tarihi: {new Date().toLocaleDateString('tr-TR')}</p>
            <p>© {new Date().getFullYear()} NewOwner. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </Modal>
    </>
  )
} 