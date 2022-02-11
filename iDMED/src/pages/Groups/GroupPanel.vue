<template>
  <div>
    <TitleBar>Detalhe do Grupo</TitleBar>
    <div class="row q-mt-md">
      <div class="col-3 q-pa-md q-pl-lg q-ml-lg q-mr-lg panel">
        <groupInfo @editGroup="editGroup"/>
      </div>
      <div class="col q-mr-lg">
        <q-scroll-area
          :thumb-style="thumbStyle"
          :content-style="contentStyle"
          :content-active-style="contentActiveStyle"
          style="height: 700px;"
          class="q-pr-md"
        >
          <span v-if="fecthedEpisodes >= group.members.length">
            <group-members @addNewMember="addNewMember"/>
            <groupPacks @newPacking="newPacking" />
          </span>
        </q-scroll-area>
      </div>
    </div>
      <q-dialog persistent v-model="showRegisterRegister">
        <groupRegister
          :step="groupAddEditStep"
          @close="showRegisterRegister = false" />
      </q-dialog>
      <q-dialog persistent v-model="showNewPackingForm" full-width>
        <groupPack
          :group="group"
          @close="showNewPackingForm = false" />
      </q-dialog>
  </div>
</template>

<script>
import { SessionStorage } from 'quasar'
import Group from '../../store/models/group/Group'
import Patient from '../../store/models/patient/Patient'
import Episode from '../../store/models/episode/Episode'
import DispenseMode from '../../store/models/dispenseMode/DispenseMode'
export default {
  data () {
    return {
      contentStyle: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        color: '#555'
      },

      contentActiveStyle: {
        backgroundColor: '#eee',
        color: 'black'
      },

      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#0ba58b',
        width: '5px',
        opacity: 0.75
      },
      fecthedEpisodes: 0,
      showRegisterRegister: false,
      groupAddEditStep: '',
      showNewPackingForm: false
    }
  },
  methods: {
    fecthMembersData () {
      DispenseMode.apiGetAll()
      this.group.members.forEach((member) => {
        member.patient = Patient.query().with(['identifiers.identifierType', 'identifiers.service.identifierType'])
                                .with('province')
                                .with('clinic').where('id', member.patient.id).first()
        member.patient.identifiers = member.patient.identifiers.filter((identifier) => {
          return identifier.service.id === this.group.service.id
        })
        Episode.apiGetAllByIdentifierId(member.patient.identifiers[0].id).then(resp => {
          this.fecthedEpisodes = this.fecthedEpisodes + 1
        })
      })
    },
    addNewMember () {
      this.groupAddEditStep = 'addMember'
      this.showRegisterRegister = true
    },
    editGroup () {
      this.groupAddEditStep = 'edit'
      this.showRegisterRegister = true
    },
    newPacking () {
      this.showNewPackingForm = true
    }
  },
  mounted () {
    this.fecthMembersData()
  },
  computed: {
    group: {
      get () {
        return Group.query()
                    .with('service')
                    .with('members.patient.identifiers.identifierType')
                    .with('groupType')
                    .where('id', SessionStorage.getItem('selectedGroup').id)
                    .first()
      }
    }
  },
  components: {
    TitleBar: require('components/Shared/TitleBar.vue').default,
    groupInfo: require('components/Groups/Panel/GroupInfo.vue').default,
    groupRegister: require('components/Groups/AddEditGroup.vue').default,
    groupPack: require('components/Groups/GroupDispense.vue').default,
    groupMembers: require('components/Groups/Panel/GroupMembers.vue').default,
    groupPacks: require('components/Groups/Panel/GroupDispenses.vue').default
  }
}
</script>

<style lang="scss">
  .panel {
    border: 1px solid $grey-13;
    border-radius: 10px
  }
</style>
