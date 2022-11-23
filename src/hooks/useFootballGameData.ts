import { useEffect, useReducer } from "react";
import { GAME_IDS } from "../constants";
import { fetchAllResults } from "../utils";
import type { RawResultData } from "../utils";

interface State {
  games: Array<RawResultData>;
  loading: boolean;
}

type Action = { results: Array<RawResultData>; type: "complete" };

const defaultState: State = {
  games: [],
  loading: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "complete":
      return { games: action.results, loading: false };
    default:
      return state;
  }
}

export function useFootballGameData() {
  const [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    if (!state.loading) return;
    (async function () {
      // TODO: all the games
      const games = await fetchAllResults(GAME_IDS.slice(0));
      dispatch({ results: games, type: "complete" });
    })();
  }, []);

  return state;
}
