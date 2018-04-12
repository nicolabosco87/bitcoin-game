<template xmlns:active="http://www.w3.org/1999/xhtml">

    <div>

        <!-- Tutorial Modal -->
        <b-modal id="startGameModal" title="Tutorial" ref="startGameModal" :centered="true"
                 :hide-footer="true" :hide-header-close="true" :ok-disabled="true" :cancel-disabled="true"
                 :no-close-on-backdrop="true" :no-close-on-esc="true" >

            <div class="text-center" v-if="gameStatus == GAME_STATUS_START">
                <p class="my-4">Press the "space bar" or press the Buy/Sell button for buying/selling Bitcoins.</p>
                <p class="my-4">Try to gain cash as much you can.</p>
            </div>

            <div v-if="gameStatus == GAME_STATUS_ENDED"></div>

            <p class="my-4 text-center">
                <button class="btn btn-primary" @click="quitTutorialAndStartGame()">START GAME</button>
            </p>
        </b-modal>

        <div class="row">
            <div class="col-4 col-sm-12">
                <!-- Title -->
                <h2 id="game-level" >Level: {{ level }}</h2>
            </div>
            <div class="col-8 col-sm-12">
                <!-- FullScreen messages -->
                <FullScreenMessage ref="newLevelMessage" :timeout="1000" classes="animated pulse infinite" >
                    <div class="h1">Market is getting even more crazy!</div>
                </FullScreenMessage>

                <FullScreenMessage ref="whalesMessage" :timeout="1000" :classes="isMobile ? '' : 'animated pulse infinite'">
                    <div class="whales-alert">
                        <div class="h1">Whales are coming!</div>
                    </div>
                </FullScreenMessage>
            </div>
        </div>




        <b-tooltip :show.sync="showPlayerLastDelta" target="usdBalance" placement="top">
            <span :class="playerLastDelta > 0 ? 'text-success' : 'text-danger'" >
                {{ playerLastDelta > 0 ? '+' : '' }} {{playerLastDelta}} USD
            </span>
        </b-tooltip>

        <!-- Box with current changes -->
        <div class="board-changes">
            <div id="usdBalance" :class="{'board-changes__eur-amount': true, active: !invested }"  >{{ playerFundsEur }} USD</div>
            <div class="board-changes__change-value">{{ currentChangeValue }} USD/BTC</div>
            <div id="btcBalance" :class="{'board-changes__btc-amount': true, active: invested }" >{{ playerFundsBtc }} BTC</div>
        </div>

        <b-tooltip :show="!isMobile && gameStatus === GAME_STATUS_ONGOING && invested === false" target="usdBalance" placement="bottom" >Currently Invested in</b-tooltip>
        <b-tooltip :show="!isMobile && gameStatus === GAME_STATUS_ONGOING && invested === true" target="btcBalance" placement="bottom" >Currently Invested in</b-tooltip>


        <!-- Section with graph and rank table -->
        <div class="row mt-3">
            <div class="col-xs-12 col-sm-9">
                <Graph v-if="chartCalculatedHeight !== false" ref="gameGraph" :height="chartCalculatedHeight > 0 ? chartCalculatedHeight : false" chartType="line" v-bind:data="lastChangesValues" />
            </div>
            <div class="col-xs-12 col-sm-3">
                <Rank :funds="playerFundsEur" />
            </div>
        </div>

        <!-- Buy/Sell button -->
        <div class="text-center my-4">
            <button class="btn btn-primary btn-lg" @click="toggleInvest()" >{{ buttonText }}</button>
        </div>

    </div>

</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import {Action, State} from 'vuex-class';
import * as CONSTANTS from '../constants';
import Graph from './Graph.vue';
import Rank from './Rank.vue';
import FullScreenMessage from './FullScreenMessage.vue';
import {ACTION_START_GAME, ACTION_TOGGLE_INVEST} from '@/store';
import {Modal, Tooltip} from 'bootstrap-vue';
import {isMobile} from '@/lib/Utils';

@Component({
    components: {
        Graph,
        FullScreenMessage,
        Rank,
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
    @State('whalesEnabled') private whalesEnabled!: boolean;
    @State('isMobile') private isMobile!: boolean;
    @Action(ACTION_START_GAME) private startGame!: () => void;
    @Action(ACTION_TOGGLE_INVEST) private toggleInvest!: () => void;

    private GAME_STATUS_START: string = CONSTANTS.GAME_STATUS_START;
    private GAME_STATUS_ONGOING: string = CONSTANTS.GAME_STATUS_ONGOING;
    private GAME_STATUS_ENDED: string = CONSTANTS.GAME_STATUS_ENDED;
    private showLevelAdvance: boolean = false;
    private chartCalculatedHeight:number|boolean|string = false;

    get buttonText() {
        return (this.invested) ? 'Sell' : 'Buy';
    }

    get currentlyInvestedTooltip() {
        return (this.invested) ? 'btcBalance' : 'usdBalance';
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

    private chartHeight() {
        setTimeout(() => this.chartCalculatedHeight = (this.isMobile) ? 200 : 'auto', 100);
    }

    private mounted() {

        this.chartHeight();

        this.showModal();

        // If spacebar has been pressed...
        window.addEventListener('keyup', (event: KeyboardEvent) => {
         if (event.keyCode === 32 && this.gameStatus === CONSTANTS.GAME_STATUS_ONGOING) {
             this.toggleInvest();
             }
         });
    }

    @Watch('level')
    private onLevelChanged(val: number, oldVal: number) {
        if (!this.isMobile) {
            (this.$refs.newLevelMessage as FullScreenMessage).show();
        }
    }

    @Watch('whalesEnabled')
    private onWhalesEnabledChanged(val: boolean, oldVal: boolean) {
        if (val === true) {
            (this.$refs.whalesMessage as FullScreenMessage).show();
        }
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    @import "~@/scss/variables.scss";
    @import "~bootstrap/scss/_functions.scss";
    @import "~bootstrap/scss/_variables.scss";
    @import "~bootstrap/scss/_mixins.scss";

    .board-changes {
        background: #eee;
        padding: 15px;
        display: flex;
        justify-content: center;

        @include media-breakpoint-down(sm) {
            padding: 10px;
            justify-content: space-between;
        }

        > div {
            padding: 15px;

            @include media-breakpoint-down(sm) {
                padding: 5px;
                font-size: 0.8rem;
            }
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


    .whales-alert {
        border: 5px dashed $danger;
        border-radius: 5px;
        padding: 30px;

        .h1 {
            color: $danger;
            font-size: 40px;
        }

        @include media-breakpoint-down(sm) {
            padding: 0;
            border: none;
            border-radius: 0px;

            .h1 {
                font-size: 16px;
                text-align: right;
                padding: 0;
                margin: 0;
            }
        }
    }

    @include media-breakpoint-down(sm) {
        h2 {
            font-size: 20px;
        }
    }

</style>
