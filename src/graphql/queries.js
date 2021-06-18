/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getLandlord = /* GraphQL */ `
  query GetLandlord($id: ID!) {
    getLandlord(id: $id) {
      id
      properties
      createdAt
      updatedAt
    }
  }
`;
export const listLandlords = /* GraphQL */ `
  query ListLandlords(
    $filter: ModelLandlordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLandlords(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        properties
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProperty = /* GraphQL */ `
  query GetProperty($id: ID!) {
    getProperty(id: $id) {
      id
      number
      address
      city
      issues
      createdAt
      updatedAt
    }
  }
`;
export const listPropertys = /* GraphQL */ `
  query ListPropertys(
    $filter: ModelPropertyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPropertys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        number
        address
        city
        issues
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
