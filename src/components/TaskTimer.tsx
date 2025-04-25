import React, { useState, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';

interface TaskTimerProps {
  startTime: string;
  endTime: string;
  isRunning: boolean;
  onComplete: () => void;
  onToggle: (e: React.MouseEvent) => void;
}

// Définir un type pour le timer
type TimerId = ReturnType<typeof setTimeout>;

const TaskTimer: React.FC<TaskTimerProps> = ({ 
  startTime, 
  endTime, 
  isRunning,
  onComplete,
  onToggle
}) => {
  // Calculer la durée totale en secondes
  const calculateTotalSeconds = () => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0);
    
    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0);
    
    return differenceInSeconds(endDate, startDate);
  };
  
  const totalSeconds = calculateTotalSeconds();
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerId, setTimerId] = useState<TimerId | null>(null);
  
  useEffect(() => {
    if (isRunning) {
      const id = setInterval(() => {
        setSecondsElapsed(prev => {
          const newValue = prev + 1;
          if (newValue >= totalSeconds) {
            clearInterval(id);
            onComplete();
            return totalSeconds;
          }
          return newValue;
        });
      }, 1000);
      
      setTimerId(id);
      return () => clearInterval(id);
    } else if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  }, [isRunning, totalSeconds, onComplete]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progressPercent = (secondsElapsed / totalSeconds) * 100;
  
  return (
    <div className="task-timer">
      <div className="timer-text">
        <span>{formatTime(secondsElapsed)}</span>
        <span>/</span>
        <span>{formatTime(totalSeconds)}</span>
      </div>
      <div className="timer-display">
        <div 
          className="timer-progress" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <button 
        className="timer-toggle-btn" 
        onClick={onToggle}
      >
        {isRunning ? '❚❚' : '▶'}
      </button>
    </div>
  );
};

export default TaskTimer; 