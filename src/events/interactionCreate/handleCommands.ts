import { namedCommandsLogger, event } from "../../utils";
import { Command } from "../../types";
import commands from "../../commands";

const allCommands = commands.map(({ commands }) => commands).flat();
const registeredCommands = new Map<string, Command>(allCommands.map((command) => [command.meta.name, command]));

export default event("interactionCreate", async ({ discordClient, log }, interaction) => {
  if (!interaction.isChatInputCommand()) return;
  namedCommandsLogger(interaction.commandName)(`executed by ${interaction.user.tag}.`);

  try {
    const commandName = interaction.commandName;
    const command = registeredCommands.get(commandName);

    if (!command) throw new Error("COMMAND NOT FOUND " + interaction.commandName);
    if (command.options?.disabled) return;

    await command.exec({ discordClient, interaction, log: namedCommandsLogger(interaction.commandName) });
  } catch (error) {
    log("couldn't execute command: " + interaction.commandName, "error");

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
