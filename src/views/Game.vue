<template>
  <div class="home">
    <div class="container-fluid">
      <div class="row">
        <div class="col">

          <ChangeBoard/>
        </div>
      </div>
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
