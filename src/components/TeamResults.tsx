import React from "react";
import { GameResult } from "../utils";

interface TeamResultsProps {
  results: Array<GameResult>;
}

export function TeamResults({ results = [] }: TeamResultsProps) {
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
          return (
            <tr key={result.id}>
              <td>{result.date.toUTCString()}</td>
              <td>
                {result.homeTeamName} - <strong>{result.homeScore}</strong>
              </td>
              <td>
                <strong>{result.awayScore}</strong> - {result.awayTeamName}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
