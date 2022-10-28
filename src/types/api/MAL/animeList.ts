export interface AnimeListItem {
  id: number;
  title: string;
  main_picture: {
    medium: string;
    large: string;
  };
}

export interface AnimeListResponse {
  data: { node: AnimeListItem }[];
}
