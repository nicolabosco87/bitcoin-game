<template xmlns:active="http://www.w3.org/1999/xhtml">

    <div>

        <!-- Modal Component -->
        <b-modal id="modal1" title="Bootstrap-Vue" ref="myModalRef" >
            <p class="my-4">Hello from modal!</p>
        </b-modal>

        <div v-if="gameStatus == GAME_STATUS_START" >
            <button class="btn btn-primary" v-on:click="showModal()">START GAME</button>
        </div>


        <div v-if="gameStatus == GAME_STATUS_ONGOING" >

            <h2>Level: {{ level }}</h2>

            <div class="board-changes">
                <div v-bind:class="{'board-changes__eur-amount': true, active: !invested }" >
                    <span>{{ playerLastDelta }}</span>
                    {{ playerFundsEur }} EUR
                </div>
                <div class="board-changes__change-value">{{ currentChangeValue }} EUR/BTC</div>
                <div v-bind:class="{'board-changes__btc-amount': true, active: invested }" >{{ playerFundsBtc }} BTC</div>
            </div>

            <Graph chartType="line" v-bind:data="lastChangesValues" />

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
    @Action(ACTION_START_GAME) private startGame!: () => void;
    @Action(ACTION_TOGGLE_INVEST) private toggleInvest!: () => void;

    private GAME_STATUS_START: string = CONSTANTS.GAME_STATUS_START;
    private GAME_STATUS_ONGOING: string = CONSTANTS.GAME_STATUS_ONGOING;



    get buttonText() {
        return (this.invested) ? 'Sell' : 'Buy';
    }

    private showModal() {
        (this.$refs.myModalRef as Modal).show();
    }


    private mounted() {
         window.addEventListener('keyup', (event: KeyboardEvent) => {
         // If spacebar has been pressed...
         if (event.keyCode === 32) {
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
