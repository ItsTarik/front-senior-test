"use client";

import { useMeasure } from "@uidotdev/usehooks";
import { DayCalendar } from "@/dayCalendar";
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
                          {groupedEvents.map((e) => (
                            <div
                              className="event-item"
                              key={e.id}
                              style={{
                                transform: `translateY(${scale(e.start)}px)`,
                                height: `${
                                  Number(scale(e.end)) - Number(scale(e.start))
                                }px`,
                              }}
                            >
                              {e.id}
                            </div>
                          ))}
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
