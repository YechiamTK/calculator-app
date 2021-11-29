import { ACTIONS } from "../App";

export default function OperatorButton({ dispatch, operator }) {
    return <button className="operator-button"
        onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operator } })}
        >
            {operator}
        </button>
}