import "../env";
import { REST, Routes, APIUser } from "discord.js";
import commands from "../commands";
import KEYS from "../keys";

const body = commands.map(({ commands }) => commands.map(({ meta }) => meta)).flat();

const rest = new REST({
  version: "10",
}).setToken(KEYS.discordClientToken);

async function main() {
  const currentUser = (await rest.get(Routes.user())) as APIUser;

  const endpoint = Routes.applicationGuildCommands(currentUser.id, KEYS.guildId);

  await rest.put(endpoint, { body });

  return currentUser;
}

main()
  .then((user) => {
    console.log("Successfully registered commands as", user.username + "#" + user.discriminator);
  })
  .catch(console.error);
