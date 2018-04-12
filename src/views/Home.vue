<template>
  <div class="row">
    <div class="col text-center">

      <transition enter-active-class="animated fadeInDown" leave-active-class="animated fadeOut" >
        <h1 v-show="showTitle" ref="title" >BTC</h1>
      </transition>

      <transition enter-active-class="animated fadeInDown" leave-active-class="animated fadeOut" >
        <div v-show="showButton" >
          <router-link ref="button" to="/game">
            <b-button variant="primary" size="lg" ty>Play</b-button>
          </router-link>
        </div>
      </transition>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ChangeBoard from '@/components/ChangeBoard.vue'; // @ is an alias to /src

@Component({
  components: {
    ChangeBoard,
  },
})
export default class Home extends Vue {
    private showTitle: boolean = false;
    private showButton: boolean = false;

    private mounted() {
        setTimeout(() => this.showTitle = true, 500);
        setTimeout(() => this.showButton = true, 800);
    }

}
</script>

<style lang="scss">
  h1 {
    font-size: 60px;
    margin-top: 60px;
  }
</style>