<template>
  <div>
    <div id="Alloc" class="chart-container" />
    <hr>
    <div id="StackInuse" class="chart-container" />
    <hr>
    <div id="PauseTotalNs" class="chart-container" />
    <hr>
    <div id="NumGoroutine" class="chart-container" />
  </div>
</template>

<script lang="ts">
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
// eslint-disable-next-line camelcase
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

import { Component, Vue } from 'nuxt-property-decorator'
import { LineSeries } from '@amcharts/amcharts5/xy'

@Component
export default class Metrics extends Vue {
    root: any

    async fetch () {
      await this.$axios
        .get('/dev/metrics/get/')
        .then((response) => {
        // this.responseData = response.data
          for (const key in response.data) {
            this.initChart(key, response.data[key])
          }
        })
        .catch((error) => {
          console.error(error)
          this.$notification.show({
            type: 'error',
            message: error
          })
        })
    }

    beforeDestroy () {
      if (this.root) {
        for (const key in this.root) {
          this.root[key].dispose()
        }
      }
    }

    initChart (title: string, seriesResult: any) {
      const root = am5.Root.new(title)

      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([
        am5themes_Animated.new(root)
      ])

      // Create chart
      // https://www.amcharts.com/docs/v5/charts/xy-chart/
      const chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        maxTooltipDistance: 0,
        pinchZoomX: true,
        height: 300
      }))

      chart.children.unshift(am5.Label.new(root, {
        text: title,
        fontSize: 25,
        fontWeight: '500',
        textAlign: 'center',
        x: am5.percent(45),
        centerX: am5.percent(45),
        paddingTop: 30
      }))

      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      const xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: {
          timeUnit: 'second',
          count: 30
        },
        // groupData: true,
        // groupCount: 20,
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {})
      }))

      xAxis.children.unshift(
        am5.Label.new(root, {
          // rotation: -90,
          text: seriesResult.XAxisTitle,
          fontWeight: '500',
          fontVariant: 'small-caps',
          // y: am5.p50,
          // centerX: am5.p50,
          // position: 'absolute'
          paddingTop: 10,
          paddingLeft: -30
        })
      )

      const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        tooltip: am5.Tooltip.new(root, {})
      }))

      // Add series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/

      for (const key in seriesResult.Data) {
        const series = chart.series.push(am5xy.LineSeries.new(root, {
          name: key,
          xAxis,
          yAxis,
          valueYField: 'v',
          valueXField: 't',
          legendValueText: '{valueY}',
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: 'horizontal',
            labelText: '{valueY}'
          })
        }))

        series.data.setAll(seriesResult.Data[key])

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear()
      }

      // Add cursor
      // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
      const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
        behavior: 'none'
      }))
      cursor.lineY.set('visible', false)

      // Add scrollbar
      // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
      chart.set('scrollbarX', am5.Scrollbar.new(root, {
        orientation: 'horizontal'
      }))

      chart.set('scrollbarY', am5.Scrollbar.new(root, {
        orientation: 'vertical'
      }))

      // Add legend
      // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
      const legend = chart.rightAxesContainer.children.push(am5.Legend.new(root, {
        width: 200,
        paddingLeft: 15,
        height: am5.percent(100)
      }))

      // When legend item container is hovered, dim all the series except the hovered one
      legend.itemContainers.template.events.on('pointerover', function (e) {
        const itemContainer = e.target

        // As series list is data of a legend, dataContext is series
        const series = itemContainer.dataItem.dataContext

        chart.series.each(function (chartSeries: typeof LineSeries) {
          // eslint-disable-next-line eqeqeq
          if (chartSeries != series) {
            chartSeries.strokes.template.setAll({
              strokeOpacity: 0.15,
              stroke: am5.color(0x000000)
            })
          } else {
            chartSeries.strokes.template.setAll({
              strokeWidth: 3
            })
          }
        })
      })

      // When legend item container is unhovered, make all series as they are
      legend.itemContainers.template.events.on('pointerout', function () {
        chart.series.each(function (chartSeries: typeof LineSeries) {
          chartSeries.strokes.template.setAll({
            strokeOpacity: 1,
            strokeWidth: 1,
            stroke: chartSeries.get('fill')
          })
        })
      })

      legend.itemContainers.template.set('width', am5.p100)
      legend.valueLabels.template.setAll({
        width: am5.p100,
        textAlign: 'right'
      })

      // It's is important to set legend data after all the events are set on template, otherwise events won't be copied

      legend.data.setAll(chart.series.values)

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      chart.appear(1000, 100)

      if (this.root === undefined) {
        this.root = {}
      }
      this.root[title] = root
    }
}
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 300px
}
</style>
