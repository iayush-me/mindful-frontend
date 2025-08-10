import apiClient from './apiClient';

const getSchedule = () => apiClient.get('/schedule').then(res => res.data);
const setSchedule = (schedule) => apiClient.post('/schedule', schedule).then(res => res.data);
const getDailyMoodSummary = () =>apiClient.get('/schedule/daily-mood-summary').then(res => res.data);
// New methods (for Daily Schedule Mood page)
const getScheduleToday = () => apiClient.get('/schedule/today').then(res => res.data);
const addTask = (task) => apiClient.post('/schedule/add', task).then(res => res.data);
const updateTaskDone = (taskId, done) => apiClient.post('/schedule/update', { taskId, done }).then(res => res.data);
const saveMood = (taskId, moodCaption, sentiment) => apiClient.post('/schedule/mood', { taskId, moodCaption, sentiment }).then(res => res.data);
export default {
  getSchedule,
  setSchedule,
  getDailyMoodSummary,
  getScheduleToday,
  addTask,
  updateTaskDone,
  saveMood,
};
