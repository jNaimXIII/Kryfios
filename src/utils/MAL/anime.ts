import KEYS from "../../keys";

export const getAnimeUrl = (id: number | string) => {
  return new URL(`/anime/${id}`, KEYS.malUrl).toString();
};
