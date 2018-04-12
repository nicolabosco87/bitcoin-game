<template xmlns:active="http://www.w3.org/1999/xhtml">

    <b-list-group>
        <b-list-group-item v-if="showRank(1000000)" class="d-flex justify-content-between align-items-center" :variant="getRankVariant(1000000)"  >
            Crypto God
            <b-badge variant="primary" pill>1kk+ USD</b-badge>
        </b-list-group-item>
        <b-list-group-item v-if="showRank(100000, 1000000)" class="d-flex justify-content-between align-items-center" :variant="getRankVariant(100000, 1000000)" >
            Crypto King
            <b-badge variant="primary" pill>100k+ USD</b-badge>
        </b-list-group-item>
        <b-list-group-item v-if="showRank(10000, 100000)" class="d-flex justify-content-between align-items-center" :variant="getRankVariant(10000, 100000)">
            Manager
            <b-badge variant="primary" pill>10k+ USD</b-badge>
        </b-list-group-item>
        <b-list-group-item v-if="showRank(1000, 10000)" class="d-flex justify-content-between align-items-center" :variant="getRankVariant(1000, 10000)" >
            Skilled Guy
            <b-badge variant="primary" pill>1k+ USD</b-badge>
        </b-list-group-item>
        <b-list-group-item v-if="showRank(100, 1000)" class="d-flex justify-content-between align-items-center" :variant="getRankVariant(100, 1000)" >
            Noob
            <b-badge variant="primary" pill>100+ USD</b-badge>
        </b-list-group-item>
        <b-list-group-item v-if="showRank(30, 100)" class="d-flex justify-content-between align-items-center" :variant="getRankVariant(30, 100)">
            Looser
            <b-badge variant="primary" pill>30+ USD</b-badge>
        </b-list-group-item>
        <b-list-group-item v-if="showRank(1, 30)" class="d-flex justify-content-between align-items-center" :variant="getRankVariant(1, 30)">
            Dead
            <b-badge variant="primary" pill>< 30 USD</b-badge>
        </b-list-group-item>
    </b-list-group>

</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {State} from "vuex-class";

    @Component
    export default class Rank extends Vue {
        @Prop({required: true,}) private funds!: number;
        @State('isMobile') private isMobile!: boolean;

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
