import { useApi } from "../hooks/useApi"
import { api } from "../lib/fetcher/api";

export function useGetTasks() {
  const { data: tasks } = useApi(api.tasks.list, {})

  const upcoming = tasks?.filter(task => task.taskStatus === 'upcoming');
  const completed = tasks?.filter(task => task.taskStatus === 'completed');

  return { 
    tasks: tasks ?? [], 
    upcoming: upcoming ?? [], 
    completed: completed ?? [] 
  };
}