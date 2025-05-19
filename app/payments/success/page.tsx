import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-2xl font-semibold text-gray-900">Ödeme Başarılı!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Premium üyeliğiniz başarıyla aktifleştirildi.
            </p>
          </div>

          <div className="mt-6">
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Artık premium özelliklere erişebilirsiniz
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/dashboard"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Panele Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}