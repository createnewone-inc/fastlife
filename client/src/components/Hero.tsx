// src/components/Hero.tsx
import React from 'react';
import './Hero.css';
import { useCourse } from '../context/CourseContext';

const courses = [
  { 
    id: 'beginner', 
    name: 'Beginner', 
    duration: 7, 
    difficulty: '7日間 | 初心者向けです。ファスティングをしたことがない方向け'
  },
  { 
    id: 'intermediate', 
    name: 'Intermediate', 
    duration: 14, 
    difficulty: '14日間 | 中級者向けです。過去に何度かファスティングをしたことがある人向け'
  },
  { 
    id: 'advanced', 
    name: 'Advanced', 
    duration: 21, 
    difficulty: '21日間 | 上級者向けです。定期的にファスティングを取り入れ、健康を意識している人向け'
  }
];

const Hero: React.FC = () => {
  const { setSelectedCourse } = useCourse();

  const handleSelectCourse = (courseId: string) => {
    const chosen = courses.find((c) => c.id === courseId);
    if (chosen) {
      const message = `${chosen.name}コースを始めます。よろしいですか？`;
      if (window.confirm(message)) {
        setSelectedCourse(chosen);
      }
    }
  };

  return (
    <div className="hero">
      <div className="overlay">
        <h1 className="hero-title">ファスティングで健康的な生活を</h1>
        <p className="hero-subtitle">あなたに合ったコースを選択してください</p>
        <div className="course-buttons">
          {courses.map((course) => (
            <button
              key={course.id}
              className="course-button"
              onClick={() => handleSelectCourse(course.id)}
            >
              <span className="course-name">{course.name}</span>
              <span className="course-info">{course.difficulty}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
