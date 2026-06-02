import { mockDeadlines, MockDeadline } from '../lib/mockData';

const STORAGE_KEY = 'belog_deadlines';
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

function getDeadlines(): MockDeadline[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored) as MockDeadline[];
  
  const oldStored = localStorage.getItem('sharedata_deadlines');
  if (oldStored) {
    localStorage.setItem(STORAGE_KEY, oldStored);
    return JSON.parse(oldStored) as MockDeadline[];
  }
  
  return [...mockDeadlines];
}

function saveDeadlines(deadlines: MockDeadline[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(deadlines));
}

export const deadlineService = {
  async getAll(): Promise<MockDeadline[]> {
    await delay(200);
    return getDeadlines().sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  },

  async getUpcoming(days = 3): Promise<MockDeadline[]> {
    await delay(200);
    const now = new Date();
    const limit = new Date();
    limit.setDate(limit.getDate() + days);

    return getDeadlines()
      .filter((d) => {
        const due = new Date(d.dueDate);
        return due >= new Date(now.getFullYear(), now.getMonth(), now.getDate()) && due <= limit;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  },

  async create(data: Omit<MockDeadline, 'id' | 'completed'>): Promise<MockDeadline> {
    await delay(300);
    const deadlines = getDeadlines();
    const newDeadline: MockDeadline = {
      id: `dl-${Date.now()}`,
      completed: false,
      ...data,
    };
    deadlines.push(newDeadline);
    saveDeadlines(deadlines);
    return newDeadline;
  },

  async toggleComplete(id: string): Promise<MockDeadline> {
    await delay(200);
    const deadlines = getDeadlines();
    const idx = deadlines.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('마감일을 찾을 수 없습니다.');

    deadlines[idx].completed = !deadlines[idx].completed;
    saveDeadlines(deadlines);
    return deadlines[idx];
  },

  async delete(id: string): Promise<void> {
    await delay(200);
    const deadlines = getDeadlines().filter((d) => d.id !== id);
    saveDeadlines(deadlines);
  },
};
