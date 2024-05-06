export function formatTime(ms: number) {
  const seconds = ms / 1000;
  const days = Math.floor(seconds / (60 * 60 * 24));
  const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  let formattedTime = "";

  if (days > 0) {
    formattedTime += days + " д";
    if (hours > 0) {
      formattedTime += ", " + hours + " ч";
    }
  } else {
    if (hours > 0) {
      formattedTime += hours + " ч";
      if (minutes > 0) {
        formattedTime += ", " + minutes + " м";
      } else {
        formattedTime += ", " + remainingSeconds + " с";
      }
    } else {
      if (minutes > 0) {
        formattedTime += minutes + " м";
      } else {
        formattedTime += remainingSeconds + " с";
      }
    }
  }

  return formattedTime;
}