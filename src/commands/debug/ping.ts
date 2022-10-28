import { SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Just a ping command.")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("A message to reply with.")
      .setMinLength(1)
      .setMaxLength(1024)
      .setRequired(false)
  );

export default command(meta, async ({ interaction, log }) => {
  const message = interaction.options.getString("message", false) ?? "Heyo! How's it going?";

  log(`echoed |${message}| to ${interaction.user.tag}.`);

  return await interaction.reply({
    ephemeral: true,
    content: message,
  });
});
