import React, { useState, useEffect } from 'react';

interface TaskTimerProps {
  startTime: string;
  endTime: string;
  isRunning: boolean;
  onComplete: () => void;
  onToggle: () => void;
}

const TaskTimer: React.FC<TaskTimerProps> = ({ 
  startTime, 
  endTime, 
  isRunning, 
  onComplete,
  onToggle
}) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [initialTime, setInitialTime] = useState<number>(0);

  // Calculate the duration in seconds
  useEffect(() => {
    const start = startTime.split(':').map(Number);
    const end = endTime.split(':').map(Number);
    
    const startSeconds = start[0] * 3600 + start[1] * 60;
    const endSeconds = end[0] * 3600 + end[1] * 60;
    
    const durationSeconds = endSeconds - startSeconds;
    setRemainingTime(durationSeconds);
    setInitialTime(durationSeconds);
  }, [startTime, endTime]);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isRunning && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            if (timer) clearInterval(timer);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, remainingTime, onComplete]);

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  // Calculate progress percentage
  const progressPercent = initialTime > 0 
    ? ((initialTime - remainingTime) / initialTime) * 100 
    : 0;

  return (
    <div className="task-timer">
      <div className="timer-display">
        <div className="timer-progress" style={{ width: `${progressPercent}%` }}></div>
        <div className="timer-text">{formatTime(remainingTime)}</div>
      </div>
      <button 
        className="timer-toggle-btn" 
        onClick={onToggle}
        aria-label={isRunning ? "Pause timer" : "Start timer"}
      >
        {isRunning ? '⏸' : '▶️'}
      </button>
    </div>
  );
};

export default TaskTimer; 