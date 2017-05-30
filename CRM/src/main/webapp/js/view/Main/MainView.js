/**
 * Created by Administrator on 2017/2/10.
 */
define(
    ['jquery', 'underscore', 'backbone', 'echarts', 'text!templates/Main/main.html'],
    function ($, _, Backbone, echarts, mainTemplate)
    {
        MainView = Backbone.View.extend({
            templates: {
                "mainTemplate": _.template(mainTemplate)
            },
            initialize: function () {
                this.render();
                return this;
            },
            render: function () {
                var _this = this;
                _this.$el.html(_this.templates.mainTemplate());

                var myChart = echarts.init(this.$("#homeline").get(0));

                //app.title = '折柱混合';

                option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        feature: {
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    legend: {
                        data:['有效单','无效单','有效率']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '单量',
                            min: 0,
                            max: 250,
                            interval: 50,
                            axisLabel: {
                                formatter: '{value} 单'
                            }
                        },
                        {
                            type: 'value',
                            name: '有效率',
                            min: 0,
                            max: 100,
                            interval: 10,
                            axisLabel: {
                                formatter: '{value} \%'
                            }
                        }
                    ],
                    series: [
                        {
                            name:'有效单',
                            type:'bar',
                            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                        },
                        {
                            name:'无效单',
                            type:'bar',
                            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                        },
                        {
                            name:'有效率',
                            type:'line',
                            yAxisIndex: 1,
                            data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                        }
                    ]
                };

                myChart.setOption(option);
            },
            events: {

            }
        });
        return MainView;
    }
);