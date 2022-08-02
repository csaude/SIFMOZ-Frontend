<template>
  <div q-px-xl>
    <TitleBar>Migração de dados</TitleBar>
    <MigrationStart
      v-if="!hasStarted"
      @migrationStarted="migrationStarted"
    />
    <div class="row q-mt-md" v-if="statusLoaded && hasStarted">
      <div class="col"><ParamsProgress :data="paramsStatus" /></div>
      <div class="col"><StockProgress :data="stockStatus"  /></div>
      <div class="col"><PatientProgress :data="patientStatus"  /></div>
    </div>
  </div>
</template>

<script>
import Report from 'src/store/models/report/Report'
import MigrationStage from 'src/store/models/Migration/MigrationStage'
export default {
  data () {
    return {
      progress: [],
      paramsStatus: null,
      stockStatus: null,
      patientStatus: null
    }
  },
  components: {
    TitleBar: require('components/Shared/TitleBar.vue').default,
    ParamsProgress: require('components/Migration/ParamsProgress.vue').default,
    StockProgress: require('components/Migration/StockProgress.vue').default,
    MigrationStart: require('components/Migration/MigrationStart.vue').default,
    PatientProgress: require('components/Migration/PatientProgress.vue').default
  },
  methods: {
    getMigrationPregress () {
      Report.apiMigrationStatus().then(resp => {
        console.log(resp.response.data)
        this.progress = resp.response.data
        this.loadSpecificStatus()
      })
      // setTimeout(this.getMigrationPregress(), 10000)
    },
    loadSpecificStatus () {
      this.progress.forEach(progss => {
        if (progss.migration_stage === 'PATIENT_MIGRATION_STAGE') {
          this.patientStatus = progss
        } else if (progss.migration_stage === 'STOCK_MIGRATION_STAGE') {
          this.stockStatus = progss
        }
      })
    },
    migrationStarted () {
      MigrationStage.apiGetAll(0, 5)
      this.getMigrationPregress()
    }

  },
  mounted () {
    this.getMigrationPregress()
    MigrationStage.apiGetAll(0, 5)
  },
  computed: {
    currStatus () {
      return this.progress
    },
    statusLoaded () {
      return this.progress.length > 0
    },
    migrationStages () {
      return MigrationStage.all()
    },
    hasStarted () {
      const started = this.migrationStages.some((stage) => {
        return stage.value !== 'NOT_STARTED'
      })
      return started
    }
  }
}
</script>

<style>

</style>
