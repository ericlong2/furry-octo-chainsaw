/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createLandlord = /* GraphQL */ `
  mutation CreateLandlord(
    $input: CreateLandlordInput!
    $condition: ModelLandlordConditionInput
  ) {
    createLandlord(input: $input, condition: $condition) {
      id
      name
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
      name
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
      name
      properties
      createdAt
      updatedAt
    }
  }
`;
export const createSubtask = /* GraphQL */ `
  mutation CreateSubtask(
    $input: CreateSubtaskInput!
    $condition: ModelSubtaskConditionInput
  ) {
    createSubtask(input: $input, condition: $condition) {
      id
      title
      inprogress
      createdAt
      updatedAt
    }
  }
`;
export const updateSubtask = /* GraphQL */ `
  mutation UpdateSubtask(
    $input: UpdateSubtaskInput!
    $condition: ModelSubtaskConditionInput
  ) {
    updateSubtask(input: $input, condition: $condition) {
      id
      title
      inprogress
      createdAt
      updatedAt
    }
  }
`;
export const deleteSubtask = /* GraphQL */ `
  mutation DeleteSubtask(
    $input: DeleteSubtaskInput!
    $condition: ModelSubtaskConditionInput
  ) {
    deleteSubtask(input: $input, condition: $condition) {
      id
      title
      inprogress
      createdAt
      updatedAt
    }
  }
`;
export const createTask = /* GraphQL */ `
  mutation CreateTask(
    $input: CreateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    createTask(input: $input, condition: $condition) {
      id
      name
      color
      subtasks
      createdAt
      updatedAt
    }
  }
`;
export const updateTask = /* GraphQL */ `
  mutation UpdateTask(
    $input: UpdateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    updateTask(input: $input, condition: $condition) {
      id
      name
      color
      subtasks
      createdAt
      updatedAt
    }
  }
`;
export const deleteTask = /* GraphQL */ `
  mutation DeleteTask(
    $input: DeleteTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    deleteTask(input: $input, condition: $condition) {
      id
      name
      color
      subtasks
      createdAt
      updatedAt
    }
  }
`;
export const createInvitation = /* GraphQL */ `
  mutation CreateInvitation(
    $input: CreateInvitationInput!
    $condition: ModelInvitationConditionInput
  ) {
    createInvitation(input: $input, condition: $condition) {
      id
      propertyID
      leaseTerm
      leaseStart
      rentAmount
      tenant
      rejected
      createdAt
      updatedAt
    }
  }
`;
export const updateInvitation = /* GraphQL */ `
  mutation UpdateInvitation(
    $input: UpdateInvitationInput!
    $condition: ModelInvitationConditionInput
  ) {
    updateInvitation(input: $input, condition: $condition) {
      id
      propertyID
      leaseTerm
      leaseStart
      rentAmount
      tenant
      rejected
      createdAt
      updatedAt
    }
  }
`;
export const deleteInvitation = /* GraphQL */ `
  mutation DeleteInvitation(
    $input: DeleteInvitationInput!
    $condition: ModelInvitationConditionInput
  ) {
    deleteInvitation(input: $input, condition: $condition) {
      id
      propertyID
      leaseTerm
      leaseStart
      rentAmount
      tenant
      rejected
      createdAt
      updatedAt
    }
  }
`;
export const createTenant = /* GraphQL */ `
  mutation CreateTenant(
    $input: CreateTenantInput!
    $condition: ModelTenantConditionInput
  ) {
    createTenant(input: $input, condition: $condition) {
      id
      name
      invitations
      accepted
      createdAt
      updatedAt
    }
  }
`;
export const updateTenant = /* GraphQL */ `
  mutation UpdateTenant(
    $input: UpdateTenantInput!
    $condition: ModelTenantConditionInput
  ) {
    updateTenant(input: $input, condition: $condition) {
      id
      name
      invitations
      accepted
      createdAt
      updatedAt
    }
  }
`;
export const deleteTenant = /* GraphQL */ `
  mutation DeleteTenant(
    $input: DeleteTenantInput!
    $condition: ModelTenantConditionInput
  ) {
    deleteTenant(input: $input, condition: $condition) {
      id
      name
      invitations
      accepted
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
      address
      number
      houseNumber
      streetName
      city
      province
      country
      issues
      tasks
      tenants
      landlord
      invitations
      chatRoomID
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
      address
      number
      houseNumber
      streetName
      city
      province
      country
      issues
      tasks
      tenants
      landlord
      invitations
      chatRoomID
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
      address
      number
      houseNumber
      streetName
      city
      province
      country
      issues
      tasks
      tenants
      landlord
      invitations
      chatRoomID
      createdAt
      updatedAt
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      name
      imageUri
      status
      contacts
      chatRooms
      createdAt
      updatedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      name
      imageUri
      status
      contacts
      chatRooms
      createdAt
      updatedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      name
      imageUri
      status
      contacts
      chatRooms
      createdAt
      updatedAt
    }
  }
`;
export const createChatRoom = /* GraphQL */ `
  mutation CreateChatRoom(
    $input: CreateChatRoomInput!
    $condition: ModelChatRoomConditionInput
  ) {
    createChatRoom(input: $input, condition: $condition) {
      id
      name
      chatRoomUsers
      messages
      lastMessageID
      createdAt
      updatedAt
    }
  }
`;
export const updateChatRoom = /* GraphQL */ `
  mutation UpdateChatRoom(
    $input: UpdateChatRoomInput!
    $condition: ModelChatRoomConditionInput
  ) {
    updateChatRoom(input: $input, condition: $condition) {
      id
      name
      chatRoomUsers
      messages
      lastMessageID
      createdAt
      updatedAt
    }
  }
`;
export const deleteChatRoom = /* GraphQL */ `
  mutation DeleteChatRoom(
    $input: DeleteChatRoomInput!
    $condition: ModelChatRoomConditionInput
  ) {
    deleteChatRoom(input: $input, condition: $condition) {
      id
      name
      chatRoomUsers
      messages
      lastMessageID
      createdAt
      updatedAt
    }
  }
`;
export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
      id
      content
      userID
      userName
      chatRoomID
      createdAt
      updatedAt
    }
  }
`;
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
      id
      content
      userID
      userName
      chatRoomID
      createdAt
      updatedAt
    }
  }
`;
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
      id
      content
      userID
      userName
      chatRoomID
      createdAt
      updatedAt
    }
  }
`;
