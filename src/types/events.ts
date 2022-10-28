import { ClientEvents, Client, Awaitable } from "discord.js";
import { LogLevel } from "./log";

export interface EventProps {
  discordClient: Client;
  log: (message: string, level: LogLevel) => void;
}

export type EventKeys = keyof ClientEvents;

export type EventExec<T extends EventKeys> = (props: EventProps, ...args: ClientEvents[T]) => Awaitable<unknown>;

export interface EventOptions {
  once?: boolean;
  disabled?: boolean;
}

export interface Event<T extends EventKeys> {
  name: T;
  exec: EventExec<T>;
  options?: EventOptions;
}
