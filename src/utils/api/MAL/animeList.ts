import { AnimeListItem, AnimeListResponse, MALApiResponse } from "../../../types/api/MAL";
import { mal } from "./api";

export const getAnimeList = async (username: string, limit = 1000, filter = "") => {
  try {
    const response = await mal.get<AnimeListResponse>("/users/" + username + "/animelist", {
      params: { limit, filter, sort: "list_updated_at" },
    });

    if (!response.data.data) throw new Error("user not found.");

    const data = response.data.data.map((item) => ({ ...item.node })) as AnimeListItem[];

    return { data } as MALApiResponse<AnimeListItem[]>;
  } catch (error) {
    return { data: [], meta: { error: true, messages: { error } } } as MALApiResponse<AnimeListItem[]>;
  }
};
