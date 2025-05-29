const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL;

type GraphQLOptions = {
  query: string;
  variables?: Record<string, any>;
};

export const graphqlClient = async <T>(options: GraphQLOptions): Promise<T> => {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": import.meta.env.VITE_HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({
      query: options.query,
      variables: options.variables || {},
    }),
  });

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data as T;
};
