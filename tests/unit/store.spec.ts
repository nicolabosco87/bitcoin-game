import { expect } from 'chai';
import { shallow } from '@vue/test-utils';
import { defaultStore, StateInterface, Mutations } from '../../src/store';

describe('Store', () => {
  it('Calculate EUR/BTC changes', () => {

    let state: StateInterface = defaultStore;

    state = Mutations.startGame(state);
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
});
