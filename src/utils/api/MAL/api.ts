import axios from "axios";
import KEYS from "../../../keys";

export const mal = axios.create({
  baseURL: KEYS.malApiUrl,
  headers: {
    "X-MAL-CLIENT-ID": KEYS.malClientId,
  },
});
