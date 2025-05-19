import Link from 'next/link';
import { XCircleIcon } from '@heroicons/react/24/solid';

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-4 text-2xl font-semibold text-gray-900">Ödeme Başarısız</h2>
            <p className="mt-2 text-sm text-gray-600">
              Ödeme işlemi sırasında bir sorun oluştu.
            </p>
          </div>

          <div className="mt-6">
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    Ödemeniz işleme alınamadı. Lütfen tekrar deneyin.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/pricing"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Tekrar Dene
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 