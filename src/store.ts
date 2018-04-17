import Vue from 'vue';
import Vuex, {Store} from 'vuex';
import * as CONSTANTS from './constants';
import {isMobile} from '@/lib/Utils';

export const ACTION_START_GAME = 'ACTION_START_GAME';
export const ACTION_RESTART_GAME = 'ACTION_RESTART_GAME';
export const ACTION_END_GAME = 'ACTION_END_GAME';
export const ACTION_DO_MARKET_CHANGE = 'ACTION_DO_MARKET_CHANGE';
export const ACTION_TOGGLE_INVEST = 'ACTION_TOGGLE_INVEST';
export const ACTION_CHECK_SHOW_PLAYER_LAST_DELTA = 'ACTION_CHECK_SHOW_PLAYER_LAST_DELTA';
export const ACTION_ENABLE_WHALES = 'ACTION_ENABLE_WHALES';
export const ACTION_CHECK_IS_MOBILE = 'ACTION_CHECK_IS_MOBILE';

Vue.use(Vuex);


export interface StateInterface {
  gameStatus: string;
  playerFundsEur: number;
  playerFundsEurOnInvest: number;
  playerFundsBtc: number;
  playerLastDelta: number;
  showPlayerLastDelta: boolean;
  playerLastDeltaLastShow: number;
  invested: boolean;
  startTime: number;
  currentChangeValue: number;
  changeValuePositiveTrend: boolean;
  level: number;
  changeValueChanges: number;
  lastChangesValues: number[];
  whalesEnabled: boolean;
  whalesIsPositive: boolean;
  whalesTurn: number;
  isMobile: boolean;
}


export const defaultStore: StateInterface = {
  gameStatus: CONSTANTS.GAME_STATUS_START,
  playerFundsEur: 100,
  playerFundsEurOnInvest: 100,
  playerFundsBtc: 0,
  playerLastDelta: 0,
  showPlayerLastDelta: false,
  playerLastDeltaLastShow: 0,
  invested: false,
  startTime: 0,
  currentChangeValue: 10000,
  changeValuePositiveTrend: true,
  level: 1,
  changeValueChanges: 0,
  lastChangesValues: [10000],
  whalesEnabled: false,
  whalesIsPositive: true,
  whalesTurn: 0,
  isMobile: false,
};


export const Mutations = {

  startGame(state: StateInterface) {
    state.gameStatus = CONSTANTS.GAME_STATUS_ONGOING;
    state.playerFundsEur = 100;
    state.playerFundsEurOnInvest = 100;
    state.currentChangeValue = 10000;
    state.showPlayerLastDelta = false;
    state.playerLastDeltaLastShow = 0;
    state.playerFundsBtc = state.playerFundsEur / state.currentChangeValue;
    state.startTime = Date.now();
    state.level = 1;
    state.changeValueChanges = 0;
    state.lastChangesValues = [10000];
    return state;
  },

  restartGame(state: StateInterface) {
    state.gameStatus = CONSTANTS.GAME_STATUS_START;
    return state;
  },

  doMarketChange(state: StateInterface, customChange?: number) {
    let change = (customChange !== undefined)
        ? customChange
        : Math.ceil(Math.random() * 100 * Math.pow(state.level, 1.2)) - (100 * Math.pow(state.level, 1.2) / 2);

    // No 0 change
    if (change === 0) {
      change = 1;
    }


    // There are whales
    if (state.whalesEnabled) {
      change = (change < 0) ? -change : change;

      change = Math.pow(change, 1.2);

      if (!state.whalesIsPositive) {
        change = -change;
      }

      state.whalesTurn++;

      if (state.whalesTurn > CONSTANTS.WHALES_CHANGES_DURATION) {
        state.whalesTurn = 0;
        state.whalesEnabled = false;
      }
    }

    // Trunc the change value
    change = (Math.trunc(change * CONSTANTS.TRUNC_FOR_MAX_DECIMALS)) / CONSTANTS.TRUNC_FOR_MAX_DECIMALS;
    state.currentChangeValue += change;
    state.currentChangeValue = (Math.trunc(state.currentChangeValue * CONSTANTS.TRUNC_FOR_MAX_DECIMALS))
      / CONSTANTS.TRUNC_FOR_MAX_DECIMALS;

    // Minimun change allowed
    if (state.currentChangeValue <= 0.1) {
      state.currentChangeValue = 0.1;
    }

    state.changeValuePositiveTrend = (change > 0);
    state.changeValueChanges++;
    if (state.invested) {
      state.playerFundsEur =
          Math.trunc(state.playerFundsBtc * state.currentChangeValue * CONSTANTS.TRUNC_FOR_MAX_DECIMALS)
          / CONSTANTS.TRUNC_FOR_MAX_DECIMALS;
    } else {
      state.playerFundsBtc =
          Math.trunc(state.playerFundsEur / state.currentChangeValue * CONSTANTS.TRUNC_FOR_MAX_DECIMALS)
          / CONSTANTS.TRUNC_FOR_MAX_DECIMALS;
    }

    if (state.changeValueChanges > (CONSTANTS.LEVEL_UPGRADE_EVERY_TOT_CHANGES - 1)) {
      state.level++;
      state.changeValueChanges = 0;
    }




    if (state.lastChangesValues.length > CONSTANTS.MAX_GRAPH_CHANGES_TO_SHOW) {
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
      state.playerLastDelta =
        Math.trunc((state.playerFundsEur - state.playerFundsEurOnInvest) * CONSTANTS.TRUNC_FOR_MAX_DECIMALS)
        / CONSTANTS.TRUNC_FOR_MAX_DECIMALS;
      state.showPlayerLastDelta = true;
      const now = new Date();
      state.playerLastDeltaLastShow = now.getTime();
    }
    return state;
  },

  checkShowPlayerLastDelta(state: StateInterface) {
    const now = new Date();

    if ((now.getTime() - state.playerLastDeltaLastShow) > 2000) {
      state.showPlayerLastDelta = false;
    }
  },

  enableWhales(state: StateInterface) {
    state.whalesEnabled = true;
    state.whalesIsPositive = (Math.random() > 0.7);
    state.whalesTurn = 0;

    return state;
  },

  checkIsMobile(state: StateInterface, payload: boolean) {
    state.isMobile = payload;
    return state;
  },

  endGame(state: StateInterface) {
    state.gameStatus = CONSTANTS.GAME_STATUS_ENDED;
  },
};


