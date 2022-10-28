import { Event, EventKeys, EventExec, EventOptions } from "../types";
import { Client } from "discord.js";
import { namedEventsLogger } from "../utils";

export function event<T extends EventKeys>(name: T, exec: EventExec<T>, options?: EventOptions): Event<T> {
  return {
    name,
    exec,
    options,
  };
}

export function registerEvents(discordClient: Client, events: Event[]): void {
  for (const event of events) {
    discordClient[event.options?.once ? "once" : "on"](event.name, async (...args) => {
      const props = {
        discordClient,
        log: namedEventsLogger(event.name),
      };

      try {
        await event.exec(props, ...args);
      } catch (error) {
        props.log("Unknown Error", "error");
      }
    });
  }
}
