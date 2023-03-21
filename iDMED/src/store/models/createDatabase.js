import { getMode } from 'cordova-plugin-nano-sqlite/lib/sqlite-adapter'
import { nSQL } from 'nano-sql'

  const personModel = [{ key: 'id', type: 'uuid', props: ['pk'] },
  { key: 'firstNames', type: 'string' },
  { key: 'middleNames', type: 'string' },
  { key: 'lastNames', type: 'string' },
  { key: 'gender', type: 'string' },
  { key: 'dateOfBirth', type: 'date' },
  { key: 'cellphone', type: 'string' },
  { key: 'alternativeCellphone', type: 'string' },
  { key: 'address', type: 'string' },
  { key: 'addressReference', type: 'string' },
  { key: 'province_id', type: 'string' },
  { key: 'district_id', type: 'string' },
  { key: 'clinic_id', type: 'string' },
  { key: 'clinic', type: 'object' },
  { key: 'province', type: 'object' },
  { key: 'district', type: 'object' },
  { key: 'hisLocation', type: 'string' },
  { key: 'hisLocationName', type: 'string' }
]

const patientServiceIdentfierModel = [{ key: 'id', type: 'uuid', props: ['pk'] },
  { key: 'startDate', type: 'date' },
  { key: 'endDate', type: 'date' },
  { key: 'value', type: 'string' },
  { key: 'state', type: 'string' },
  { key: 'prefered', type: 'date' },
  { key: 'identifierType', type: 'object' },
  { key: 'service', type: 'object' },
  { key: 'patient', type: 'object' },
  { key: 'episodes', type: 'list' },
  { key: 'clinic', type: 'object' },
  { key: 'district', type: 'object' },
  { key: 'clinic_id', type: 'string' },
  { key: 'service_id', type: 'string' },
  { key: 'patient_id', type: 'string' },
  { key: 'identifier_type_id', type: 'string' },
  { key: 'syncStatus', type: 'string' }
]

const episodeModel = [{ key: 'id', type: 'uuid', props: ['pk'] },
  { key: 'episodeDate', type: 'date' },
  { key: 'notes', type: 'date' },
  { key: 'creationDate', type: 'string' },
  { key: 'episodeType_id', type: 'string' },
  { key: 'clinicSector_id', type: 'string' },
  { key: 'patientServiceIdentifier_id', type: 'string' },
  { key: 'startStopReason_id', type: 'string' },
  { key: 'isLast', type: 'boolean' },
  { key: 'referralClinic_id', type: 'string' },
  { key: 'syncStatus', type: 'string' },
  { key: 'referralClinic', type: 'object' },
  { key: 'startStopReason', type: 'object' },
  { key: 'episodeType', type: 'object' },
  { key: 'clinicSector', type: 'object' },
  { key: 'patientServiceIdentifier', type: 'object' },
  { key: 'patientVisitDetails', type: 'object' }
]

const patientVisitModel = [{ key: 'id', type: 'uuid', props: ['pk'] },
  { key: 'visitDate', type: 'date' },
  { key: 'clinic_id', type: 'date' },
  { key: 'patient_id', type: 'string' },
  { key: 'isLast', type: 'string' },
  { key: 'syncStatus', type: 'string' },
  { key: 'patientVisitDetails', type: 'array' },
  { key: 'vitalSigns', type: 'object' },
  { key: 'tbScreening', type: 'object' },
  { key: 'pregnancyScreening', type: 'object' },
  { key: 'adherenceScreening', type: 'object' },
  { key: 'ramScreening', type: 'object' },
  { key: 'clinic', type: 'object' },
  { key: 'patient', type: 'object' }
]

const initDatabase = async () => {
    try {
        const MyDb = nSQL()
    MyDb.table('patients')
        .config({
          mode: getMode()
        })
        .model(personModel)
      MyDb.table('serviceIdentifier')
        .config({
          mode: getMode()
        })
        .model(patientServiceIdentfierModel)

        MyDb.table('episode')
        .config({
          mode: getMode()
        })
        .model(episodeModel)

         MyDb.table('patientVisit')
        .config({
          mode: getMode()
        })
        .model(patientVisitModel)
      await Promise.all([MyDb.connect()])
    } catch (error) {
      console.error(error)
    }
  }

  export { initDatabase }
