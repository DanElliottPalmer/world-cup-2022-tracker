import React from "react";
import { GameResult, getDate, TeamName } from "../utils";

interface TeamResultsProps {
  results?: Array<GameResult>;
  trackedTeams?: Array<TeamName>;
}

export function TeamResults({
  results = [],
  trackedTeams = [],
}: TeamResultsProps) {
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
        {results.map((result) => {
          const isAwayTeamTracked = trackedTeams.includes(result.awayTeamName);
          const isHomeTeamTracked = trackedTeams.includes(result.homeTeamName);

          let awayLabel = (
            <>
              {result.awayScore} - {result.awayTeamName}
            </>
          );
          if (isAwayTeamTracked) awayLabel = <strong>{awayLabel}</strong>;
          let homeLabel = (
            <>
              {result.homeTeamName} - {result.homeScore}
            </>
          );
          if (isHomeTeamTracked) homeLabel = <strong>{homeLabel}</strong>;

          return (
            <tr key={result.id}>
              <td>
                <time dateTime={result.date.toUTCString()}>
                  {getDate(result.date)}
                </time>
              </td>
              <td>{homeLabel}</td>
              <td>{awayLabel}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
