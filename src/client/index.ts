import { Client, GatewayIntentBits } from "discord.js";
import KEYS from "../keys";
import { events } from "../events";
import { discordLogger, registerEvents } from "../utils";

export const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

registerEvents(discordClient, events);

discordClient.login(KEYS.discordClientToken).catch(() => {
  discordLogger("failed to log in.", "error");
  process.exit(1);
});
