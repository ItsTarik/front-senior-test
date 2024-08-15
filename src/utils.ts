import { addMinutes, areIntervalsOverlapping, isBefore } from "date-fns";
import { Input, EventDto, EventArrayOrArrayEventArray } from "@/dtos";

export const setHoursAndMinutes = (hours: number, minutes: number): Date =>
  new Date(
    new Date(
      new Date(
        new Date(new Date().setMilliseconds(0)).setSeconds(0)
      ).setMinutes(minutes)
    ).setHours(hours)
  );

export const groupOverlappingEvents = (input: Input) => {
  return input.reduce<{ [k: string]: EventDto[] }>((acc, event) => {
    const [hours, minutes] = event.start.split(":").map(Number);

    const start = setHoursAndMinutes(hours, minutes);
    const end = addMinutes(start, event.duration);
    const newEvent = { id: event.id, start, end };

    const array = Object.entries(acc);
    for (let index = 0; index < array.length; index++) {
      const [_, grouped] = array[index];
      if (grouped.some((e) => areIntervalsOverlapping(e, newEvent))) {
        grouped.push(newEvent);
        grouped.sort((a, b) => {
          if (isBefore(b.start, a.start)) {
            return 1;
          }
          return -1;
        });
        return acc;
      }
    }

    return {
      ...acc,
      [Object.keys(acc).length + 1]: [newEvent],
    };
  }, {});
};

// this is imperative recursive difficult to understand function !!!
export const recOptimizeOverlappingEvents = (
  events: EventDto[],
  result: EventArrayOrArrayEventArray
): EventArrayOrArrayEventArray => {
  if (events.length === 0) return result;

  const [eventPivot, ...rest] = events;
  if (result.length === 0)
    return recOptimizeOverlappingEvents(rest, [eventPivot]);

  for (let index = 0; index < result.length; index++) {
    let eventItemOrEventsArray = result[index];
    if (Array.isArray(eventItemOrEventsArray)) {
      if (
        eventItemOrEventsArray.every(
          (e) => !areIntervalsOverlapping(e, eventPivot)
        )
      ) {
        eventItemOrEventsArray.push(eventPivot);
        result[index] = eventItemOrEventsArray;
        return recOptimizeOverlappingEvents(rest, result);
      }
      continue;
    }
    if (!areIntervalsOverlapping(eventItemOrEventsArray, eventPivot)) {
      result[index] = [eventItemOrEventsArray, eventPivot];
      return recOptimizeOverlappingEvents(rest, result);
    }
  }
  return recOptimizeOverlappingEvents(rest, [...result, eventPivot]);
};
