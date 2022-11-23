const URL_RESULTS =
  "https://api.fifa.com/api/v3/calendar/matches?language=en&idCompetition=17&idSeason=255711&count=1000";
const LOCAL_STORAGE_KEY = "world-cup-data";

// Only listing data we need
export interface RawResultData {
  Away: {
    Score: number;
    ShortClubName: string;
  };
  Date: string;
  Home: {
    Score: number;
    ShortClubName: string;
  };
  IdMatch: string;
  // 0 is finished, 1 is to be played
  MatchStatus: 0 | 1;
}

export async function fetchAllResults(): Promise<Array<RawResultData>> {
  const result = await fetch(URL_RESULTS);
  const rawData = await result.json();
  return rawData.Results.filter((rawResults) => rawResults.Away !== null);
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
    const awayTeamName = gameData.Away.ShortClubName;
    assignTeam(awayTeamName);

    // Home
    const homeTeamName = gameData.Home.ShortClubName;
    assignTeam(homeTeamName);

    if (isFinished) {
      const result: GameResult = {
        awayTeamName,
        awayScore: gameData.Away.Score,
        date: utcDate,
        homeTeamName,
        homeScore: gameData.Home.Score,
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

interface SaveData {
  trackedTeams: Array<TeamName>;
}

export function save(data: SaveData) {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

interface LoadData {
  trackedTeams: Array<TeamName>;
}

export function load(): LoadData | undefined {
  const data = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  if (data === null) return undefined;
  return JSON.parse(data);
}
