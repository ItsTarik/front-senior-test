export type Input = {
  id: number;
  start: string;
  duration: number;
}[];

export type EventDto = {
  id: number;
  start: Date;
  end: Date;
};

export type EventArrayOrArrayEventArray = Array<EventDto | EventDto[]>;
