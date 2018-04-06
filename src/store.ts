import Vue from 'vue';
import Vuex, {Store} from 'vuex';
import * as CONSTANTS from './constants';

export const ACTION_START_GAME = 'ACTION_START_GAME';
export const ACTION_DO_MARKET_CHANGE = 'ACTION_DO_MARKET_CHANGE';
export const ACTION_TOGGLE_INVEST = 'ACTION_TOGGLE_INVEST';


const MAX_GRAPH_CHANGES_TO_SHOW = 20;
const FUNDS_MAX_DECIMALS = 3;
const TRUNC_FOR_MAX_DECIMALS = Math.pow(10, FUNDS_MAX_DECIMALS);

Vue.use(Vuex);


export interface StateInterface {
  gameStatus: string;
  playerFundsEur: number;
  playerFundsEurOnInvest: number;
  playerFundsBtc: number;
  playerLastDelta: number;
  invested: boolean;
  startTime: number;
  currentChangeValue: number;
  changeValuePositiveTrend: boolean;
  level: number;
  changeValueChanges: number;
  lastChangesValues: number[];
}


export const defaultStore: StateInterface = {
  gameStatus: CONSTANTS.GAME_STATUS_START,
  playerFundsEur: 100,
  playerFundsEurOnInvest: 100,
  playerFundsBtc: 0,
  playerLastDelta: 0,
  invested: false,
  startTime: 0,
  currentChangeValue: 0,
  changeValuePositiveTrend: true,
  level: 1,
  changeValueChanges: 0,
  lastChangesValues: [],
};


export const Mutations = {

  startGame(state: StateInterface) {
    state.gameStatus = CONSTANTS.GAME_STATUS_ONGOING;
    state.playerFundsEur = 100;
    state.playerFundsEurOnInvest = 100;
    state.currentChangeValue = 10000;
    state.playerFundsBtc = state.playerFundsEur / state.currentChangeValue;
    state.startTime = Date.now();
    state.level = 1;
    state.changeValueChanges = 0;
    state.lastChangesValues = [10000];
    return state;
  },

  doMarketChange(state: StateInterface, customChange?: number) {
    const change = (customChange !== undefined)
        ? customChange
        : Math.ceil(Math.random() * 100 * state.level) - (100 * state.level / 2);
    state.currentChangeValue += change;

    if (state.currentChangeValue <= 0) {
      state.currentChangeValue = 1;
    }

    state.changeValuePositiveTrend = (change > 0);
    state.changeValueChanges++;
    if (state.invested) {
      state.playerFundsEur =
          Math.trunc(state.playerFundsBtc * state.currentChangeValue * TRUNC_FOR_MAX_DECIMALS)
          / TRUNC_FOR_MAX_DECIMALS;
    } else {
      state.playerFundsBtc =
          Math.trunc(state.playerFundsEur / state.currentChangeValue * TRUNC_FOR_MAX_DECIMALS)
          / TRUNC_FOR_MAX_DECIMALS;
    }

    if (state.changeValueChanges > 20) {
      state.level++;
      state.changeValueChanges = 0;
    }

    if (state.lastChangesValues.length > MAX_GRAPH_CHANGES_TO_SHOW) {
      state.lastChangesValues.shift();
    }
    state.lastChangesValues.push(state.currentChangeValue);


    return state;
  },

  toggleInvest(state: StateInterface) {
    state.invested = !state.invested;
    if (state.invested) {
      state.playerFundsEurOnInvest = state.playerFundsEur;
    } else {
      state.playerLastDelta = Math.trunc((state.playerFundsEur - state.playerFundsEurOnInvest) * TRUNC_FOR_MAX_DECIMALS)
          / TRUNC_FOR_MAX_DECIMALS;
    }
    return state;
  },
};


export const Actions = {
  ACTION_START_GAME: ({ dispatch, commit, state }: any) => {
    commit('startGame');
    setTimeout(() => dispatch(ACTION_DO_MARKET_CHANGE), 1000);
  },

  ACTION_DO_MARKET_CHANGE: ({dispatch, commit, state}: any) => {
    commit('doMarketChange');
    setTimeout(() => dispatch(ACTION_DO_MARKET_CHANGE), Math.ceil(Math.random() * 1000) );
  },

  ACTION_TOGGLE_INVEST: ({commit}: any) => {
    commit('toggleInvest');
  },
};



export default new Vuex.Store({
  state: defaultStore,
  mutations: Mutations,
  actions: Actions,
});
