import { Command, CommandCategory, CommandMeta, CommandExec, CommandOptions } from "../types";

export function command(meta: CommandMeta, exec: CommandExec, options?: CommandOptions): Command {
  return {
    meta,
    exec,
    options,
  };
}

export function category(name: string, commands: Command[]): CommandCategory {
  return {
    name,
    commands,
  };
}
