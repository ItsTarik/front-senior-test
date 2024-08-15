import {
  ReactNode,
  useEffect,
  useRef,
  useCallback,
  useTransition,
  memo,
} from "react";
import { axisLeft, AxisScale, select, scaleTime } from "d3";
import { setHoursAndMinutes } from "@/utils";
import { format } from "date-fns/format";

interface DayCalendarProps {
  height: number;
  width: number;
  children: (scaleRef: AxisScale<Date>) => ReactNode;
}

interface EventItemProps {
  y: number;
  height: number;
  children: ReactNode;
}

export function EventItem(props: EventItemProps) {
  return (
    <div
      className="event-item"
      style={{
        transform: `translateY(${props.y}px)`,
        height: `${props.height}px`,
      }}
    >
      {props.children}
    </div>
  );
}

const nineAM = setHoursAndMinutes(9, 0);
const ninePM = setHoursAndMinutes(21, 0);

function DayCalendarWithoutMemo(props: DayCalendarProps) {
  const [_, startTransition] = useTransition();
  const scaleRef = useRef<AxisScale<Date>>(
    scaleTime().domain([nineAM, ninePM]).range([0, props.height])
  );
  const svgGRef = useRef<SVGGElement>(null);

  const renderNowLine = useCallback((width: number) => {
    const yToday = scaleRef.current(new Date());
    const isTodayLineRendered = select(".today-group").size() !== 0;

    !isTodayLineRendered
      ? select("#axis")
          .append("g")
          .attr("class", "today-group")
          .style("transform", `translateY(${yToday}px)`)
          .append("line")
          .attr("class", "today")
          .attr("x2", width)
          .attr("x1", 0)
          .transition()
          .attr("stroke", "#F00")
          //@ts-ignore
          .select(function () {
            //@ts-ignore
            select(this.parentNode)
              .append("circle")
              .attr("class", "circle-today")
              .attr("r", 5)
              .style("fill", "#F00");
          })
      : select(".today-group")
          .style("transform", `translateY(${yToday}px)`)
          .select(".today")
          .attr("x2", width);
  }, []);

  useEffect(() => {
    if (svgGRef.current) {
      startTransition(() => {
        // @ts-ignore
        scaleRef.current.range([0, props.height]);

        const axis = axisLeft(scaleRef.current).tickFormat((d) => {
          return format(d, "HH:mm aaa");
        });

        //@ts-ignore
        select<SVGGElement, unknown>(svgGRef.current)
          .transition()
          .duration(200)
          .call(axis);
      });
    }
  }, [props.height]);

  useEffect(() => {
    renderNowLine(props.width);
    const interval = setInterval(() => renderNowLine(props.width), 10000);

    return () => clearInterval(interval);
  }, [props.width, props.height, renderNowLine]);

  return (
    <>
      <svg style={{ overflow: "visible", position: "absolute", zIndex: 1 }}>
        <g id="axis" ref={svgGRef} />
      </svg>
      {props.children(scaleRef.current)}
    </>
  );
}

export const DayCalendar = memo(DayCalendarWithoutMemo);
