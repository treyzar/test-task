import React from "react";
import { Link } from "react-router-dom";
import type { Task } from "../../entities/task/task.types";
import "./TasksList.scss";

interface Props {
  tasks: Task[];
}

export const TaskList: React.FC<Props> = ({ tasks }) => {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className="task-list__item">
          <Link to={`/tasks/${task.id}`} className="task-list__link">
            <h3 className="task-list__title">{task.title}</h3>
            <p className="task-list__description">
              {task.description || "Описание отсутствует"}
            </p>
            <p className="task-list__assignee">
              Исполнитель:{" "}
              {task.assignee
                ? `${task.assignee.first_name} ${task.assignee.last_name}`
                : "Не назначен"}
            </p>
            <div className="task-list__labels">
              {task.task_labels.map(({ label }) => (
                <span
                  key={label.id}
                  className="task-list__label-tag"
                  style={{ backgroundColor: label.color }}
                >
                  {label.caption}
                </span>
              ))}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};
