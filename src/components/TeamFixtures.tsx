import React from "react";
import type { GameFixture } from "../utils";

interface TeamFixturesProps {
  fixtures: Array<GameFixture>;
}

export function TeamFixtures({ fixtures = [] }: TeamFixturesProps) {
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
        {fixtures.map((result) => {
          return (
            <tr key={result.id}>
              <td>{result.date.toUTCString()}</td>
              <td>{result.homeTeamName}</td>
              <td>{result.awayTeamName}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}