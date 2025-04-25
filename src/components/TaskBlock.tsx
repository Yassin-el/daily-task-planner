import React from 'react';
import { calculateTaskPosition, formatTime } from '../utils/timeUtils';
import TaskTimer from './TaskTimer';

interface TaskBlockProps {
  task: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    color?: string;
    details?: string;
    resources?: string[];
    category?: string;
  };
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
  activeTimerId: string | null;
  onTimerToggle: (id: string) => void;
}

const TaskBlock: React.FC<TaskBlockProps> = ({ 
  task, 
  onDelete, 
  onClick, 
  activeTimerId,
  onTimerToggle
}) => {
  const { left, width } = calculateTaskPosition(task.startTime, task.endTime);
  
  const hasAdditionalInfo = task.details || (task.resources && task.resources.length > 0);
  const isTimerActive = activeTimerId === task.id;
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(task.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };
  
  const handleTimerToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTimerToggle(task.id);
  };
  
  const handleTimerComplete = () => {
    alert(`Tâche terminée: ${task.title}`);
  };
  
  return (
    <div 
      className="task-block" 
      style={{ 
        left: `${left}px`, 
        width: `${width}px`,
        backgroundColor: task.color || '#3498db' 
      }}
      onClick={handleClick}
    >
      <div className="task-header">
        <div className="task-title">{task.title}</div>
        <div className="task-time">
          {formatTime(task.startTime)} - {formatTime(task.endTime)}
        </div>
        
        {task.category && (
          <div className="task-category-tag">
            {task.category}
          </div>
        )}
      </div>
      
      <div className="task-controls">
        <TaskTimer 
          startTime={task.startTime}
          endTime={task.endTime}
          isRunning={isTimerActive}
          onComplete={handleTimerComplete}
          onToggle={handleTimerToggle}
        />
      </div>
      
      {hasAdditionalInfo && (
        <div className="info-indicator">ℹ️</div>
      )}
      
      <button 
        className="delete-btn" 
        onClick={handleDeleteClick}
        aria-label="Delete task"
      >
        ×
      </button>
    </div>
  );
};

export default TaskBlock; 