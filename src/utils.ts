const BASE_URL_RESULT =
  "https://api.fifa.com/api/v3/live/football/17/255711/285063/__GAME_ID__?language=en";

export function getResultURL(gameId: string): string {
  return BASE_URL_RESULT.replace("__GAME_ID__", gameId);
}

// Only listing data we need
export interface RawResultData {
  AwayTeam: {
    Score: number;
    ShortClubName: string;
  };
  Date: string;
  HomeTeam: {
    Score: number;
    ShortClubName: string;
  };
  IdMatch: string;
  // 0 is finished, 1 is to be played
  MatchStatus: 0 | 1;
}

export async function fetchResult(
  gameId: string
): Promise<RawResultData | null> {
  const resultURL = getResultURL(gameId);
  const result = await fetch(resultURL);
  return await result.json();
}

export async function fetchAllResults(
  gameIds: Array<string>
): Promise<Array<RawResultData>> {
  const results = await Promise.all(
    gameIds.map((gameId) => fetchResult(gameId))
  );
  return results.filter(
    (resultData): resultData is RawResultData => resultData !== null
  );
}

export type TeamName = string;

export interface GameResult {
  awayTeamName: TeamName;
  awayScore: number;
  date: Date;
  homeTeamName: TeamName;
  homeScore: number;
  id: string;
}

export interface GameFixture {
  awayTeamName: TeamName;
  date: Date;
  homeTeamName: TeamName;
  id: string;
}

export interface Team {
  fixtures: Array<GameFixture>;
  name: TeamName;
  results: Array<GameResult>;
}

export type Teams = Map<TeamName, Team>;

export function processRawGameData(rawGameData: Array<RawResultData>): Teams {
  const teams: Teams = new Map();

  rawGameData.forEach((gameData) => {
    const isFinished = gameData.MatchStatus === 0;
    const utcDate = new Date(Date.parse(gameData.Date));

    // Away
    const awayTeamName = gameData.AwayTeam.ShortClubName;
    assignTeam(awayTeamName);

    // Home
    const homeTeamName = gameData.HomeTeam.ShortClubName;
    assignTeam(homeTeamName);

    if (isFinished) {
      const result: GameResult = {
        awayTeamName,
        awayScore: gameData.AwayTeam.Score,
        date: utcDate,
        homeTeamName,
        homeScore: gameData.HomeTeam.Score,
        id: gameData.IdMatch,
      };
      teams.get(homeTeamName)?.results.push(result);
      teams.get(awayTeamName)?.results.push(result);
    } else {
      const fixture: GameFixture = {
        awayTeamName,
        date: utcDate,
        homeTeamName,
        id: gameData.IdMatch,
      };
      teams.get(homeTeamName)?.fixtures.push(fixture);
      teams.get(awayTeamName)?.fixtures.push(fixture);
    }
  });

  return teams;

  function assignTeam(teamName: string) {
    if (!teams.has(teamName)) {
      teams.set(teamName, {
        fixtures: [],
        name: teamName,
        results: [],
      });
    }
  }
}

export function getTeamNames(teams: Teams): Array<TeamName> {
  return Array.from(teams.keys());
}

export function unique<T>(
  items: Array<T>,
  predicate: (item: T, index: number, arr: Array<T>) => string | number
): Array<T> {
  const ids: Set<string | number> = new Set();
  return items.filter((item, index, arr) => {
    const id = predicate(item, index, arr);
    if (ids.has(id)) return false;
    ids.add(id);
    return true;
  });
}
