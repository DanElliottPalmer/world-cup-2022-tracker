import React, { FormEvent, MouseEvent, useCallback } from "react";
import { getFlagURL, getTeamNames, Team, TeamName } from "../utils";

interface TrackingTeamsProps {
  onAdd: (teamName: TeamName) => void;
  onRemove: (teamName: TeamName) => void;
  teams: Map<TeamName, Team>;
  trackedTeams: Array<TeamName>;
}

export function TrackingTeams({
  onAdd,
  onRemove,
  teams,
  trackedTeams = [],
}: TrackingTeamsProps) {
  const teamNames = getTeamNames(teams).sort((a, b) => a.localeCompare(b));

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
        {trackedTeams.map((teamName) => {
          const teamAbbr = (teams.get(teamName) as Team).abbreviation;
          const flagURL = getFlagURL(teamAbbr);
          return (
            <li className="tracking-teams__list-item" key={teamName}>
              <img className="tracking-teams__flag" src={flagURL} />
              {teamName}{" "}
              <button
                className="button"
                data-name={teamName}
                onClick={_onRemoveClick}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
      <form className="tracking-teams__form" onSubmit={_onFormSubmit}>
        <label>
          Team:{" "}
          <select className="select" name="selectTeams">
            {teamNames.map((teamName) => (
              <option key={teamName} value={teamName}>
                {teamName}
              </option>
            ))}
          </select>
        </label>
        <button className="button">Track</button>
      </form>
    </div>
  );
}
