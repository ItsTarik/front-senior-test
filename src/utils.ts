export const setHoursAndMinutes = (hours: number, minutes: number): Date =>
  new Date(
    new Date(
      new Date(
        new Date(new Date().setMilliseconds(0)).setSeconds(0)
      ).setMinutes(minutes)
    ).setHours(hours)
  );
