<template xmlns:active="http://www.w3.org/1999/xhtml">

    <div>

        <!-- Tutorial Modal -->
        <b-modal id="startGameModal" title="Tutorial" ref="startGameModal" :centered="true"
                 :hide-footer="true" :hide-header-close="true" :ok-disabled="true" :cancel-disabled="true"
                 :no-close-on-backdrop="true" :no-close-on-esc="true" >

            <div v-if="gameStatus == GAME_STATUS_START">
                <p class="my-4">Press the "space bar" for buying/selling Bitcoins.</p>
                <p class="my-4">Try to gain cash as much you can.</p>
            </div>

            <div v-if="gameStatus == GAME_STATUS_ENDED"></div>

            <p class="my-4 text-center">
                <button class="btn btn-primary" v-on:click="quitTutorialAndStartGame()">START GAME</button>
            </p>
        </b-modal>

        <h2 class="mt-5">Level: {{ level }}</h2>


        <div class="row">
            <div class="col-auto">

                <div class="row">
                    <div class="col">

                    </div>
                </div>

            </div>
        </div>

        <b-tooltip :show.sync="showPlayerLastDelta" target="usdBalance" placement="top">
            <span :class="playerLastDelta > 0 ? 'text-success' : 'text-danger'" >
                {{ playerLastDelta > 0 ? '+' : '' }} {{playerLastDelta}} USD
            </span>
        </b-tooltip>

        <div class="board-changes">
            <div id="usdBalance" v-bind:class="{'board-changes__eur-amount': true, active: !invested }"  >
                {{ playerFundsEur }} USD
            </div>
            <div class="board-changes__change-value">{{ currentChangeValue }} USD/BTC</div>
            <div v-bind:class="{'board-changes__btc-amount': true, active: invested }" >{{ playerFundsBtc }} BTC</div>
        </div>

        <Graph ref="gameGraph" chartType="line" v-bind:data="lastChangesValues" />

        <div class="text-center my-4">
            <button class="btn btn-primary" v-on:click="toggleInvest()" >{{ buttonText }}</button>
        </div>

    </div>

</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import {Action, State} from 'vuex-class';
import * as CONSTANTS from '../constants';
import Graph from './Graph.vue';
import {ACTION_START_GAME, ACTION_TOGGLE_INVEST} from '@/store';
import {Modal} from 'bootstrap-vue';

@Component({
    components: {
        Graph,
    },
})
export default class ChangeBoard extends Vue {
    @State('gameStatus') private gameStatus!: string;
    @State('level') private level!: number;
    @State('invested') private invested!: boolean;
    @State('playerFundsEur') private playerFundsEur!: number;
    @State('playerFundsBtc') private playerFundsBtc!: number;
    @State('playerLastDelta') private playerLastDelta!: number;
    @State('currentChangeValue') private currentChangeValue!: number;
    @State('lastChangesValues') private lastChangesValues!: number[];
    @State('showPlayerLastDelta') private showPlayerLastDelta!: boolean;
    @Action(ACTION_START_GAME) private startGame!: () => void;
    @Action(ACTION_TOGGLE_INVEST) private toggleInvest!: () => void;

    private GAME_STATUS_START: string = CONSTANTS.GAME_STATUS_START;
    private GAME_STATUS_ONGOING: string = CONSTANTS.GAME_STATUS_ONGOING;
    private GAME_STATUS_ENDED: string = CONSTANTS.GAME_STATUS_ENDED;

    get buttonText() {
        return (this.invested) ? 'Sell' : 'Buy';
    }

    private quitTutorialAndStartGame() {
        (this.$refs.startGameModal as Modal).hide();
        this.startGame();

        // Waiting for rendering time
        setTimeout(() => (this.$refs.gameGraph as Graph).reRenderChart(), 100);
    }

    private showModal() {
        (this.$refs.startGameModal as Modal).show();
    }


    private mounted() {

        this.showModal();

        // If spacebar has been pressed...
        window.addEventListener('keyup', (event: KeyboardEvent) => {
         if (event.keyCode === 32 && this.gameStatus === CONSTANTS.GAME_STATUS_ONGOING) {
             this.toggleInvest();
             }
         });
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    .board-changes {
        background: #eee;
        padding: 15px;
        display: flex;
        justify-content: center;

        > div {
            padding: 15px;
        }

        > div.active {

            &.board-changes__eur-amount {
                border: 2px solid #30348c;
            }

            &.board-changes__btc-amount {
                border: 2px solid #FF9900;
            }

        }
    }
</style>
