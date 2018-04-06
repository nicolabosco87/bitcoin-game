<template>
  <div class="row">
    <div class="col-xs-12 text-center">
      <h1>BTC</h1>

      <button class="btn btn-primary">Play</button>
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
