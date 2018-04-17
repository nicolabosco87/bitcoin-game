<template xmlns:active="http://www.w3.org/1999/xhtml">

    <div :style=styles :class=cssClasses>
        <canvas :id=chartId :width=width :height="height === 'auto' ? null : height" ref="canvas"/>
    </div>

</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import Chart, { ChartData, ChartOptions } from 'chart.js';
    import {State} from 'vuex-class';

    @Component
    export default class Graph extends Vue {
        @Prop({default: ''}) private chartId!: string;
        @Prop() private width!: number;
        @Prop() private height!: number;
        @Prop({default: ''}) private cssClasses!: string;
        @Prop({default: ''}) private chartType!: string;
        @Prop() private styles!: { [key: string]: string };
        @Prop() private plugins!: any[];
        @Prop() private data!: any[];
        @Prop() private options!: ChartOptions;
        @State('isMobile') private isMobile!: boolean;
        private chart: Chart|null = null;

        public addPlugin(plugin: any) {
            this.plugins.push(plugin);
        }

        public renderChart(data: any, options: any = {}) {
            const canvas: any = this.$refs.canvas;

            const optionsWithDefaults: ChartOptions = Object.assign(options, {
                legend: {
                    display: false,
                },
                tooltips: {
                    enabled: false,
                },
                scales: {
                    xAxes: [{
                        display: !this.isMobile,
                    }],
                },
            });

            this.chart = new Chart(
                canvas.getContext('2d'), {
                    type: this.chartType,
                    data: {
                        labels: data,
                        datasets: [{
                            backgroundColor: '#ffffff',
                            borderWidth: this.isMobile ? 1 : 5,
                            borderColor: '#aa0000',
                            lineTension: 0,
                            fill: false,
                            data,
                        }],
                    },
                    options: optionsWithDefaults,
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
