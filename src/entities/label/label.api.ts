import { graphqlClient } from '../../shared/api/graphqlClient';
import type { Label } from './label.types';

const GET_LABELS = `
  query GetAllLabels {
    labels {
      id
      caption
      color
    }
  }
`;

export const getLabels = async (): Promise<Label[]> => {
  const result = await graphqlClient<{ labels: Label[] }>({
    query: GET_LABELS,
  });

  return result.labels;
};