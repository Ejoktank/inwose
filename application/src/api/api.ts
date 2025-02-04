import { TaskProps } from "../types/types";

export const createTask = async (body: TaskProps) => {
  console.log(body);
  const token = localStorage.getItem("token");
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log("Task created!");
  console.log(data);
  alert("Таск создан!");
  location.reload();
};

export const getAllTasks = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch("/api/tasks", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (response.status === 401) {
    return;
  }
  const data = await response.json();
  console.log("Here they are!");
  return data;
};

export const updateTask = async (taskId: number | undefined, updatedFields: TaskProps) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedFields),
  });

  const data = await response.json();
  console.log("Task updated!", data);
  alert("Изменения применены успешно!");
  location.reload();
  return data;
};

export const authenticatedFetch = (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
