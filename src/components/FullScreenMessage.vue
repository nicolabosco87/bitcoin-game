<template xmlns:active="http://www.w3.org/1999/xhtml">

    <transition name="fullscreen-message-tx" >
        <div v-if="showMessage" >
            <div class="fullscreen-message">
                <div class="fullscreen-message__content" :class="classes" >
                    <slot></slot>
                </div>
            </div>
        </div>
    </transition>

</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {State} from 'vuex-class';
    import * as CONSTANTS from '@/constants';

    @Component
    export default class FullScreenMessage extends Vue {
        @Prop() public timeout!: number;
        @Prop({default: ''}) public classes!: string;
        @State('gameStatus') private gameStatus!: string;


        private showMessage: boolean = false;

        public show() {
            this.showMessage = true;
            setTimeout(() => this.hide(), this.timeout + 1000);
        }

        public hide() {
            this.showMessage = false;
        }

        @Watch('gameStatus')
        private onGameStatusChange(val: string, oldVal: string) {
            if (val !== CONSTANTS.GAME_STATUS_ONGOING) {
                this.hide();
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

    .fullscreen-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 15px;
        z-index: 10000;
        display: block;

        @include media-breakpoint-down(sm) {
            /*background: #fff;*/
            position: relative;
            top: auto;
            left: auto;
            transform: none;
            text-align: center;
            padding: 0;
        }
    }

    .fullscreen-message-tx {
        z-index: 10000;
    }

    .fullscreen-message-tx-enter {
        opacity: 0;
    }

    .fullscreen-message-tx-enter-active, .fullscreen-message-tx-leave-active {
        transition: opacity .5s;
    }

    .fullscreen-message-tx-leave-active {
        opacity: 0;
    }

</style>
