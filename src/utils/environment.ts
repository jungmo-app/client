export const getIsDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

export const getIsProduction = () => {
  return process.env.NODE_ENV === 'production';
};
