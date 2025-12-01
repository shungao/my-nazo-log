// src/components/RadarChart.tsx

import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// Chart.jsに必要な要素を登録
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
    dataValues: {
        puzzle: number;
        experience: number;
        quantity: number;
        mystery: number;
        cheerfulness: number;
    };
    label: string;
}

const RadarChart: React.FC<RadarChartProps> = ({ dataValues, label }) => {
    
    // 描画データの設定
    const data = {
        labels: ['パズル', '体験', '物量', '推理', 'わいわい'],
        datasets: [
            {
                label: label,
                data: [
                    dataValues.puzzle,
                    dataValues.experience,
                    dataValues.quantity,
                    dataValues.mystery,
                    dataValues.cheerfulness,
                ],
                backgroundColor: 'rgba(52, 152, 219, 0.4)', // 青色
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
            }
        ]
    };

    // オプション設定
    const options = {
        scales: {
            r: {
                angleLines: { display: true, color: '#e0e0e0' },
                grid: { color: '#ddd' },
                // 軸ラベルの文字色
                pointLabels: {
                    color: '#333',
                    font: { size: 14 }
                },
                // 最小値と最大値を固定 (1〜5)
                min: 0, 
                max: 5, 
                ticks: {
                    stepSize: 1,
                    display: false // 目盛りラベル（0, 1, 2...）は非表示
                }
            }
        },
        plugins: {
            legend: {
                display: false // ラベルは非表示
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += context.raw;
                        return label;
                    }
                }
            }
        }
    };

    return (
        <div style={{ height: '300px', width: '300px', margin: '20px auto' }}>
            <Radar data={data} options={options} />
        </div>
    );
};

export default RadarChart;