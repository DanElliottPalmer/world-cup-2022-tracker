import React, { FormEvent, useCallback } from "react";
import type { TeamName } from "../utils";

interface TrackingTeamsProps {
  onSubmit: (teamName: TeamName) => void;
  teamNames: Array<TeamName>;
  trackedTeams: Array<TeamName>;
}

export function TrackingTeams({
  onSubmit,
  teamNames,
  trackedTeams = [],
}: TrackingTeamsProps) {
  const _onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!e.target) return;
      const formData = new FormData(e.target as HTMLFormElement);
      onSubmit(formData.get("selectTeams") as string);
    },
    [onSubmit]
  );
  return (
    <div>
      <form onSubmit={_onSubmit}>
        <p>
          <label>
            Teams:{" "}
            <select name="selectTeams">
              {teamNames.map((teamName) => (
                <option key={teamName}>{teamName}</option>
              ))}
            </select>
          </label>
        </p>
        <p>
          <button>Track</button>
        </p>
      </form>
      <hr />
      <ul>
        {trackedTeams.map((trackedTeam) => (
          <li key={trackedTeam}>{trackedTeam}</li>
        ))}
      </ul>
    </div>
  );
}
