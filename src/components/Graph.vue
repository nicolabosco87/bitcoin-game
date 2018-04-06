<template xmlns:active="http://www.w3.org/1999/xhtml">

    <div :style=styles :class=cssClasses>
        <canvas :id=chartId :width=width :height=height ref="canvas"/>
    </div>

</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import Chart, { ChartData, ChartOptions } from 'chart.js';

    @Component({
        props: {
            chartId: String,
            width: Number,
            height: Number,
            cssClasses: String,
            styles: Object,
            plugins: Array,
            chartType: String,
            data: Array,
            options: Object,
        },
    })
    export default class Graph extends Vue {
        private chartId!: string;
        private width!: number;
        private height!: number;
        private cssClasses!: string;
        private chartType!: string;
        private styles!: { [key: string]: string };
        private plugins!: any[];

        private data!: any[];
        private options!: ChartOptions;

        private chart: Chart | null = null;



        public addPlugin(plugin: any) {
            this.plugins.push(plugin);
        }

        public renderChart(data: any, options: any) {
            const canvas: any = this.$refs.canvas;

            this.chart = new Chart(
                    canvas.getContext('2d'), {
                        type: this.chartType,
                        data: {
                            labels: data,
                            datasets: [{
                                backgroundColor: '#ffffff',
                                borderWidth: 1,
                                borderColor: '#aa0000',
                                lineTension: 0,
                                fill: false,
                                data,
                            }],
                        },
                        options,
                        plugins: this.plugins,
                    },
            );
        }

        public reRenderChart() {
            if (this.chart) {
                this.chart.destroy();
            }
            this.renderChart(this.data, this.options);
        }

        private mounted() {
            this.reRenderChart();
        }

        private beforeDestroy() {
            if (this.chart) {
                this.chart.destroy();
            }
        }

        @Watch('data')
        private onDataChanged(val: any[], oldVal: any[]) {
            this.data = val;
            if (this.chart) {
                this.chart.update();
            }
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
