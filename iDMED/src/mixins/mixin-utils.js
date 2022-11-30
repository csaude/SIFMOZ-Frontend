 import moment from 'moment'
import { date, LocalStorage, SessionStorage, QSpinnerBall, useQuasar } from 'quasar'
import Clinic from 'src/store/models/clinic/Clinic'
import Patient from 'src/store/models/patient/Patient'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import TherapeuticRegimen from 'src/store/models/therapeuticRegimen/TherapeuticRegimen'
import TherapeuticLine from 'src/store/models/therapeuticLine/TherapeuticLine'
import Doctor from 'src/store/models/doctor/Doctor'
import Duration from 'src/store/models/Duration/Duration'
import DispenseType from 'src/store/models/dispenseType/DispenseType'
import Drug from 'src/store/models/drug/Drug'
import DispenseMode from 'src/store/models/dispenseMode/DispenseMode'
import ClinicalServiceAttributeType from 'src/store/models/ClinicalServiceAttributeType/ClinicalServiceAttributeType'
import ClinicalServiceAttribute from 'src/store/models/ClinicalServiceAttribute/ClinicalServiceAttribute'
import ClinicalService from 'src/store/models/ClinicalService/ClinicalService'
import ClinicSectorType from 'src/store/models/clinicSectorType/ClinicSectorType'

export default {
  data () {
    return {
      alert: ref({
        type: '',
        visible: false,
        msg: ''
      }),
      $q: useQuasar()
    }
  },
 methods: {
  showloading () {
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
  getJSDateFromDDMMYYY (dateString) {
    const dateParts = dateString.split('-')
    return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
  },
  getDDMMYYYFromJSDate (jsDate) {
    return moment(jsDate).format('DD-MM-YYYY')
  },
  displayAlert (type, msg) {
    this.alert.type = type
    this.alert.msg = msg
    this.alert.visible = true
  },
  closeDialog () {
    this.alert.visible = false
    if (this.alert.type === 'info') {
      this.$emit('close')
    }
  },
  stringContains (stringToCheck, stringText) {
      if (stringText === '') return false
      return stringToCheck.toLowerCase().includes(stringText.toLowerCase())
  },
  formatDate (dateString) {
    return date.formatDate(dateString, 'DD-MM-YYYY')
  },
  loadParamsToVueX () {
    TherapeuticRegimen.localDbGetAll().then(regimens => {
      TherapeuticRegimen.insert({ data: regimens })
    })
    TherapeuticLine.localDbGetAll().then(regimens => {
      TherapeuticLine.insert({ data: regimens })
    })
    Doctor.localDbGetAll().then(regimens => {
      Doctor.insert({ data: regimens })
    })
    Duration.localDbGetAll().then(regimens => {
      Duration.insert({ data: regimens })
    })
    DispenseType.localDbGetAll().then(regimens => {
      DispenseType.insert({ data: regimens })
    })
    Drug.localDbGetAll().then(regimens => {
      Drug.insert({ data: regimens })
    })
    DispenseMode.localDbGetAll().then(regimens => {
      DispenseMode.insert({ data: regimens })
    })
    ClinicalService.localDbGetAll().then(services => {
      ClinicalService.insert({ data: services })
    })
    ClinicalServiceAttributeType.localDbGetAll().then(regimens => {
      ClinicalServiceAttributeType.insert({ data: regimens })
    })
    ClinicalServiceAttribute.localDbGetAll().then(regimens => {
      ClinicalServiceAttribute.insert({ data: regimens })
    })
    ClinicSectorType.localDbGetAll().then(clinicSectorTypes => {
      ClinicSectorType.insert({ data: clinicSectorTypes })
  })
  },
  idadeCalculator (birthDate) {
    if (moment(birthDate, 'YYYY/MM/DDDD').isValid()) {
       const utentBirthDate = moment(birthDate, 'YYYY/MM/DDDD')
       const todayDate = moment(new Date())
       const idade = todayDate.diff(utentBirthDate, 'years')
       console.log(idade)
      return idade
    }
}
 },
  computed: {
    isAppSyncDone () {
      return LocalStorage.getItem('system-sync-status') === 'done'
    },
    selectedPatient () {
      return new Patient(SessionStorage.getItem('selectedPatient'))
    },
    currClinic () {
      console.log('Clinica:' + SessionStorage.getItem('currClinic'))
      const clinic = Clinic.query()
                                .with('province')
                                .with('facilityType')
                                .with('district.province')
                                .where('id', '087B9202-722D-47C2-A3D2-1145DB64A860')
                                .first()
       console.log('Clinica22:' + clinic)
          if (clinic !== null) return clinic
          return new Clinic(SessionStorage.getItem('currClinic'))
    },
    getUUID () {
      return uuidv4()
    }
  },
  components: {
    Dialog: require('components/Shared/Dialog/Dialog.vue').default
  }
}
