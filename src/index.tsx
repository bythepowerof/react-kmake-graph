import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {KmakeInventorySubscription, KmakeInventoryList} from './App';
import * as serviceWorker from './serviceWorker';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import introspectionQueryResultData from './fragmentTypes.json';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

// const cache = new InMemoryCache();
const httpLink = new HttpLink({
  uri: 'http://localhost:8080/query'
})

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:8080/query',
  options: {
    reconnect: true
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const cache = new InMemoryCache({ fragmentMatcher });

const client = new ApolloClient({
  cache,
  link
})


ReactDOM.render(<ApolloProvider client={client}><KmakeInventoryList /></ApolloProvider>, document.getElementById('list'));
ReactDOM.render(<ApolloProvider client={client}><KmakeInventorySubscription /></ApolloProvider>, document.getElementById('subs'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();