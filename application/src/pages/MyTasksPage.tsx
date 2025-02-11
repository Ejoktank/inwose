import React from "react";
import { PageWrapper } from "../components/PageWrapper";
import { UpcomingTask } from "../partials/UpcomingTask";
import { CompletedTask } from "../partials/CompletedTask";
import { useGetTasks } from "../hooks/useGetTasks";
import { useAuth } from "../context/AuthContext";

export function MyTasksPage() {
  const tasks = useGetTasks();
  
  return (
    <PageWrapper>
      <div className="container-grid">
        <div className="grid grid-cols-2">
          <div>Время</div>
          <div>Размер</div>
        </div>
        <div>Задачи</div>
      </div>
      {tasks.tasks.length > 0 ? (
        <>
          {tasks.upcoming.map(task => (
            <UpcomingTask {...task} key={`${task.id}-${task.dateOfComplete}_${task.timeForComplete}`} />
          ))}
          <div className="container-grid">
            <div className=""></div>
            <div className="">Завершённые</div>
          </div>
          {tasks.completed.map(task => (
            <CompletedTask {...task}  key={`${task.id}-${task.dateOfComplete}_${task.timeForComplete}`} />
          ))}
        </>
      ) : (<p>Loading...</p>)}
    </PageWrapper>
  )
};