import { Client, ChatInputCommandInteraction, SlashCommandBuilder, Awaitable } from "discord.js";
import { LogLevel } from "../types";

export interface CommandProps {
  interaction: ChatInputCommandInteraction;
  discordClient: Client;
  log: (message: string, level?: LogLevel) => void;
}

export type CommandExec = (props: CommandProps) => Awaitable<unknown>;

export type CommandMeta = SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

export interface CommandOptions {
  disabled?: boolean;
}

export interface Command {
  meta: CommandMeta;
  exec: CommandExec;
  options?: CommandOptions;
}

export interface CommandCategory {
  name: string;
  commands: Command[];
}
