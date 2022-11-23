import React, { FormEvent, MouseEvent, useCallback } from "react";
import type { TeamName } from "../utils";

interface TrackingTeamsProps {
  onAdd: (teamName: TeamName) => void;
  onRemove: (teamName: TeamName) => void;
  teamNames: Array<TeamName>;
  trackedTeams: Array<TeamName>;
}

export function TrackingTeams({
  onAdd,
  onRemove,
  teamNames,
  trackedTeams = [],
}: TrackingTeamsProps) {
  const _onFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!event.target) return;
      const formData = new FormData(event.target as HTMLFormElement);
      onAdd(formData.get("selectTeams") as string);
    },
    [onAdd]
  );

  const _onRemoveClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (!event.target) return;
      const teamName = (event.target as HTMLButtonElement).dataset
        .name as string;
      onRemove(teamName);
    },
    [onRemove]
  );

  return (
    <div>
      <form onSubmit={_onFormSubmit}>
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
          <li key={trackedTeam}>
            {trackedTeam}{" "}
            <button data-name={trackedTeam} onClick={_onRemoveClick}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
