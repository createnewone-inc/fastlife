// src/views/ManageView.tsx - Modernized
import React, { FC, useState, useEffect, FormEvent } from 'react';
import './ManageView.css';
import { useCourse } from '../context/CourseContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
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

interface WeightRecord {
  date: string;
  weight: number;
}

const ManageView: FC = () => {
  const { selectedCourse } = useCourse();
  const [weight, setWeight] = useState('');
  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Animation effect on mount
    setFadeIn(true);
    
    // Load records from local storage
    const stored = localStorage.getItem('weightRecords');
    if (stored) {
      setRecords(JSON.parse(stored));
    }
  }, []);

  // Save records to local storage when they change
  useEffect(() => {
    localStorage.setItem('weightRecords', JSON.stringify(records));
  }, [records]);

  // If no course is selected, show a minimal UI
  if (!selectedCourse) {
    return (
      <div className="manage-view no-course">
        <div className="panel">
          <h2>コースが選択されていません</h2>
          <p>ファスティングコースを選択してください</p>
        </div>
      </div>
    );
  }

  // Use selected course start date or today if none provided
  const startDate = selectedCourse.startDate || new Date().toISOString().split('T')[0];

  // Calculate days since course start
  const computeDayCount = (): number => {
    const start = new Date(startDate);
    const today = new Date();
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - start.getTime();
    return Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
  };

  const dayCount = computeDayCount();
  const totalDays = selectedCourse.duration;
  const progressPercent = Math.min((dayCount / totalDays) * 100, 100);

  // Handle form submission for weight recording
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (weight.trim() !== '') {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if we already have a record for today
      const existingIndex = records.findIndex(r => r.date === today);
      
      if (existingIndex >= 0) {
        // Update existing record
        const updatedRecords = [...records];
        updatedRecords[existingIndex] = { 
          date: today, 
          weight: parseFloat(weight) 
        };
        setRecords(updatedRecords);
      } else {
        // Add new record
        setRecords([...records, { 
          date: today, 
          weight: parseFloat(weight) 
        }]);
      }
      
      setWeight('');
    }
  };

  // Delete a weight record
  const handleDelete = (index: number) => {
    if (window.confirm('この記録を削除しますか？')) {
      setRecords(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Format date for better display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get progress phase
  const getPhase = (): string => {
    if (dayCount <= 3) return "準備期間";
    if (dayCount <= totalDays/2) return "導入期間";
    if (dayCount < totalDays) return "本格期間";
    return "完了期間";
  };

  // Get advice based on current day
  const getAdvice = (): string => {
    if (dayCount === 1) return "今日は準備日です。軽めの食事を心がけましょう。";
    if (dayCount > 1 && dayCount <= 3) return "胃腸を休ませることで、これからの断食に備えます。";
    if (dayCount > 3 && dayCount <= totalDays/2) return "水分補給を忘れずに。ハーブティーもおすすめです。";
    if (dayCount > totalDays/2 && dayCount < totalDays) return "あと少し！無理のない範囲で続けましょう。";
    return "素晴らしい達成感ですね。これからの食生活にも活かしていきましょう。";
  };

  // Sort records by date for chart
  const sortedRecords = [...records].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Chart.js data configuration
  const chartData = {
    labels: sortedRecords.map(r => formatDate(r.date)),
    datasets: [
      {
        label: '体重 (kg)',
        data: sortedRecords.map(r => r.weight),
        borderColor: '#4cc9f0',
        backgroundColor: 'rgba(76, 201, 240, 0.2)',
        tension: 0.3,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#4cc9f0',
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        borderWidth: 3,
      },
    ],
  };

  // Chart.js options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: "'Inter', 'Helvetica Neue', sans-serif",
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#e0e0e0',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        cornerRadius: 8,
        bodyFont: {
          family: "'Inter', 'Helvetica Neue', sans-serif",
        },
        titleFont: {
          family: "'Inter', 'Helvetica Neue', sans-serif",
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: "'Inter', 'Helvetica Neue', sans-serif",
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: "'Inter', 'Helvetica Neue', sans-serif",
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    elements: {
      line: {
        borderJoinStyle: 'round' as const,
      },
    },
  };

  return (
    <div className={`manage-view ${fadeIn ? 'fade-in' : ''}`}>
      <div className="dashboard">
        {/* 左カラム: コース情報, 進捗, グラフ */}
        <div className="panel left-panel">
          <div className="course-info">
            <h2>{selectedCourse.name}</h2>
            <p>
              Day {dayCount} / {totalDays}
            </p>
          </div>

          <div className="progress-wrapper">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {records.length > 0 ? (
            <div className="chart-section">
              <h3>体重の推移</h3>
              <div style={{ height: '300px', position: 'relative' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          ) : (
            <div className="chart-section empty-chart">
              <h3>体重の推移</h3>
              <div className="empty-state">
                <p>体重を記録すると、ここにグラフが表示されます</p>
              </div>
            </div>
          )}
        </div>

        {/* 右カラム: 体重記録 + コースの説明 */}
        <div className="panel right-panel">
          {/* 体重記録セクション */}
          <div className="weight-section">
            <h3>体重を記録</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="体重 (kg)"
              />
              <button type="submit">記録</button>
            </form>
            
            <div className="logs">
              {sortedRecords.length > 0 ? (
                sortedRecords.map((r, i) => (
                  <div key={i} className="log-item">
                    <span>
                      {formatDate(r.date)}: {r.weight} kg
                    </span>
                    <button 
                      className="delete-button" 
                      onClick={() => handleDelete(i)}
                      title="記録を削除"
                      aria-label="記録を削除"
                    >
                      ×
                    </button>
                  </div>
                )).reverse()
              ) : (
                <div className="empty-logs">
                  <p>記録がありません</p>
                </div>
              )}
            </div>
          </div>

          {/* コースの説明セクション */}
          <div className="course-description">
            <h3>コースの説明</h3>
            <div className="description-content">
              <h4>このコースについて</h4>
              <p>
                {selectedCourse.name}は{totalDays}日間のファスティングプログラムです。
                段階的に食事制限を行い、体に優しい方法で断食に慣れていきます。
              </p>

              <h4>現在のフェーズ</h4>
              <p>
                {getPhase()}: {
                  dayCount <= 3 ? "軽めの食事で胃腸を休ませています。" :
                  dayCount <= totalDays/2 ? "少しずつ食事量を減らしています。" :
                  dayCount < totalDays ? "設定した目標に向かって頑張っています！" :
                  "おめでとうございます！目標を達成しました。"
                }
              </p>

              <h4>今日のアドバイス</h4>
              <p>{getAdvice()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageView;