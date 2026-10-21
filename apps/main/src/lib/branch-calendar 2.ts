import type { Service } from "./branches";

export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Use the stored weekday; unknown days must not silently become Sunday. */
export function calendarServices(services: Service[]) {
  return services
    .filter((service) => service.is_active)
    .flatMap((service) => {
      const day = (service.day || (service.type === "sunday" ? "Sunday" : ""))
        .trim()
        .toLowerCase()
        .slice(0, 3);
      const weekday = WEEKDAYS.findIndex((label) => label.toLowerCase().slice(0, 3) === day);
      return weekday < 0 ? [] : [{ service, weekday }];
    });
}
