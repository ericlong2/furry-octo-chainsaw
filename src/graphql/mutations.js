/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createLandlord = /* GraphQL */ `
  mutation CreateLandlord(
    $input: CreateLandlordInput!
    $condition: ModelLandlordConditionInput
  ) {
    createLandlord(input: $input, condition: $condition) {
      id
      properties
      createdAt
      updatedAt
    }
  }
`;
export const updateLandlord = /* GraphQL */ `
  mutation UpdateLandlord(
    $input: UpdateLandlordInput!
    $condition: ModelLandlordConditionInput
  ) {
    updateLandlord(input: $input, condition: $condition) {
      id
      properties
      createdAt
      updatedAt
    }
  }
`;
export const deleteLandlord = /* GraphQL */ `
  mutation DeleteLandlord(
    $input: DeleteLandlordInput!
    $condition: ModelLandlordConditionInput
  ) {
    deleteLandlord(input: $input, condition: $condition) {
      id
      properties
      createdAt
      updatedAt
    }
  }
`;
export const createProperty = /* GraphQL */ `
  mutation CreateProperty(
    $input: CreatePropertyInput!
    $condition: ModelPropertyConditionInput
  ) {
    createProperty(input: $input, condition: $condition) {
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
export const updateProperty = /* GraphQL */ `
  mutation UpdateProperty(
    $input: UpdatePropertyInput!
    $condition: ModelPropertyConditionInput
  ) {
    updateProperty(input: $input, condition: $condition) {
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
export const deleteProperty = /* GraphQL */ `
  mutation DeleteProperty(
    $input: DeletePropertyInput!
    $condition: ModelPropertyConditionInput
  ) {
    deleteProperty(input: $input, condition: $condition) {
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