export const Actions = {
  ACTION_START_GAME: ({ dispatch, commit, state }: any) => {
    commit('startGame');
    setTimeout(() => dispatch(ACTION_DO_MARKET_CHANGE), 1000);
    dispatch(ACTION_CHECK_SHOW_PLAYER_LAST_DELTA);

    setTimeout(() => dispatch(ACTION_ENABLE_WHALES), CONSTANTS.WHALES_ENABLED_EVERY_TOT_SECONDS * 1000);
  },

  ACTION_RESTART_GAME: ({commit}: any) => {
    commit('restartGame');
  },

  ACTION_END_GAME: ({commit}: any) => {
    commit('endGame');
  },

  ACTION_DO_MARKET_CHANGE: ({dispatch, commit, state}: any) => {
    if (state.gameStatus === CONSTANTS.GAME_STATUS_ONGOING) {

      if (state.level >= CONSTANTS.FINAL_LEVEL) {
        commit('endGame');
      } else {
        commit('doMarketChange');
        setTimeout(() => dispatch(ACTION_DO_MARKET_CHANGE), Math.ceil(Math.random() * 1000));
      }
    }
  },

  ACTION_TOGGLE_INVEST: ({dispatch, commit}: any) => {
    commit('toggleInvest');
  },

  ACTION_CHECK_SHOW_PLAYER_LAST_DELTA: ({dispatch, commit, state}: any) => {
    commit('checkShowPlayerLastDelta');

    if (state.gameStatus === CONSTANTS.GAME_STATUS_ONGOING) {
      setTimeout(() => dispatch(ACTION_CHECK_SHOW_PLAYER_LAST_DELTA), 1000);
    }
  },

  ACTION_ENABLE_WHALES: ({commit, state, dispatch}: any) => {
    if (state.gameStatus === CONSTANTS.GAME_STATUS_ONGOING) {
      commit('enableWhales');
      setTimeout(() => dispatch(ACTION_ENABLE_WHALES), CONSTANTS.WHALES_ENABLED_EVERY_TOT_SECONDS * 1000);
    }
  },

  ACTION_CHECK_IS_MOBILE: ({commit}: any) => {
    isMobile().then(
        () => commit('checkIsMobile', true),
        () => commit('checkIsMobile', false),
    );
  },

};



export default new Vuex.Store({
  state: defaultStore,
  mutations: Mutations,
  actions: Actions,
});
