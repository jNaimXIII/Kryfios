import KEYS from "../../keys";

export const getAnimeListUrl = (username: string) => {
  return new URL(`/animelist/${username}`, KEYS.malUrl).toString();
};
