export const createId = () => {
  try {
    return Math.floor(Date.now() * Math.random());
  } catch (error) {
    throw new Error('Error while create Id');
  }
};
