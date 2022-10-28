import readyEvents from "./ready";
import interactionCreateEvents from "./interactionCreate";

export const events = [readyEvents.flat(), interactionCreateEvents.flat()].flat();
