import { event } from "../../utils";

export default event(
  "ready",
  ({ discordClient, log }) => {
    log(`signed in as ${discordClient.user?.tag}`, "info");
  },
  {
    once: true,
  }
);
