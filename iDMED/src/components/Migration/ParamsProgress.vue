<template>
  <div>
    <apexchart
      style="max-width: 100%; "
      height="500"
      type="radialBar"
      :options="chartOptions"
      :series="series"
      />
      <div class="column items-center">
        <q-table
          flat
            separator="vertical"
          :rows="rows"
          :columns="columns"
          row-key="name"
          hide-bottom
        >
        </q-table>
      </div>
   </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
const columns = [
  { name: 'calories', align: 'center', label: 'Total', field: 'calories', sortable: true },
  { name: 'fat', label: 'Migrados', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Rejeitados', field: 'carbs' }
]

const rows = [
  {
    calories: 159,
    fat: 6.0,
    carbs: 24
  }
]
export default {
  props: ['data'],
  components: {
    apexchart: VueApexCharts
  },
  data () {
    return {
      columns,
      rows,
     series: [Math.round(Number(100))],
          chartOptions: {
            chart: {
              height: 350,
              type: 'radialBar',
              offsetY: -10
            },
            plotOptions: {
              radialBar: {
                startAngle: -135,
                endAngle: 135,
                dataLabels: {
                  name: {
                    fontSize: '16px',
                    color: undefined,
                    offsetY: 120
                  },
                  value: {
                    offsetY: 76,
                    fontSize: '22px',
                    color: undefined,
                    formatter: function (val) {
                      return val + '%'
                    }
                  }
                }
              }
            },
            fill: {
              type: 'gradient',
              gradient: {
                  shade: 'dark',
                  shadeIntensity: 0.15,
                  inverseColors: false,
                  opacityFrom: 1,
                  opacityTo: 1,
                  stops: [0, 50, 65, 91]
              }
            },
            stroke: {
              dashArray: 4
            },
            labels: ['Parâmetros']
          }
    }
  }
}
</script>

<style>

</style>
