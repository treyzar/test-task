import React from "react";
import { TaskList } from "./TasksList";
import { CreateTaskForm } from "../../features/create-task/CreateTaskForm";
import { getTasks } from "../../entities/task/task.api";
import type { Task } from "../../entities/task/task.types";
import { getUsers } from "../../entities/user/user.api";
import type { User } from "../../entities/user/user.types";
import { getLabels } from "../../entities/label/label.api";
import type { Label } from "../../entities/label/label.types";
import { Input } from "../../shared/ui/Input";
import { Button } from "../../shared/ui/Button";
import "./TasksPage.scss";

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterAssignee, setFilterAssignee] = React.useState<number | "">("");
  const [filterLabel, setFilterLabel] = React.useState<number | "">("");

  const [users, setUsers] = React.useState<User[]>([]);
  const [labels, setLabels] = React.useState<Label[]>([]);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      const [tasksData, usersData, labelsData] = await Promise.all([
        getTasks(),
        getUsers(),
        getLabels(),
      ]);
      setTasks(tasksData);
      setUsers(usersData);
      setLabels(labelsData);
      setLoading(false);
    };
    load();
  }, []);

  const applyFilters = () => {
    let filtered = [...tasks];

    if (searchTerm) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterAssignee !== "") {
      filtered = filtered.filter((task) => task.assignee_id === filterAssignee);
    }

    if (filterLabel !== "") {
      filtered = filtered.filter((task) =>
        task.task_labels.some((tl) => tl.label.id === filterLabel)
      );
    }

    return filtered;
  };

  const handleCreate = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Задачи</h2>

      <div className="tasks-header">
        <div className="filters">
          <Input
            placeholder="Поиск по заголовку"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(Number(e.target.value) || "")}
          >
            <option value="">Все исполнители</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name}
              </option>
            ))}
          </select>

          <select
            value={filterLabel}
            onChange={(e) => setFilterLabel(Number(e.target.value) || "")}
          >
            <option value="">Все метки</option>
            {labels.map((label) => (
              <option key={label.id} value={label.id}>
                {label.caption}
              </option>
            ))}
          </select>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>+ Новая задача</Button>
      </div>

      <TaskList tasks={applyFilters()} />

      {isModalOpen && (
        <CreateTaskForm
          onTaskCreated={handleCreate}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
