import { format, parseISO } from 'date-fns';

// Convert time string (HH:MM) to hours
export const timeToHours = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours + minutes / 60;
};

// Calculate position and width for timeline display
export const calculateTaskPosition = (
  startTime: string,
  endTime: string,
  startHour: number = 8, // Default day starts at 8AM
  hourWidth: number = 60 // Width of 1 hour in pixels
): { left: number; width: number } => {
  const startHours = timeToHours(startTime);
  const endHours = timeToHours(endTime);
  const duration = endHours - startHours;
  
  // Position from left based on start time
  const left = (startHours - startHour) * hourWidth;
  // Width based on duration
  const width = duration * hourWidth;
  
  return { left, width };
};

// Format time for display
export const formatTime = (timeString: string): string => {
  // Create a full date string to use with date-fns
  const today = new Date().toISOString().split('T')[0];
  const dateTimeString = `${today}T${timeString}:00`;
  
  return format(parseISO(dateTimeString), 'h:mm a');
};

// Generate hour markers for the timeline (e.g., 8AM, 9AM, etc.)
export const generateHourMarkers = (
  startHour: number = 8, 
  endHour: number = 20
): string[] => {
  const markers = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    const hourStr = hour.toString().padStart(2, '0');
    markers.push(`${hourStr}:00`);
  }
  return markers;
}; 