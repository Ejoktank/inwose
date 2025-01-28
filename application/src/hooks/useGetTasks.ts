import { useEffect, useState } from "react";
import { TaskProps } from "../types/types";
import { getAllTasks } from "../api/api";

export function useGetTasks() {
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksData = await getAllTasks();
      setTasks(tasksData);
    };

    fetchTasks();
  }, []);

  const upcoming = tasks.filter(task => task.taskStatus === 'upcoming');
  const completed = tasks.filter(task => task.taskStatus === 'completed');

  return { tasks, upcoming, completed };
}