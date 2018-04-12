<template>
  <div id="app" >
    <div class="container-fluid">
      <!--<div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/game">Game</router-link> |
        <router-link to="/about">About</router-link>
      </div>-->
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import {Action} from "vuex-class";
  import {ACTION_CHECK_IS_MOBILE} from "@/store";

  @Component
  export default class App extends Vue {
    @Action(ACTION_CHECK_IS_MOBILE) private checkIsMobile!: () => void;

    private mounted() {
      this.checkIsMobile();

      window.addEventListener("resize", () => this.checkIsMobile());
    }

  }
</script>

<style lang="scss">

</style>
