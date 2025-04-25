import React from 'react';
import TaskBlock from './TaskBlock';
import { generateHourMarkers, formatTime } from '../utils/timeUtils';

interface TimelineProps {
  tasks: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    color?: string;
    details?: string;
    resources?: string[];
    category?: string;
  }[];
  onDelete: (id: string) => void;
  onTaskClick: (id: string) => void;
  startHour?: number;
  endHour?: number;
  activeTimerId: string | null;
  onTimerToggle: (id: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ 
  tasks, 
  onDelete, 
  onTaskClick,
  startHour = 8, 
  endHour = 20,
  activeTimerId,
  onTimerToggle
}) => {
  const hourMarkers = generateHourMarkers(startHour, endHour);
  const timelineWidth = (endHour - startHour + 1) * 60; // 60px per hour
  
  return (
    <div className="timeline-container">
      <div className="hour-markers" style={{ width: `${timelineWidth}px` }}>
        {hourMarkers.map((time, index) => (
          <div key={index} className="hour-marker">
            <div className="hour-label">{formatTime(time)}</div>
            <div className="hour-line"></div>
          </div>
        ))}
      </div>
      
      <div className="tasks-container" style={{ width: `${timelineWidth}px` }}>
        {tasks.map((task) => (
          <TaskBlock 
            key={task.id} 
            task={task} 
            onDelete={onDelete}
            onClick={onTaskClick}
            activeTimerId={activeTimerId}
            onTimerToggle={onTimerToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline; 