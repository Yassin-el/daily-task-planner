import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import Timeline from './components/Timeline';
import TaskDetailModal from './components/TaskDetailModal';
import { format, addDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import './App.css';

interface Task {
  id: string;
  title: string;
  date: string; // Format YYYY-MM-DD
  startTime: string;
  endTime: string;
  color?: string;
  details?: string;
  resources?: string[];
  category?: string;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage on initial render
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // State for selected task and modal
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // State for current date
  const [currentDate, setCurrentDate] = useState<string>(() => {
    return format(new Date(), 'yyyy-MM-dd');
  });
  
  // State for task filter
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // State for the active timer
  const [activeTimerId, setActiveTimerId] = useState<string | null>(null);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
    }
  };

  const closeTaskDetails = () => {
    setSelectedTask(null);
  };
  
  // Navigate to previous day
  const goToPreviousDay = () => {
    setCurrentDate(format(addDays(parseISO(currentDate), -1), 'yyyy-MM-dd'));
  };
  
  // Navigate to next day
  const goToNextDay = () => {
    setCurrentDate(format(addDays(parseISO(currentDate), 1), 'yyyy-MM-dd'));
  };
  
  // Go to today
  const goToToday = () => {
    setCurrentDate(format(new Date(), 'yyyy-MM-dd'));
  };
  
  // Get all available categories from tasks
  const allCategories = [...new Set(tasks.filter(task => task.category).map(task => task.category))];
  
  // Filter tasks based on search term and category
  const filteredTasks = tasks.filter(task => {
    const matchesDate = task.date === currentDate;
    const matchesSearch = !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.details && task.details.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !categoryFilter || task.category === categoryFilter;
    
    return matchesDate && matchesSearch && matchesCategory;
  });

  // Toggle timer for a task
  const handleTimerToggle = (taskId: string) => {
    setActiveTimerId(current => current === taskId ? null : taskId);
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <header className="app-header">
        <h1>📅 TaskFlow</h1>
        <button 
          className="theme-toggle" 
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>
      
      <section className="date-navigation">
        <button className="date-nav-btn" onClick={goToPreviousDay}>
          &lt; Jour précédent
        </button>
        <div className="current-date">
          <h2>{format(parseISO(currentDate), 'EEEE d MMMM yyyy', { locale: fr })}</h2>
          <button className="today-btn" onClick={goToToday}>Aujourd'hui</button>
        </div>
        <button className="date-nav-btn" onClick={goToNextDay}>
          Jour suivant &gt;
        </button>
      </section>
      
      <section className="filters-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher des tâches par titre ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        {allCategories.length > 0 && (
          <div className="category-filter">
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="category-select"
            >
              <option value="">Toutes les catégories</option>
              {allCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}
      </section>
      
      <div className="main-content">
        <section className="form-section">
          <h2>Ajouter une tâche</h2>
          <TaskForm onAdd={addTask} currentDate={currentDate} />
        </section>
        
        <section className="timeline-section">
          <h2>Planning du {format(parseISO(currentDate), 'd MMMM', { locale: fr })}</h2>
          {filteredTasks.length > 0 ? (
            <Timeline 
              tasks={filteredTasks} 
              onDelete={deleteTask} 
              onTaskClick={handleTaskClick}
              activeTimerId={activeTimerId}
              onTimerToggle={handleTimerToggle}
            />
          ) : (
            <div className="no-tasks-message">
              <p>Aucune tâche pour cette journée. Ajoutez une tâche pour commencer.</p>
            </div>
          )}
        </section>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal 
        task={selectedTask} 
        onClose={closeTaskDetails} 
      />
    </div>
  );
};

export default App;
