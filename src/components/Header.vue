<template>
    <b-navbar toggleable="md" type="dark" variant="primary">

        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-navbar-brand href="/">Bitcoin Wizard</b-navbar-brand>



        <b-collapse is-nav id="nav_collapse">

            <b-navbar-nav class="ml-auto" >
                <b-nav-item v-if="gameStatus !== GAME_STATUS_ONGOING" href="/game" >Start Game</b-nav-item>
                <b-nav-item v-if="gameStatus === GAME_STATUS_ONGOING" @click="endGame()" >Restart Game</b-nav-item>
                <b-nav-item href="/about" >About</b-nav-item>
            </b-navbar-nav>

        </b-collapse>
    </b-navbar>
</template>


<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {ACTION_END_GAME} from '@/store';
    import * as CONSTANTS from '@/constants';

    @Component
    export default class Header extends Vue {
        @State('gameStatus') private gameStatus!: string;
        @Action(ACTION_END_GAME) private endGame!: () => void;

        private GAME_STATUS_ONGOING: string = CONSTANTS.GAME_STATUS_ONGOING;
    }
</script>

<style lang="scss">

</style>