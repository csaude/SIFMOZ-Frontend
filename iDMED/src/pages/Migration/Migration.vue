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
import { QSpinnerBall, useQuasar } from 'quasar'
export default {
  data () {
    return {
      progress: [],
      paramsStatus: null,
      stockStatus: null,
      patientStatus: null,
      $q: useQuasar(),
      t: ''
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
    showloading () {
      console.log('loaging')
       this.$q.loading.show({
          spinner: QSpinnerBall,
          spinnerColor: 'gray',
          spinnerSize: 140,
          message: 'Carregando, aguarde por favor...',
          messageColor: 'white'
        })
    },
    hideLoading () {
      this.$q.loading.hide()
    },
    getMigrationPregress () {
      Report.apiMigrationStatus().then(resp => {
        this.progress = resp.response.data
        this.loadSpecificStatus()
        this.t = null
        if (!this.isMigrationFinished) this.t = ''
      })
    },
    loadSpecificStatus () {
      this.progress.forEach(progss => {
        if (progss.migration_stage === 'PATIENT_MIGRATION_STAGE') {
          this.patientStatus = progss
        } else if (progss.migration_stage === 'STOCK_MIGRATION_STAGE') {
          this.stockStatus = progss
        } else if (progss.migration_stage === 'PARAMS_MIGRATION_STAGE') {
          this.paramsStatus = progss
        }
      })
      this.hideLoading()
    },
    migrationStarted () {
      this.showloading()
      MigrationStage.apiGetAll(0, 5)
      this.getMigrationPregress()
    }

  },
  watch: {
     t (oldt, newt) {
      if (oldt !== newt) {
      if (this.isMigrationFinished) {
        oldt = newt
        clearInterval(this.t)
      }
           setInterval(() => {
              this.getMigrationPregress()
          }, 6 * 1000)
      } else {
          clearInterval(this.t)
      }
  }
  },
  mounted () {
    this.showloading()
    this.getMigrationPregress()
    MigrationStage.apiGetAll(0, 5)
  },
  computed: {
    currStatus () {
      return this.progress
    },
    isMigrationFinished () {
      const isFinished = this.progress.some((p) => {
        return p.stage_progress < 100
      })
      return isFinished
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
