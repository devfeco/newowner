'use client';

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MonthlySales {
  month1?: string;
  month2?: string;
  month3?: string;
  month4?: string;
  month5?: string;
  month6?: string;
}

interface MarketplaceChartProps {
  title: string;
  monthlySales?: MonthlySales;
  totalSales?: string;  // Artık bu değeri kullanmayacağız, 6 aylık toplam hesaplanacak
  profitMargin?: string;
  rating?: string;
  color: string;
}

// Son 6 ay adlarını döndüren yardımcı fonksiyon
const getLastSixMonths = (): string[] => {
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const date = new Date();
  const currentMonth = date.getMonth();
  
  const lastSixMonths = [];
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    lastSixMonths.push(months[monthIndex]);
  }
  
  return lastSixMonths;
};

// Değerlendirme puanını yıldızlı formata çeviren yardımcı fonksiyon
const formatRating = (rating?: string): string => {
  if (!rating) return 'Veri yok';
  
  const ratingNum = parseFloat(rating);
  if (isNaN(ratingNum)) return rating;
  
  return `${ratingNum}/10`;
};

// Para değerlerini K, M şeklinde kısaltarak gösteren yardımcı fonksiyon
const formatCurrency = (value: number): string => {
  // Değeri yuvarla (örneğin 999,999 -> 1M)
  if (value >= 1000000) {
    return `${(value / 1000000).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}M ₺`;
  } else if (value >= 1000) {
    return `${(value / 1000).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}B ₺`;
  } else {
    return `${value.toLocaleString('tr-TR')} ₺`;
  }
};

// Değeri ay içi gösterim için formatlayan yardımcı fonksiyon
const formatChartValue = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  } else {
    return value.toFixed(0);
  }
};

export default function MarketplaceChart({
  title,
  monthlySales,
  totalSales, // Artık kullanılmayacak ama bağımlılıkları bozmamak için tutuyoruz
  profitMargin,
  rating,
  color
}: MarketplaceChartProps) {
  const labels = getLastSixMonths();
  
  // Veri yoksa veya tümü undefined ise false döndürür
  const hasData = monthlySales && Object.values(monthlySales).some(value => value !== undefined && value !== null && value !== '');
  
  // String değerleri number'a çevir
  const salesValues = useMemo(() => {
    if (!monthlySales) return [0, 0, 0, 0, 0, 0];
    
    return [
      parseFloat(monthlySales.month1 || '0'),
      parseFloat(monthlySales.month2 || '0'),
      parseFloat(monthlySales.month3 || '0'),
      parseFloat(monthlySales.month4 || '0'),
      parseFloat(monthlySales.month5 || '0'),
      parseFloat(monthlySales.month6 || '0')
    ];
  }, [monthlySales]);
  
  // 6 aylık satış verilerini topla
  const calculateTotalSales = useMemo(() => {
    return salesValues.reduce((sum, value) => sum + value, 0);
  }, [salesValues]);
  
  // Toplam satış değeri: Her zaman 6 aylık veri toplamını gösterecek
  const displayTotalSales = calculateTotalSales;
  
  if (!hasData) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <div className="badge px-3 py-2 rounded-md bg-light-primary text-primary text-xs font-medium">
            Son 6 Ay
          </div>
        </div>
        <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-sm">Bu pazaryeri için veri bulunmuyor.</p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Toplam Satış</p>
            <p className="font-bold text-gray-900">Veri yok</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Kar Marjı</p>
            <p className="font-bold text-gray-900">Veri yok</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Değerlendirme</p>
            <p className="font-bold text-gray-900">Veri yok</p>
          </div>
        </div>
      </div>
    );
  }
  
  // En yüksek değeri bulalım ve biraz ekleyelim
  const maxValue = Math.max(...salesValues);
  const chartMax = maxValue * 1.2;
  
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        titleFont: {
          size: 13,
          weight: 'bold',
          family: "'Poppins', sans-serif"
        },
        bodyFont: {
          size: 12,
          family: "'Poppins', sans-serif"
        },
        padding: 10,
        cornerRadius: 4,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Satış: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#B5B5C3'
        }
      },
      y: {
        beginAtZero: true,
        max: chartMax,
        ticks: {
          font: {
            size: 11
          },
          color: '#B5B5C3',
          callback: function(value) {
            return formatCurrency(value as number);
          }
        },
        grid: {
          color: 'rgba(221, 221, 221, 0.2)',
        }
      }
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 4,
        backgroundColor: color,
        borderColor: '#FFFFFF',
        borderWidth: 2
      },
      line: {
        tension: 0.4
      }
    }
  };
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Aylık Satış',
        data: salesValues,
        borderColor: color,
        backgroundColor: function(context: any) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          
          if (!chartArea) {
            return;
          }
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
          gradient.addColorStop(1, `${color}20`);
          
          return gradient;
        },
        fill: true,
        borderWidth: 2
      }
    ]
  };
  
  // Ortalama, minimum ve maksimum satış değerleri
  const avgSales = (displayTotalSales / 6).toFixed(0);
  const minSales = Math.min(...salesValues).toLocaleString('tr-TR');
  const maxSales = Math.max(...salesValues).toLocaleString('tr-TR');
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></span>
          {title}
        </h3>
        <div className="badge px-3 py-2 rounded-md bg-light-primary text-primary text-xs font-medium">
          Son 6 Ay
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-5">
        <div className="md:w-2/3">
          <div className="h-60 mb-4">
            <Line options={options} data={data} />
          </div>
        </div>
        
        <div className="md:w-1/3 flex flex-col justify-center">
          <div className="mb-5">
            <p className="text-sm text-gray-500 mb-1">Toplam Satış (6 Ay)</p>
            <p className="text-2xl font-bold text-gray-900">
              {displayTotalSales.toLocaleString('tr-TR')} ₺
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-light rounded-lg">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500">Ortalama Aylık Satış</span>
                <span className="text-xs text-gray-900 font-medium">{parseInt(avgSales).toLocaleString('tr-TR')} ₺</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-light rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Kar Marjı</div>
                <div className="text-base font-bold text-gray-900">{profitMargin ? `%${profitMargin}` : 'Veri yok'}</div>
              </div>
              <div className="p-3 bg-light rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Değerlendirme</div>
                <div className="text-base font-bold text-gray-900">{formatRating(rating)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-light rounded-lg">
                <div className="text-xs text-gray-500 mb-1">En Düşük</div>
                <div className="text-sm font-bold text-gray-900">{minSales} ₺</div>
              </div>
              <div className="p-3 bg-light rounded-lg">
                <div className="text-xs text-gray-500 mb-1">En Yüksek</div>
                <div className="text-sm font-bold text-gray-900">{maxSales} ₺</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 