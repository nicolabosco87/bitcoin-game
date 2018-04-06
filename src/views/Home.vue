<template>
  <div class="row">
    <div class="col text-center">
      <h1>BTC</h1>

      <router-link class="btn btn-primary" to="/game">Play</router-link>
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
export default class Home extends Vue {}
</script>
