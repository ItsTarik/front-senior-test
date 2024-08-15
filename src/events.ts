import { areIntervalsOverlapping } from "date-fns/areIntervalsOverlapping";
import { addMinutes } from "date-fns/addMinutes";
import { setHoursAndMinutes } from "@/utils";

const input = [
  {
    id: 1,
    start: "17:00",
    duration: 60,
  },
  {
    id: 2,
    start: "17:00",
    duration: 120,
  },
  {
    id: 3,
    start: "19:40",
    duration: 10,
  },
  {
    id: 4,
    start: "15:00",
    duration: 20,
  },
  {
    id: 5,
    start: "18:00",
    duration: 60,
  },
  {
    id: 6,
    start: "10:25",
    duration: 35,
  },
  {
    id: 7,
    start: "10:45",
    duration: 30,
  },
  {
    id: 8,
    start: "17:00",
    duration: 60,
  },
  {
    id: 9,
    start: "10:00",
    duration: 30,
  },
  {
    id: 10,
    start: "11:50",
    duration: 20,
  },
  {
    id: 11,
    start: "19:00",
    duration: 60,
  },
  {
    id: 12,
    start: "09:00",
    duration: 45,
  },
  {
    id: 13,
    start: "14:45",
    duration: 60,
  },
  {
    id: 14,
    start: "19:20",
    duration: 10,
  },
  {
    id: 15,
    start: "11:50",
    duration: 30,
  },
  {
    id: 16,
    start: "11:40",
    duration: 40,
  },
  {
    id: 17,
    start: "14:00",
    duration: 30,
  },
];

type Input = {
  id: number;
  start: string;
  duration: number;
}[];

type Event = {
  id: number;
  start: Date;
  end: Date;
};

const groupOverlapingEvents = (input: Input) => {
  return input.reduce<{ [k: string]: Event[] }>((acc, event) => {
    const [hours, minutes] = event.start.split(":").map(Number);

    const start = setHoursAndMinutes(hours, minutes);
    const end = addMinutes(start, event.duration);
    const newEvent = { id: event.id, start, end };

    const array = Object.entries(acc);
    for (let index = 0; index < array.length; index++) {
      const [_, grouped] = array[index];
      if (grouped.some((e) => areIntervalsOverlapping(e, newEvent))) {
        grouped.push(newEvent);
        return acc;
      }
    }

    return {
      ...acc,
      [Object.keys(acc).length + 1]: [newEvent],
    };
  }, {});
};

export const groupedOverlapping = groupOverlapingEvents(input);
