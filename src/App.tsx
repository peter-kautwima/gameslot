import { FormEvent, useCallback, useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import "./App.css";
import BetForm from "./components/bet-form/bet-form";
import Wallet from "./components/wallet/wallet";
import { extractPokemonImages, getPokemonListing } from "./pokemon";
import { TSlot, TSlots } from "./types";
import {
  generateSlotsArray,
  getLastSlots,
  hasWon,
  randomElement,
} from "./utils";

type TState = {
  slots?: TSlots;
  result?: TSlot[];
  isSpinning: boolean;
  balance: number;
};

type TBetState = {
  amount: number
  error?: string
}

const config = {
  slotCols: 3,
  slotRows: 10,
  animationDuration: 900, // reduce this by 100ms to get the actual animation duration. CSS is 1s (1000ms)
  winMultiplier: 10,
  minBet: 0
};

function App() {
  const [state, setState] = useState<TState>({
    isSpinning: false,
    balance: 10000,
  });

  const { width, height } = useWindowSize();

  const [betState, setBetState] = useState<TBetState>({
    amount: 0,
  });

  const [images, setImages] = useState<string[]>([]);

  /**
   * Initial mount
   */
  useEffect(() => {
    const slots = generateSlotsArray(config.slotCols, config.slotRows);
    setState({
      ...state,
      slots,
    });
  }, []);

  const handlePlay = useCallback(() => {
    const result = state.slots ? getLastSlots(state.slots) : [];
    const slots = generateSlotsArray(config.slotCols, config.slotRows);
    setState({
      ...state,
      result,
      slots,
      isSpinning: true,
    });
  }, [setState, state]);

  const handleDepositFunds = console.log;

  // Fetch pokenames from API
  useEffect(() => {
    (async () => {
      const pokemon = await getPokemonListing();
      const images = pokemon ? extractPokemonImages(pokemon) : [];
      setImages(images);
    })();
  }, []);

  const handleBetChange = (event: any) => {
    const amount = event.target.value;

    if (amount < config.minBet) {
      setBetState({
        ...betState,
        error: 'Bet amount must be greater than or equal to 0',
      });
    } else if (amount > state.balance) {
      setBetState({
        ...betState,
        error: 'Bet amount must be less than or equal to your balance',
      });
    } else {
      setBetState({
        ...betState,
        amount,
        error: undefined,
      });
    }
  };

  /**
   * Spin animation and wallet balance calculation
   */
  useEffect(() => {
    if (state.isSpinning) {
      // disable-copilot
      setTimeout(() => {
        if (state.result) {
          const won = hasWon(state.result);
          const balance = won
            ? state.balance + betState.amount * config.winMultiplier
            : state.balance - betState.amount;
          setState({
            ...state,
            isSpinning: false,
            balance,
          });
        }
      }, config.animationDuration);
    }
  }, [state.isSpinning]);

  return (
    <div className="App">
      <div className="bg-image" />
      <div className="slot-machine">
        {!state.isSpinning && state.result && hasWon(state.result) && (
          <>
            <ReactConfetti width={width} height={height} />
            <div className="winner">You won!</div>
          </>
        )}
        <div className="slots-view">
          {/* Display images from results */}
          {state.result && !state.isSpinning
            ? state.result.map((item, index) => (
                <div className="slot-item" key={index}>
                  <img src={images[item]} alt={item.toString()} />
                </div>
              ))
            : state.slots?.map((col, index) => (
                <div
                  className={`slot-column ${state.isSpinning && "animating"}`}
                  key={index}
                >
                  {col.map((item, index) => (
                    <div className="slot-item" key={index}>
                      <img src={images[item]} alt={item.toString()} />
                    </div>
                  ))}
                </div>
              ))}
        </div>
        {betState.error && (
          <div className="error-msg">{betState.error}</div>
        )}

        <div className="controls">
          <div>
            <Wallet balance={state.balance} />
          </div>
          <div>
            <BetForm onChange={handleBetChange} />
          </div>
          <div>
            {state.balance === 0 ? (
              <button className="deposit-funds" onClick={handleDepositFunds}>
                Deposit Funds
              </button>
            ) : (
              <button disabled={!!betState.error} className="spin-button" onClick={handlePlay}>
                Spin
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
