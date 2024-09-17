import { loadTasks, updatePercentage } from './taskManager.js';
import { loadHistory, updateStreak} from './historyManager.js'


document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadHistory();
    updatePercentage();
    updateStreak();
});
