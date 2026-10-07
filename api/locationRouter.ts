import { createRouter, publicQuery } from "./middleware";
import { findAllLocations, findPopularLocations, findCities } from "./queries/locations";

export const locationRouter = createRouter({
  list: publicQuery.query(() => findAllLocations()),
  popular: publicQuery.query(() => findPopularLocations(8)),
  cities: publicQuery.query(() => findCities()),
});
