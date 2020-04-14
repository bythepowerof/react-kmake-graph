import React from 'react';

import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";


const GET_POKEMON_INFO = gql`
{
  kmakeObjects(namespace: "default") {
    __typename
    name
    namespace
    status
    ... on KmakeScheduleRun {
      kmakename
      kmakerunname
      kmakeschedulename
    }
    ... on KmakeRun {
      kmakename
    }
    ... on KmakeNowScheduler {
      monitor
    }
    ... on Kmake {
      variables {
        key
        value
      }
    }
  }
  }
`
function App() {
  const { data, loading, error } = useQuery(GET_POKEMON_INFO);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  console.log(data);

  return (
    <React.Fragment>
      <h1>Kmake</h1>
      <div className="container">
        {data && data.kmakeObjects &&
          data.kmakeObjects.map((kmake, index) => (
            <div key={index} className="card">
              <div class="card-body">
                <h3>{kmake.name}</h3>
                <p>{kmake.status}</p>
              </div>
            </div>

          ))}
      </div>
    </React.Fragment>
  );
}

export default App;