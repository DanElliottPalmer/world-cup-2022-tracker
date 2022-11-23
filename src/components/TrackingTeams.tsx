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
    <div className="tracking-teams">
      <ul className="tracking-teams__list">
        {trackedTeams.map((trackedTeam) => (
          <li className="tracking-teams__list-item" key={trackedTeam}>
            {trackedTeam}{" "}
            <button
              className="button"
              data-name={trackedTeam}
              onClick={_onRemoveClick}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <form className="tracking-teams__form" onSubmit={_onFormSubmit}>
        <label>
          Team:{" "}
          <select className="select" name="selectTeams">
            {teamNames.map((teamName) => (
              <option key={teamName}>{teamName}</option>
            ))}
          </select>
        </label>
        <button className="button">Track</button>
      </form>
    </div>
  );
}
