const URL_RESULTS =
  "https://api.fifa.com/api/v3/calendar/matches?language=en&idCompetition=17&idSeason=255711&count=1000";
const LOCAL_STORAGE_KEY = "world-cup-data";

// Only listing data we need
export interface RawResultData {
  Away: {
    Abbreviation: string;
    Score: number;
    ShortClubName: string;
  };
  Date: string;
  GroupName: Array<{
    Description: string;
    Locale: string;
  }>;
  Home: {
    Abbreviation: string;
    Score: number;
    ShortClubName: string;
  };
  IdMatch: string;
  // 0 is finished, 1 is to be played
  MatchStatus: 0 | 1;
  StageName: Array<{
    Description: string;
    Locale: string;
  }>;
}

export async function fetchAllResults(): Promise<Array<RawResultData>> {
  const result = await fetch(URL_RESULTS);
  const rawData = await result.json();
  return rawData.Results.filter(
    (rawResults: RawResultData): rawResults is RawResultData =>
      rawResults.Away !== null
  );
}

export function getGroupName(resultData: RawResultData): string {
  if (resultData.StageName.length > 0) {
    return resultData.StageName[0].Description ?? "Unknown Group";
  }
  if (resultData.GroupName.length > 0) {
    return resultData.GroupName[0].Description;
  }
  return "Unknown Group";
}

export type TeamAbbreviation = string;
export type TeamName = string;

export interface GameResult {
  awayTeamName: TeamName;
  awayScore: number;
  date: Date;
  groupName: string;
  homeTeamName: TeamName;
  homeScore: number;
  id: string;
}

export interface GameFixture {
  awayTeamName: TeamName;
  date: Date;
  groupName: string;
  homeTeamName: TeamName;
  id: string;
}

export interface Team {
  abbreviation: TeamAbbreviation;
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
    assignTeam(awayTeamName, gameData.Away.Abbreviation);

    // Home
    const homeTeamName = gameData.Home.ShortClubName;
    assignTeam(homeTeamName, gameData.Home.Abbreviation);

    if (isFinished) {
      const result: GameResult = {
        awayTeamName,
        awayScore: gameData.Away.Score,
        date: utcDate,
        groupName: getGroupName(gameData),
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
        groupName: getGroupName(gameData),
        homeTeamName,
        id: gameData.IdMatch,
      };
      teams.get(homeTeamName)?.fixtures.push(fixture);
      teams.get(awayTeamName)?.fixtures.push(fixture);
    }
  });

  return teams;

  function assignTeam(teamName: string, abbr: string) {
    if (!teams.has(teamName)) {
      teams.set(teamName, {
        abbreviation: abbr,
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

export function getUserLocale() {
  return navigator.language;
}

export function getDate(date: Date): string {
  const formatter = Intl.DateTimeFormat(getUserLocale(), {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  return formatter.format(date);
}

export function getFlagURL(idAssociation: string): string {
  return "https://api.fifa.com/api/v3/picture/flags-sq-1/" + idAssociation;
}
