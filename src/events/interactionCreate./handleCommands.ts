import { namedCommandsLogger, event } from "../../utils";
import { Command } from "../../types";
import commands from "../../commands";

const allCommands = commands.map(({ commands }) => commands).flat();
const registeredCommands = new Map<string, Command>(allCommands.map((command) => [command.meta.name, command]));

export default event("interactionCreate", async ({ discordClient, log }, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    const commandName = interaction.commandName;
    const command = registeredCommands.get(commandName);

    if (!command) throw new Error("COMMAND NOT FOUND");
    if (!command.options?.enabled) return;

    await command.exec({ discordClient, interaction, log: namedCommandsLogger });
  } catch (error) {
    log("COULDN'T EXECUTE COMMAND", "error");

    if (interaction.deferred) {
      return await interaction.editReply({
        embeds: [
          {
            description: "Something went wrong!",
          },
        ],
      });
    }

    return await interaction.reply({
      ephemeral: true,
      embeds: [
        {
          description: "Something went wrong!",
        },
      ],
    });
  }
});
