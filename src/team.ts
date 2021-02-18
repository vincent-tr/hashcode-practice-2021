export type Team = {
  peopleCount: number;
  teamCount: number;
};

export function parseTeams(line: string): Team[] {
  return line.split(" ")
    .slice(1)
    .map(Number)
    .map((teamCount, i) => ({
      peopleCount: i + 2,
      teamCount,
    }));
}
