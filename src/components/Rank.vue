<template xmlns:active="http://www.w3.org/1999/xhtml">

    <b-list-group>

        <b-list-group-item v-for="rank of ranks" v-if="showRank(rank.min, rank.max)"
                           class="d-flex justify-content-between align-items-center"
                           :variant="getRankVariant(rank.min, rank.max)" >
            {{rank.name}}
            <b-badge variant="primary" pill>{{RankFundsDetail(rank)}} USD</b-badge>
        </b-list-group-item>

    </b-list-group>

</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {State} from 'vuex-class';
    import { Ranks, RankInterface, RankFundsDetail } from '@/lib/Rank';

    @Component
    export default class Rank extends Vue {
        @Prop({required: true}) private funds!: number;
        @State('isMobile') private isMobile!: boolean;

        private ranks = Ranks;
        private RankFundsDetail = RankFundsDetail;

        private getRankVariant(min: number, max?: number) {
            return this.isCurrentRank(min, max) ? 'primary' : 'light';
        }

        private showRank(min: number, max?: number) {
            if (!this.isMobile) {
                return true;
            } else {
                return this.isCurrentRank(min, max);
            }
        }

        private isCurrentRank(min: number, max?: number) {
            if (min <= this.funds) {
                if (!max) {
                    return true;
                }

                return (this.funds < max);
            }
            return false;
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    b-badge {
        float: right;
    }
</style>
