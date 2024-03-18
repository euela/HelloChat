export const senderLogic = (current_user, users) => {
    return users[0]?._id === current_user?._id ? users[1].name : users[0].name;
  };
export const senderPicLogic = (current_user,users) => {
  if (users) {
    return users[0]?._id === current_user?._id ? users[1].pic : users[0].pic; // or provide a default image URL
  }
  return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
}
export const senderIDLogic = (current_user,users) => {
  return users[0]?._id === current_user?._id ? users[1]._id : users[0]._id
}
export const senderisAdmin = (current_user,isAdmin) => {
  return isAdmin?._id !== current_user._id ? 'Not Permited' : 'Verified'
}

export const isSameSender = (newMessages,m,i,userId) => {
  return(
      i < newMessages.length - 1 && 
      (newMessages[i+1].sender._id !== m.sender._id || newMessages[i+1].sender._id === undefined) 
      && newMessages[i].sender._id !== userId  
  );
}

export const isLastMessage = (newMessages,m,i,userId) => {
  return(
    i === newMessages.length - 1 && 
      (newMessages[newMessages.length - 1]?.sender._id !== m.sender._id && newMessages[i-1]?.sender._id ) 
  )
}