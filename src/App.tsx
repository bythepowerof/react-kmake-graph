import React from 'react';

import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";
import{Kmake, KmakeObject, KmakeScheduleRun} from "./gqlKmake";


const GET_KMAKE_INFO = gql`
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
interface KmakeObjects {
  kmakeObjects: KmakeObject[];
}
export function KmakeInventoryList() {
  const { loading, data } = useQuery<KmakeObjects>(
    GET_KMAKE_INFO,
  );
  return (
    <div>
      <h3>Available Inventory</h3>
      {loading ? (
        <p>Loading ...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>name</th>
              <th>status</th>
              <th>class</th>
            </tr>
          </thead>
          <tbody>
            {data && data.kmakeObjects.map(kmake => (
              <tr>
                <td>{kmake.name}</td>
                <td>{kmake.status}</td>
                <td>{kmake.constructor.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default KmakeInventoryList;