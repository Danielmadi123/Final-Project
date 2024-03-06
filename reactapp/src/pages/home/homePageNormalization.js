const homePageNormalization = (dataFromServer, id) => {
  for (let user of dataFromServer) {
    user.likes = Boolean(user.likes.find((userId) => userId === id));
  }
  return dataFromServer;
};
export default homePageNormalization;
