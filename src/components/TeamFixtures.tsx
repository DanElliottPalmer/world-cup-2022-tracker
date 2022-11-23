import React from "react";
import type { GameFixture, TeamName } from "../utils";

interface TeamFixturesProps {
  fixtures?: Array<GameFixture>;
  trackedTeams?: Array<TeamName>;
}

export function TeamFixtures({
  fixtures = [],
  trackedTeams = [],
}: TeamFixturesProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Home Team</th>
          <th>Away Team</th>
        </tr>
      </thead>
      <tbody>
        {fixtures.map((fixture) => {
          const isAwayTeamTracked = trackedTeams.includes(fixture.awayTeamName);
          const isHomeTeamTracked = trackedTeams.includes(fixture.homeTeamName);

          let awayLabel = <>{fixture.awayTeamName}</>;
          if (isAwayTeamTracked) awayLabel = <strong>{awayLabel}</strong>;
          let homeLabel = <>{fixture.homeTeamName}</>;
          if (isHomeTeamTracked) homeLabel = <strong>{homeLabel}</strong>;

          return (
            <tr key={fixture.id}>
              <td>{fixture.date.toUTCString()}</td>
              <td>{homeLabel}</td>
              <td>{awayLabel}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
