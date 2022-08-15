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
    <div class="column items-center">
      <div class="row q-mt-xl">
        <q-btn outline rounded color="blue-9" label="Imprimir relatório de erros" @click="printReport()"/>
        <q-btn class="q-ml-md" outline rounded color="blue-9" label="Ver detalhes do progresso" @click="showprogressDetails=true"/>
      </div>
    </div>
    <q-dialog persistent v-model="showprogressDetails">
        <ProgressDetails
          :stage="stage"
          @close="showprogressDetails = false" />
    </q-dialog>
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
      stage: '',
      showprogressDetails: false,
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
    PatientProgress: require('components/Migration/PatientProgress.vue').default,
    ProgressDetails: require('components/Migration/ProgressDetails.vue').default
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
          if ((this.patientStatus.total_migrated !== 0 || this.patientStatus.total_rejcted !== 0) && this.patientStatus.stage_progress < 100) {
            this.stage = 'PATIENT_MIGRATION_STAGE'
          }
        } else if (progss.migration_stage === 'STOCK_MIGRATION_STAGE') {
          this.stockStatus = progss
          if ((this.stockStatus.total_migrated !== 0 || this.stockStatus.total_rejcted !== 0) && this.stockStatus.stage_progress < 100) {
            this.stage = 'STOCK_MIGRATION_STAGE'
          }
        } else if (progss.migration_stage === 'PARAMS_MIGRATION_STAGE') {
          this.paramsStatus = progss
          if ((this.paramsStatus.total_migrated !== 0 || this.paramsStatus.total_rejcted !== 0) && this.paramsStatus.stage_progress < 100) {
            this.stage = 'PARAMS_MIGRATION_STAGE'
          }
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
