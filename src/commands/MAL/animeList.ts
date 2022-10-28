import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { command, getAnimeList, getAnimeListUrl, getAnimeUrl } from "../../utils";
import { AnimeListDisplay, AnimeListFilter } from "../../types";

const meta = new SlashCommandBuilder()
  .setName("animelist")
  .setDescription("Get anime list of a user from MAL.")
  .addStringOption((option) =>
    option
      .setName("username")
      .setDescription("The user's anime list to get.")
      .setMinLength(1)
      .setMaxLength(64)
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("filter")
      .setDescription("Choose which anime status to show.")
      .addChoices(
        { name: "Watching", value: "watching" },
        { name: "Completed", value: "completed" },
        { name: "On Hold", value: "on_hold" },
        { name: "Dropped", value: "dropped" },
        { name: "Plan TO Watch", value: "plan_to_watch" }
      )
      .setRequired(false)
  )
  .addBooleanOption((option) => option.setName("private").setDescription("Only show results to you."))
  .addStringOption((option) =>
    option
      .setName("display")
      .setDescription("Choose how to display the results.")
      .addChoices({ name: "List", value: "list" }, { name: "Embed (not recommenced for large lists)", value: "embed" })
  )
  .addNumberOption((option) =>
    option
      .setName("limit")
      .setDescription("Limit number of results. Defaults to 100. Min: 1 | Max: 1000.")
      .setMinValue(1)
      .setMaxValue(1000)
      .setRequired(false)
  );

export default command(meta, async ({ interaction, log }) => {
  const defaultDisplay: AnimeListDisplay = "list";
  const defaultFilter: AnimeListFilter = "";
  const defaultLimit = 100;

  const isPrivate = interaction.options.getBoolean("private", false) ?? false;
  const username = interaction.options.getString("username", true).trim();
  const limit = interaction.options.getNumber("limit", false) ?? defaultLimit;
  const filter = interaction.options.getString("filter", false) ?? defaultFilter;
  const display = (interaction.options.getString("display", false) ?? defaultDisplay) as AnimeListDisplay;

  const animeListUrl = getAnimeListUrl(username);

  log("showing anime list of " + username, "info");

  await interaction.deferReply({ ephemeral: isPrivate as boolean });

  const response = await getAnimeList(username, limit, filter);

  if (response.meta?.error) {
    log("couldn't find MAL animelist for user " + username, "error");
    return await interaction.followUp("Could not find the list for that user.");
  }

  switch (display) {
    case "list":
      return displayAsList();
    case "embed":
      return displayAsEmbed();
  }

  async function displayAsList() {
    const meta = response.data.map(({ id: animeId, title: animeTitle }) => {
      const animeUrl = getAnimeUrl(animeId);
      return { animeTitle, animeUrl };
    });

    const listItems: string[][] = [[]];
    let currentStringLength = 0;
    let currentStringArrayIndex = 0;
    meta.forEach(({ animeTitle, animeUrl }) => {
      if (currentStringLength > 3800) {
        currentStringArrayIndex++;
        currentStringLength = 0;
        listItems.push([]);
      }
      listItems[currentStringArrayIndex].push(`[${animeTitle}](${animeUrl})\n`);
      currentStringLength = listItems[currentStringArrayIndex].join("").length;
    });

    const embeds = listItems.map((list) => new EmbedBuilder().setDescription(list.join("")));
    embeds.unshift(new EmbedBuilder().setTitle(`${username}'s Anime List!`).setURL(animeListUrl));

    while (embeds.length) await interaction.followUp({ embeds: embeds.splice(0, 10) });
  }

  async function displayAsEmbed() {
    const embeds = response.data.map(({ id: animeId, title: animeTitle, main_picture: { large: animeBanner } }) => {
      const animeUrl = getAnimeUrl(animeId);
      return new EmbedBuilder().setTitle(animeTitle).setImage(animeBanner).setURL(animeUrl);
    });

    embeds.unshift(new EmbedBuilder().setTitle(`${username}'s Anime List!`).setURL(animeListUrl));

    while (embeds.length) await interaction.followUp({ embeds: embeds.splice(0, 10) });
  }
});
