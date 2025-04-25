import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface TaskFormProps {
  onAdd: (task: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    color?: string;
    details?: string;
    resources?: string[];
    category?: string;
  }) => void;
  currentDate: string;
}

const CATEGORIES = ['Travail', 'Personnel', 'Étude', 'Santé', 'Autre'];

const TaskForm: React.FC<TaskFormProps> = ({ onAdd, currentDate }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(currentDate);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [color, setColor] = useState('#3498db');
  const [details, setDetails] = useState('');
  const [category, setCategory] = useState('');
  const [resourceInput, setResourceInput] = useState('');
  const [resources, setResources] = useState<string[]>([]);
  
  // Update form date when currentDate changes
  useEffect(() => {
    setDate(currentDate);
  }, [currentDate]);

  const handleAddResource = () => {
    if (!resourceInput.trim()) return;
    setResources([...resources, resourceInput.trim()]);
    setResourceInput('');
  };

  const handleRemoveResource = (index: number) => {
    const newResources = [...resources];
    newResources.splice(index, 1);
    setResources(newResources);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddResource();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }
    
    // Validate time
    const start = startTime.split(':').map(Number);
    const end = endTime.split(':').map(Number);
    
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    
    if (endMinutes <= startMinutes) {
      alert('End time must be after start time');
      return;
    }
    
    // Create new task with unique ID
    const newTask = {
      id: Date.now().toString(),
      title,
      date,
      startTime,
      endTime,
      color,
      details: details.trim() || undefined,
      resources: resources.length > 0 ? resources : undefined,
      category: category || undefined
    };
    
    // Add task through parent component
    onAdd(newTask);
    
    // Reset form
    setTitle('');
    setDetails('');
    setResources([]);
    // Keep times and date as they were
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group flex-grow">
          <label htmlFor="task-title">Titre de la tâche:</label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entrez le nom de la tâche"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="task-category">Catégorie:</label>
          <select
            id="task-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-input"
          >
            <option value="">Sélectionner une catégorie</option>
            {CATEGORIES.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="task-date">Date:</label>
          <input
            id="task-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="start-time">Heure de début:</label>
          <input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="end-time">Heure de fin:</label>
          <input
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="task-color">Couleur:</label>
          <input
            id="task-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="task-details">Détails:</label>
        <textarea
          id="task-details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Entrez les détails de la tâche (optionnel)"
          rows={3}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="task-resources">Ressources:</label>
        <div className="resource-input-container">
          <input
            id="task-resources"
            type="text"
            value={resourceInput}
            onChange={(e) => setResourceInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ajouter une ressource et appuyer sur Entrée"
          />
          <button 
            type="button" 
            className="resource-add-btn"
            onClick={handleAddResource}
          >
            +
          </button>
        </div>
        
        {resources.length > 0 && (
          <div className="resources-list">
            {resources.map((resource, index) => (
              <div key={index} className="resource-tag">
                <span>{resource}</span>
                <button 
                  type="button"
                  onClick={() => handleRemoveResource(index)}
                  className="resource-remove-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <button type="submit" className="add-button">Ajouter la tâche</button>
    </form>
  );
};

export default TaskForm; 