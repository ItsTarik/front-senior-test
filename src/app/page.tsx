"use client";

import { useMeasure } from "@uidotdev/usehooks";
import { DayCalendar, EventItem } from "@/dayCalendar";
import { groupedOverlapping } from "@/events";

const margin = 25;

export default function Home() {
  const [ref, { width, height }] = useMeasure();

  return (
    <div style={{ overflow: "visible" }}>
      <div
        ref={ref}
        style={{
          position: "relative",
          marginLeft: 50,
          marginTop: margin,
          marginBottom: margin,
          height: `calc(100vh - ${2 * margin}px)`,
          color: "lime",
          overflow: "visible",
        }}
      >
        {width && height && (
          <DayCalendar height={height} width={width}>
            {(scale) => {
              return (
                <div
                  style={{
                    height: "100%",
                  }}
                >
                  {Object.entries(groupedOverlapping).map(
                    ([key, groupedEvents]) => {
                      return (
                        <div key={key} className="grouped-overlapping-events">
                          {groupedEvents.map((eventOrEvents, i) => {
                            if (Array.isArray(eventOrEvents)) {
                              return (
                                <div
                                  key={i}
                                  style={{
                                    position: "relative",
                                    flex: 1,
                                  }}
                                >
                                  {eventOrEvents.map((event) => {
                                    return (
                                      <div
                                        key={event.id}
                                        style={{
                                          position: "absolute",
                                          width: "100%",
                                          top: 0,
                                        }}
                                      >
                                        <EventItem
                                          y={Number(scale(event.start))}
                                          height={
                                            Number(scale(event.end)) -
                                            Number(scale(event.start))
                                          }
                                        >
                                          {event.id}
                                        </EventItem>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            }
                            return (
                              <EventItem
                                key={eventOrEvents.id}
                                y={Number(scale(eventOrEvents.start))}
                                height={
                                  Number(scale(eventOrEvents.end)) -
                                  Number(scale(eventOrEvents.start))
                                }
                              >
                                {eventOrEvents.id}
                              </EventItem>
                            );
                          })}
                        </div>
                      );
                    }
                  )}
                </div>
              );
            }}
          </DayCalendar>
        )}
      </div>
    </div>
  );
}
