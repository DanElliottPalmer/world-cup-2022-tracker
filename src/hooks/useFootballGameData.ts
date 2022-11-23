import { useEffect, useReducer } from "react";
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
      const allResults = await fetchAllResults();
      dispatch({ results: allResults.slice(0), type: "complete" });
    })();
  }, []);

  return state;
}
