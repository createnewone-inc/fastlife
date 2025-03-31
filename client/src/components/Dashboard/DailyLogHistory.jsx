import React, { useState, useEffect } from 'react';
import { getDailyLogs } from '../../services/api';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { FaCalendarAlt, FaWeight, FaStickyNote, FaChartLine, FaListUl } from 'react-icons/fa';
import './DailyLogHistory.css';

// ChartJSコンポーネントの登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DailyLogHistory = ({ userCourseId, onLogSelect }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'chart'

  useEffect(() => {
    if (userCourseId) {
      fetchLogs();
    }
  }, [userCourseId]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await getDailyLogs(userCourseId);
      // 日付順に並べ替え（新しい日付が先頭）
      const sortedLogs = response.data.sort((a, b) => 
        new Date(b.log_date) - new Date(a.log_date)
      );
      setLogs(sortedLogs);
      setError(null);
    } catch (err) {
      setError('ログの取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 日付のフォーマット
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // グラフ用データの準備
  const prepareChartData = () => {
    // 日付順に並べ替え（古い日付から）
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(a.log_date) - new Date(b.log_date)
    );
    
    const labels = sortedLogs.map(log => formatDate(log.log_date));
    const weightData = sortedLogs.map(log => log.weight);
    
    return {
      labels,
      datasets: [
        {
          label: '体重 (kg)',
          data: weightData,
          borderColor: '#4a90e2',
          backgroundColor: 'rgba(74, 144, 226, 0.2)',
          tension: 0.3,
          pointBackgroundColor: '#4a90e2',
          pointBorderColor: '#fff',
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '体重の推移',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const log = logs.sort((a, b) => 
              new Date(a.log_date) - new Date(b.log_date)
            )[context.dataIndex];
            
            let label = `体重: ${context.raw} kg`;
            if (log && log.memo) {
              label += `\nメモ: ${log.memo}`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: '体重 (kg)'
        },
        ticks: {
          callback: (value) => `${value} kg`
        }
      }
    }
  };

  if (loading) return <div className="loading-spinner">ログを読み込み中...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (logs.length === 0) return <div className="no-logs">記録がありません</div>;

  return (
    <div className="daily-log-history-container">
      <div className="history-header">
        <h3>記録履歴</h3>
        
        <div className="view-mode-toggle">
          <button 
            className={`toggle-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <FaListUl /> リスト
          </button>
          <button 
            className={`toggle-button ${viewMode === 'chart' ? 'active' : ''}`}
            onClick={() => setViewMode('chart')}
            disabled={!logs.some(log => log.weight)}
          >
            <FaChartLine /> グラフ
          </button>
        </div>
      </div>
      
      {viewMode === 'list' ? (
        <div className="logs-list">
          {logs.map(log => (
            <div 
              key={log.id} 
              className="log-item"
              onClick={() => onLogSelect && onLogSelect(log)}
            >
              <div className="log-date">
                <FaCalendarAlt />
                <span>{formatDate(log.log_date)}</span>
              </div>
              
              <div className="log-details">
                {log.weight && (
                  <div className="log-weight">
                    <FaWeight />
                    <span>{log.weight} kg</span>
                  </div>
                )}
                
                {log.memo && (
                  <div className="log-memo">
                    <FaStickyNote />
                    <p>{log.memo}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="chart-container">
          {logs.some(log => log.weight) ? (
            <Line data={prepareChartData()} options={chartOptions} />
          ) : (
            <div className="no-weight-data">
              体重データがありません
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyLogHistory; 