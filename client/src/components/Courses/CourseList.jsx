import React, { useState, useEffect } from 'react';
import { getCourses } from '../../services/api';
import { FaCalendarAlt, FaInfoCircle, FaClipboardList } from 'react-icons/fa';
import './CourseList.css';

const CourseList = ({ onCourseSelect }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data);
      } catch (err) {
        setError('コースの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    if (onCourseSelect) {
      onCourseSelect(course);
    }
  };

  if (loading) return <div className="loading-spinner">コースを読み込み中...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (courses.length === 0) return <div className="no-courses">コースがありません</div>;

  return (
    <div className="course-list-container">
      <h2 className="course-list-title">利用可能なコース</h2>
      <p className="course-list-subtitle">あなたの目標に合ったファスティングコースを選択しましょう</p>
      
      <div className="courses-grid">
        {courses.map(course => (
          <div 
            key={course.id} 
            className={`course-card ${selectedCourse?.id === course.id ? 'selected' : ''}`}
            onClick={() => handleCourseSelect(course)}
          >
            <div className="course-header" style={{ backgroundColor: course.color_code || '#4a90e2' }}>
              <h3>{course.name}</h3>
            </div>
            
            <div className="course-body">
              <p className="course-description">{course.description}</p>
              
              <div className="course-details">
                <div className="course-detail-item">
                  <FaCalendarAlt />
                  <div>
                    <span className="detail-label">総日数</span>
                    <span className="detail-value">{course.total_days}日</span>
                  </div>
                </div>
                
                <div className="course-detail-item">
                  <FaClipboardList />
                  <div>
                    <span className="detail-label">準備期間</span>
                    <span className="detail-value">{course.preparation_days}日</span>
                  </div>
                </div>
                
                <div className="course-detail-item">
                  <FaClipboardList />
                  <div>
                    <span className="detail-label">回復期間</span>
                    <span className="detail-value">{course.recovery_days}日</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="course-footer">
              <button className="course-info-button">
                <FaInfoCircle /> 詳細を見る
              </button>
              
              <button 
                className={`course-select-button ${selectedCourse?.id === course.id ? 'selected' : ''}`}
              >
                {selectedCourse?.id === course.id ? '選択中' : 'このコースを選択'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList; 