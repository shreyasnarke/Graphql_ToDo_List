import { useQuery, gql } from '@apollo/client';

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      completed
      userId
      user {
        name
        email
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_TODOS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Todos</h1>
      <ul>
        {data.todos.map(todo => (
          <li key={todo.id}>
            <h3>{todo.title}</h3>
            <p>Completed: {todo.completed ? 'Yes' : 'No'}</p>
            {todo.user && (
              <p>User: {todo.user.name} ({todo.user.email})</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;