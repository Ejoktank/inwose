import { TaskProps } from "../types/types";


export const createTask = async (body: TaskProps) => {
  console.log(body);
  
  const response = await fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log("Task created!");  
  console.log(data);
  alert("Таск создан!");
  location.reload()
};

export const getAllTasks = async () => {
  const response = await fetch("http://localhost:3000/tasks");
  const data = await response.json();
  console.log("Here they are!");
  return data
};

export const updateTask = async (taskId: number | undefined, updatedFields: TaskProps) => {
  const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedFields),
  });

  const data = await response.json();
  console.log("Task updated!", data);
  alert("Изменения применены успешно!");
  location.reload()
  return data;
};

