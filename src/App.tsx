import React, { useCallback, useState } from "react";
import { TeamResults } from "./components/TeamResults";
import { TeamFixtures } from "./components/TeamFixtures";
import { TrackingTeams } from "./components/TrackingTeams";
import { useFootballGameData } from "./hooks/useFootballGameData";
import { getTeamNames, processRawGameData, TeamName, unique } from "./utils";

export function App() {
  const { games, loading } = useFootballGameData();
  const [trackedTeams, setTrackingTeams] = useState<Array<TeamName>>([]);

  const onTrackingTeamSubmit = useCallback(
    (teamName: TeamName) => {
      if (trackedTeams.includes(teamName)) return;
      const updatedTrackedTeams = [...trackedTeams, teamName];
      setTrackingTeams(updatedTrackedTeams);
    },
    [trackedTeams]
  );

  if (loading) return <main>Loading...</main>;

  const teams = processRawGameData(games);
  const teamNames = getTeamNames(teams).sort((a, b) => a.localeCompare(b));

  const results = unique(
    trackedTeams.flatMap((teamName) => {
      const team = teams.get(teamName);
      if (!team) return [];
      return team.results;
    }),
    (item) => item.id
  ).sort((a, b) => a.date.valueOf() - b.date.valueOf());

  const fixtures = unique(
    trackedTeams.flatMap((teamName) => {
      const team = teams.get(teamName);
      if (!team) return [];
      return team.fixtures;
    }),
    (item) => item.id
  ).sort((a, b) => a.date.valueOf() - b.date.valueOf());

  return (
    <main>
      <h1>World Cup Tracker</h1>
      <section>
        <h2>Tracking Teams</h2>
        <TrackingTeams
          onSubmit={onTrackingTeamSubmit}
          teamNames={teamNames}
          trackedTeams={trackedTeams}
        />
      </section>
      <section>
        <h2>Results</h2>
        <TeamResults results={results} />
      </section>
      <section>
        <h2>Fixtures</h2>
        <TeamFixtures fixtures={fixtures} />
      </section>
    </main>
  );
}
