import { Keys } from "../types";

const keys: Keys = {
  discordClientToken: process.env.DISCORD_CLIENT_TOKEN ?? "",
  guildId: process.env.GUILD_ID ?? "",
  malApiUrl: process.env.MAL_API_URL ?? "",
  malClientId: process.env.MAL_CLIENT_ID ?? "",
};

if (Object.values(keys).includes("")) {
  throw new Error("MISSING ENVIRONMENT KEYS.");
}

export default keys;
