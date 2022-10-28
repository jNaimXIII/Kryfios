import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { command, getAnimeList } from "../../utils";
const MY_ANIME_LIST_URL = "https://myanimelist.net";

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
      .setName("view")
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
  const isPrivate = interaction.options.getBoolean("private", false);
  await interaction.deferReply({ ephemeral: isPrivate as boolean });

  const username = interaction.options.getString("username", true).trim();

  log("showing anime list of " + username, "info");

  const defaultLimit = 100;
  const limit = interaction.options.getNumber("limit", false) ?? defaultLimit;

  const defaultFilter = "";
  const filter = interaction.options.getString("filter", false) ?? defaultFilter;

  const response = await getAnimeList(username, limit, filter);

  if (response.meta?.error) {
    log("couldn't find MAL animelist for user " + username, "error");
    return await interaction.followUp("Could not find the list for that user.");
  }

  type View = "list" | "embed";

  const defaultView = "list";
  const view = (interaction.options.getString("view", false) ?? defaultView) as View;

  if (view === "list") {
    const meta = response.data.map((anime) => {
      const title = anime.title;
      const link = MY_ANIME_LIST_URL + "/" + anime.id;

      return { title, link };
    });

    const listItems: string[][] = [[]];
    let currentStringLength = 0;
    let currentStringIndex = 0;
    meta.forEach((anime) => {
      if (currentStringLength > 3800) {
        currentStringIndex++;
        currentStringLength = 0;
        listItems.push([]);
      }
      listItems[currentStringIndex].push(`[${anime.title}](${anime.link})\n`);
      currentStringLength = listItems[currentStringIndex].join("").length;
    });

    if (listItems.length === 1) {
      const embed = new EmbedBuilder()
        .setTitle(`${username}'s Anime List!`)
        .setDescription(listItems[0].join(""))
        .setURL(MY_ANIME_LIST_URL + "/animelist/" + username);

      return await interaction.followUp({ embeds: [embed] });
    }

    const embeds = listItems.map((list) => {
      return new EmbedBuilder()
        .setTitle(`${username}'s Anime List!`)
        .setDescription(list.join(""))
        .setURL(MY_ANIME_LIST_URL + "/animelist/" + username);
    });

    return embeds.forEach(async (embed) => await interaction.followUp({ embeds: [embed] }));
  }

  if (view === "embed") {
    const embeds = response.data.map((anime) => {
      return new EmbedBuilder()
        .setTitle(anime.title)
        .setImage(anime.main_picture.large)
        .setURL(MY_ANIME_LIST_URL + "/" + anime.id);
    });

    embeds.unshift(
      new EmbedBuilder().setTitle(`${username}'s Anime List!`).setURL(MY_ANIME_LIST_URL + "/animelist/" + username)
    );

    const sectionedEmbeds = [];
    if (embeds.length > 10) {
      while (embeds.length) {
        sectionedEmbeds.push(embeds.splice(0, 10));
      }

      for (const partialEmbeds of sectionedEmbeds) {
        await interaction.followUp({ embeds: partialEmbeds });
      }

      return;
    }

    return await interaction.followUp({ embeds });
  }
});
