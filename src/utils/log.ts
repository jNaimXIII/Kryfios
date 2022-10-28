import chalk from "chalk";
import { oneLine } from "common-tags";
import { LogProcess, LogEvent, LogLevel } from "../types";

const getTimeStamp = () => {
  return new Date().toLocaleString("en-US", { hour12: false }).replace(",", "");
};

const getStyledProcess = (process: LogProcess) => {
  const upperCased = process.toUpperCase();

  switch (process) {
    case "discord":
      return chalk.cyan(upperCased);
  }
};

const getStyledEvent = (event: LogEvent) => {
  const upperCased = event.toUpperCase();

  switch (event) {
    case "event":
      return chalk.yellow(upperCased);
    case "command":
      return chalk.green(upperCased);
    case "general":
      return chalk.white(upperCased);
  }
};

const getStyledLevel = (level: LogLevel) => {
  const upperCased = level.toUpperCase();

  switch (level) {
    case "info":
      return chalk.blue(upperCased);
    case "warn":
      return chalk.bgYellowBright(upperCased);
    case "error":
      return chalk.redBright(upperCased);
  }
};

const getStyledName = (event: LogEvent, name: string) => {
  const upperCased = name.toUpperCase();

  switch (event) {
    case "event":
      return chalk.yellow(upperCased);
    case "command":
      return chalk.green(upperCased);
    case "general":
      return chalk.white(upperCased);
  }
};

export const logger = (process: LogProcess, event: LogEvent, customFields = "") => {
  const styledProcess = getStyledProcess(process);
  const styledEvent = getStyledEvent(event);

  const log = (message: string, level: LogLevel = "info") => {
    const styledTimeStamp = chalk.gray(getTimeStamp());
    const styledLevel = getStyledLevel(level);

    console.log(oneLine`
      [${styledTimeStamp}]
      [${styledProcess}]
      [${styledLevel}]
      [${styledEvent}]
      ${customFields}
      -
      ${message}
    `);
  };

  return log;
};

export const namedLogger = (process: LogProcess, event: LogEvent, name: string) => {
  const styledName = getStyledName(event, name);

  const customFields = oneLine`[${styledName}]`;

  return logger(process, event, customFields);
};

export const discordLogger = logger("discord", "general");

export const eventsLogger = logger("discord", "event");
export const namedEventsLogger = (name: string) => namedLogger("discord", "event", name);

export const commandsLogger = logger("discord", "command");
export const namedCommandsLogger = (name: string) => namedLogger("discord", "command", name);
