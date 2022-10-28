import { Keys } from "../types";

const keys: Keys = {
  discordClientToken: process.env.DISCORD_CLIENT_TOKEN ?? "",
  guildId: process.env.GUILD_ID ?? "",
};

if (Object.values(keys).includes("")) {
  throw new Error("MISSING ENVIRONMENT KEYS.");
}

export default keys;
