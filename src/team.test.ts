import { assertEquals } from "https://deno.land/std@0.87.0/testing/asserts.ts";
import { parseTeams, Team } from "./team.ts";

Deno.test("parses teams", () => {
  const teams = parseTeams("5 1 2 3");
  assertEquals<Team[]>(teams, [
    { peopleCount: 2, teamCount: 1 },
    { peopleCount: 3, teamCount: 2 },
    { peopleCount: 4, teamCount: 3 },
  ]);
});
