import { useReducer } from 'react';
import DigitButton from './components/digit-button';
import OperatorButton from './components/operator-button';
import './App.css';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  PERCENTAGE: 'percentage',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }){
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite){
        return {
          ...state,
          currentNumber: payload.digit,
          overwrite: false
        }
      }

      if (payload.digit === 0 && state.currentNumber === 0) {
        return state
      }
      if (payload.digit === "." && state.currentNumber.include(".")) {
        return state
      }

      return {
        ...state, 
        currentNumber: `${state.currentNumber || ''}${payload.digit}`
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentNumber == null && state.previousNumber == null){
        return state
      }
      
      if (state.currentNumber == null){
        return {
          ...state,
          operator: payload.operator
        }
      }

      if (state.previousNumber == null){
        return {
          ...state,
          operator: payload.operator, 
          previousNumber: state.currentNumber,
          currentNumber: null
        }
      }
      
      return {
        ...state,
        operator: payload.operator, 
        previousNumber: evaluate(state),
        currentNumber: null
      }
  
    case ACTIONS.CLEAR:
      return {};
    
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite){
        return {
          ...state,
          currentNumber: null,
          overwrite: false
        }
      }

      if (state.currentNumber == null) {
        return state
      }

      if (state.currentNumber.length === 1){
        return{
          ...state,
          currentNumber: null
        }
      }

      return {
        ...state, 
        currentNumber: state.currentNumber.slice(0, -1)
      }

    case ACTIONS.EVALUATE:
      if (state.currentNumber == null || state.previousNumber == null || state.operator == null){
        return state;
      }

      return {
        ...state,
        operator: null,
        previousNumber: null,
        overwrite: true,
        currentNumber: evaluate(state)
      }
    
    case ACTIONS.PERCENTAGE:
      if (state.currentNumber == null){
        return state
      }

      return {
        ...state,
        overwrite: true,
        currentNumber: (parseFloat(state.currentNumber) / 100).toString()
      }
    
    default:
      return state;
  }
}

function evaluate({ currentNumber, previousNumber, operator }){
  const prev = parseFloat(previousNumber)
  const curr = parseFloat(currentNumber)
  if (isNaN(prev) || isNaN(curr)) {
    return ""
  }
  
  let resulte = ""
  switch (operator){
    case "+":
      resulte = prev + curr
      break
    case "-":
      resulte = prev - curr
      break
    case "x":
      resulte = prev * curr
      break
    case "/":
      resulte = curr !== 0 ? prev / curr : "Error"
      break
    default:
      break
  }
  return resulte.toString()
}

function App() {
  const [{ currentNumber }, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator">
     <div className="screen">
       <div className="current-number">{currentNumber}</div>
     </div>
     <button 
      className="up-button" 
      onClick={() => {dispatch({ type: ACTIONS.CLEAR })}}
      >AC</button>
     <button 
      className="up-button"
      onClick={() => {dispatch({ type: ACTIONS.DELETE_DIGIT })}}
      >Del</button>
     <button 
      className="up-button"
      onClick={ () => {dispatch({ type: ACTIONS.PERCENTAGE })}}
      >%</button> 
     <OperatorButton dispatch={dispatch} operator="/" />
     <DigitButton dispatch={dispatch} digit="7" />
     <DigitButton dispatch={dispatch} digit="8" />
     <DigitButton dispatch={dispatch} digit="9" />
     <OperatorButton dispatch={dispatch} operator="x" />
     <DigitButton dispatch={dispatch} digit="4" />
     <DigitButton dispatch={dispatch} digit="5" />
     <DigitButton dispatch={dispatch} digit="6" />
     <OperatorButton dispatch={dispatch} operator="-" />
     <DigitButton dispatch={dispatch} digit="1" />
     <DigitButton dispatch={dispatch} digit="2" />
     <DigitButton dispatch={dispatch} digit="3" />
     <OperatorButton dispatch={dispatch} operator="+" />
     <DigitButton dispatch={dispatch} digit="0" className="span-two"/>
     <DigitButton dispatch={dispatch} digit="." />
     <button 
      className="operator-button" 
      onClick={() => {dispatch({ type: ACTIONS.EVALUATE })}}
      >=</button>
    </div>
  );
}

export default App;
