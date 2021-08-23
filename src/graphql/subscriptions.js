/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateLandlord = /* GraphQL */ `
  subscription OnCreateLandlord {
    onCreateLandlord {
      id
      name
      properties
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateLandlord = /* GraphQL */ `
  subscription OnUpdateLandlord {
    onUpdateLandlord {
      id
      name
      properties
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteLandlord = /* GraphQL */ `
  subscription OnDeleteLandlord {
    onDeleteLandlord {
      id
      name
      properties
      createdAt
      updatedAt
    }
  }
`;
export const onCreateSubtask = /* GraphQL */ `
  subscription OnCreateSubtask {
    onCreateSubtask {
      id
      title
      inprogress
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateSubtask = /* GraphQL */ `
  subscription OnUpdateSubtask {
    onUpdateSubtask {
      id
      title
      inprogress
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteSubtask = /* GraphQL */ `
  subscription OnDeleteSubtask {
    onDeleteSubtask {
      id
      title
      inprogress
      createdAt
      updatedAt
    }
  }
`;
export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask {
    onCreateTask {
      id
      name
      color
      subtasks
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask {
    onUpdateTask {
      id
      name
      color
      subtasks
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask {
    onDeleteTask {
      id
      name
      color
      subtasks
      createdAt
      updatedAt
    }
  }
`;
export const onCreateInvitation = /* GraphQL */ `
  subscription OnCreateInvitation {
    onCreateInvitation {
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
export const onUpdateInvitation = /* GraphQL */ `
  subscription OnUpdateInvitation {
    onUpdateInvitation {
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
export const onDeleteInvitation = /* GraphQL */ `
  subscription OnDeleteInvitation {
    onDeleteInvitation {
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
export const onCreateTenant = /* GraphQL */ `
  subscription OnCreateTenant {
    onCreateTenant {
      id
      name
      invitations
      accepted
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTenant = /* GraphQL */ `
  subscription OnUpdateTenant {
    onUpdateTenant {
      id
      name
      invitations
      accepted
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTenant = /* GraphQL */ `
  subscription OnDeleteTenant {
    onDeleteTenant {
      id
      name
      invitations
      accepted
      createdAt
      updatedAt
    }
  }
`;
export const onCreateProperty = /* GraphQL */ `
  subscription OnCreateProperty {
    onCreateProperty {
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
export const onUpdateProperty = /* GraphQL */ `
  subscription OnUpdateProperty {
    onUpdateProperty {
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
export const onDeleteProperty = /* GraphQL */ `
  subscription OnDeleteProperty {
    onDeleteProperty {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
export const onCreateChatRoom = /* GraphQL */ `
  subscription OnCreateChatRoom {
    onCreateChatRoom {
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
export const onUpdateChatRoom = /* GraphQL */ `
  subscription OnUpdateChatRoom {
    onUpdateChatRoom {
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
export const onDeleteChatRoom = /* GraphQL */ `
  subscription OnDeleteChatRoom {
    onDeleteChatRoom {
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
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage {
    onCreateMessage {
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
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage {
    onUpdateMessage {
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
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage {
    onDeleteMessage {
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
