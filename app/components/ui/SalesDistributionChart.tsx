'use client';

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

// Her pazaryeri için satış verilerini tutacak arayüz
interface MarketplaceSalesData {
  trendyol?: number;
  hepsiburada?: number;
  amazon?: number;
  n11?: number;
  website?: number;
}

interface SalesDistributionChartProps {
  salesData: MarketplaceSalesData;
}

// Pazaryeri renklerini tanımlıyoruz - daha modern ve canlı renkler
const MARKETPLACE_COLORS = {
  trendyol: '#FF9736',
  hepsiburada: '#F1416C',
  amazon: '#181C32',
  n11: '#E31C2D',
  website: '#5014D0'
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
export default function SalesDistributionChart({ salesData }: SalesDistributionChartProps) {
  // Geçerli veri olup olmadığını kontrol et
  const hasData = Object.values(salesData).some(value => value !== undefined && value > 0);
  
  if (!hasData) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">Satış Kanalları Dağılımı</h3>
        </div>
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-sm">Satış kanalları verisi bulunamadı.</p>
        </div>
      </div>
    );
  }
  
  // Verileri ve etiketleri hazırla
  const labels: string[] = [];
  const values: number[] = [];
  const colors: string[] = [];
  const total = Object.values(salesData).reduce((sum: number, val: number | undefined) => sum + (val || 0), 0);
  
  // Her pazaryeri için veri var mı kontrol et ve ekle
  if (salesData.trendyol) {
    labels.push('Trendyol');
    values.push(salesData.trendyol);
    colors.push(MARKETPLACE_COLORS.trendyol);
  }
  
  if (salesData.hepsiburada) {
    labels.push('Hepsiburada');
    values.push(salesData.hepsiburada);
    colors.push(MARKETPLACE_COLORS.hepsiburada);
  }
  
  if (salesData.amazon) {
    labels.push('Amazon');
    values.push(salesData.amazon);
    colors.push(MARKETPLACE_COLORS.amazon);
  }
  
  if (salesData.n11) {
    labels.push('N11');
    values.push(salesData.n11);
    colors.push(MARKETPLACE_COLORS.n11);
  }
  
  if (salesData.website) {
    labels.push('Web Sitesi');
    values.push(salesData.website);
    colors.push(MARKETPLACE_COLORS.website);
  }
  
  // Grafik verilerini hazırla
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: 'transparent',
        borderWidth: 0,
        hoverOffset: 5,
        borderRadius: 3
      }
    ]
  };
  
  // Grafik ayarları
  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        },
        bodyFont: {
          size: 13,
          family: "'Poppins', sans-serif",
        },
        titleFont: {
          size: 14,
          weight: 'bold',
          family: "'Poppins', sans-serif",
        },
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        cornerRadius: 6,
        displayColors: false
      }
    },
    cutout: '0%'
  };
  
  // Her bir pazaryeri için yüzde dilimi hazırla
  const percentages = values.map(value => ((value / total) * 100).toFixed(1));
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900">Satış Kanalları Dağılımı</h3>
        <div className="badge bg-light-success text-success px-3 py-2 rounded-md text-xs font-semibold text-gray-900">
          Son 6 Ay
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3 relative">
          <div className="h-64 flex items-center justify-center overflow-visible">
            <div className="w-4/5 h-4/5">
              <Doughnut data={data} options={options} />
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 flex flex-col justify-center">
          <div className="p-5 bg-light rounded-xl border border-gray-100">
            <p className="text-sm text-gray-600 mb-4">Kanal Dağılımı</p>
            <div className="space-y-5">
              {labels.map((label, index) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-[15px] h-[15px] rounded-sm mr-3" 
                      style={{ backgroundColor: colors[index] }}
                    ></div>
                    <span className="text-sm font-medium text-gray-800">{label}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(values[index])}
                    </span>
                    <span 
                      className="text-xs font-medium"
                      style={{ color: colors[index] }}
                    >
                      %{percentages[index]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}