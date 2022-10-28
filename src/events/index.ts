import { Event } from "../types";

import readyEvents from "./ready";
import interactionCreateEvents from "./interactionCreate";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const events: Event<any>[] = [readyEvents.flat(), interactionCreateEvents.flat()].flat();
