import React, { useEffect, Fragment, useState } from "react";

import { useQuery, useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Kmake, KmakeObject, KmakeScheduleRun, KmakeRun, KmakeScheduler } from "./gqlKmake";


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

// changed(input:{namespace: "default"}) {

const GET_KMAKE_SUBS = gql`
    subscription xxx {
      changed(input:{namespace: "default"}) {
        __typename
        name
        namespace
        status
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
                <th>monitor</th>
              </tr>
            </thead>
            <tbody>
              {data && data.kmakeObjects.map((kmake: any) => (
                <tr>
                  <td>{kmake.name}</td>
                  <td>{kmake.status}</td>
                  <td>{kmake?.monitor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  );
}

// export default KmakeInventoryList;

export function KmakeInventorySubscription() {

  const { loading, error, data } = useSubscription(
    GET_KMAKE_SUBS
  );

  if (loading) {
    return <span>Loading...</span>;
  }
  if (error) {
    console.error(error);
    return <span>Error!</span>;
  }
  //  if (data) {
  //    onlineUsersList = data.online_users.map(u => (
  //      <OnlineUser key={u.id} user={u.user} />
  //    ));
  //  }

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
                <th>monitor</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>{data.changed.name}</td>
                  <td>{data.changed.status}</td>
                  <td>{data.changed?.monitor}</td>
                </tr>
            </tbody>
          </table>
        )}
    </div>
  );
};
  // export default KmakeInventorySubscription;