import React from 'react';
import { formatTime } from '../utils/timeUtils';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TaskDetailModalProps {
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
  } | null;
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
  if (!task) return null;

  // Format the date
  const formattedDate = format(parseISO(task.date), 'EEEE d MMMM yyyy', { locale: fr });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="task-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ backgroundColor: task.color || '#3498db' }}>
          <h2>{task.title}</h2>
          <button className="close-modal-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="detail-section">
            <h3>Date</h3>
            <p className="date-display">{formattedDate}</p>
          </div>

          <div className="detail-section">
            <h3>Horaires</h3>
            <p className="time-range">
              {formatTime(task.startTime)} - {formatTime(task.endTime)}
            </p>
          </div>
          
          {task.category && (
            <div className="detail-section">
              <h3>Catégorie</h3>
              <div className="category-badge" style={{ backgroundColor: task.color || '#3498db' }}>
                {task.category}
              </div>
            </div>
          )}
          
          {task.details && (
            <div className="detail-section">
              <h3>Détails</h3>
              <p className="task-detail-text">{task.details}</p>
            </div>
          )}
          
          {task.resources && task.resources.length > 0 && (
            <div className="detail-section">
              <h3>Ressources</h3>
              <div className="resource-list-modal">
                {task.resources.map((resource, index) => (
                  <div key={index} className="resource-tag">{resource}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal; 