function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const sleepRandomTime = () => {
  const timeout = randomIntFromInterval(1, 4) * 1000;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolve");
    }, timeout);
  });
};
