import { graphqlClient } from '../../shared/api/graphqlClient';
import type { Task } from './task.types';

const GET_TASKS = `
  query GetAllTasks {
    tasks {
      id
      title
      description
      assignee_id
      assignee {
        id
        first_name
        last_name
        bio
      }
      task_labels {
        label {
          id
          caption
          color
        }
      }
    }
  }
`;

const GET_TASK_BY_ID = `
  query GetTaskById($id: Int!) {
    tasks_by_pk(id: $id) {
      id
      title
      description
      assignee_id
      assignee {
        id
        first_name
        last_name
        bio
      }
      task_labels {
        label {
          id
          caption
          color
        }
      }
    }
  }
`;

export const getTasks = async (): Promise<Task[]> => {
  const result = await graphqlClient<{ tasks: Task[] }>({
    query: GET_TASKS,
  });

  return result.tasks;
};

export const getTaskById = async (id: number): Promise<Task | null> => {
  const result = await graphqlClient<{
    tasks_by_pk: Task | null;
  }>({
    query: GET_TASK_BY_ID,
    variables: { id },
  });

  return result.tasks_by_pk;
};