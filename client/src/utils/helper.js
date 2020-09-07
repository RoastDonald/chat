export const getColor = () => {
  let H = Math.floor(Math.random() * 240);
  return `linear-gradient(hsl(${H},100%,70%),hsl(${H},100%,30%))`;
};
