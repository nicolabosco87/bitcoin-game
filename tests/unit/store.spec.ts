import { expect } from 'chai';
import { shallow } from '@vue/test-utils';
import { defaultStore, StateInterface, Mutations} from '../../src/store';
import { WHALES_CHANGES_DURATION } from '@/constants';

describe('Store', () => {
  it('Calculate EUR/BTC changes', () => {

    let state: StateInterface = defaultStore;

    state = Mutations.startGame(state);
    expect(state.currentChangeValue).to.equals(10000);
    expect(state.playerFundsEur).to.equals(100);
    expect(state.playerFundsBtc).to.equals(0.01);

    state = Mutations.doMarketChange(state, 10000);
    expect(state.playerFundsEur).to.equals(100);
    expect(state.playerFundsBtc).to.equals(0.005);

    state.invested = true;

    state = Mutations.doMarketChange(state, -10000);
    expect(state.playerFundsEur).to.equals(50);
    expect(state.playerFundsBtc).to.equals(0.005);

    state.invested = false;
    state = Mutations.doMarketChange(state, -5000);
    expect(state.playerFundsEur).to.equals(50);
    expect(state.playerFundsBtc).to.equals(0.01);

  });

  it('Calculate Player Delta', () => {
    let state: StateInterface = defaultStore;

    state = Mutations.startGame(state);
    expect(state.playerFundsEur).to.equals(100);
    expect(state.playerFundsBtc).to.equals(0.01);

    Mutations.toggleInvest(state);
    Mutations.doMarketChange(state, 10000);
    Mutations.toggleInvest(state);
    expect(state.playerLastDelta).to.equals(100);

    Mutations.toggleInvest(state);
    Mutations.doMarketChange(state, -10000);
    Mutations.doMarketChange(state, -5000);
    Mutations.toggleInvest(state);

    expect(state.playerLastDelta).to.equals(-150);

  });


  it('Test Whales', () => {
    let state: StateInterface = defaultStore;
    state = Mutations.startGame(state);

    state = Mutations.enableWhales(state);
    state.whalesIsPositive = true;

    expect(state.whalesEnabled).to.equals(true);
    expect(state.whalesTurn).to.equals(0);

    let x = 0;
    while (x < 10) {
      state = Mutations.doMarketChange(state);
      state.whalesTurn = 0; // Forcing whales turn to 0
      expect(state.currentChangeValue).to.greaterThan(10000);
      state.currentChangeValue = 10000;
      x++;
    }

    x = 0;
    state = Mutations.enableWhales(state);
    while (x <= WHALES_CHANGES_DURATION) {
      state = Mutations.doMarketChange(state);
      x++;
    }
    expect(state.whalesEnabled).to.equals(false);

  });
});
