export function getTimeDiffBetween(dayStartUnixTimestamp, localUnixTimestamp, startTime, endTime) {
  console.log(dayStartUnixTimestamp);
  const [endTimeHours, endTimeMinutes] = endTime.split(":");
  const diffSecEndTime = endTimeHours * TIME.hours_to_sec + endTimeMinutes * TIME.min_to_sec;

  const endTimePoint = dayStartUnixTimestamp + diffSecEndTime;

  // defining endTimePoint
  const [startTimeHours, startTimeMinutes] = startTime.split(":");
  const diffSecStartTime = startTimeHours * TIME.hours_to_sec + startTimeMinutes * TIME.min_to_sec;
  const startTimePoint = dayStartUnixTimestamp + diffSecStartTime;
  // figuring out the diff
  const timePointsDiff = endTimePoint - localUnixTimestamp;

  if (startTimePoint <= localUnixTimestamp && localUnixTimestamp <= endTimePoint) {
    const hours = timePointsDiff / TIME.hours_to_sec;
    const minutes = (timePointsDiff % TIME.hours_to_sec) / TIME.min_to_sec;
    return {
      hours,
      minutes,
    };
  }
  return {
    outOfBounds: true,
    isBeforeLessons: localUnixTimestamp < startTimePoint,
    isAfterLessons: localUnixTimestamp > endTimePoint,
  };
}
