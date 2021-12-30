<template>
  <div>
    <TitleBar>Detalhes do Inventário</TitleBar>
    <div class="row">
      <div class="col-3 q-pa-md q-pl-lg q-ml-lg q-mr-lg">
        <div>
          <ListHeader
            :addVisible="false"
            :mainContainer="true"
            bgColor="bg-primary">Notas do Inventário
          </ListHeader>
          <div class="box-border q-pt-md">
            <TextInput
              v-model="inventoryType"
              label="Tipo de Inventário"
              disable
              dense
              class="col q-ma-sm" />
            <q-input
                dense
                outlined
                disable
                class="col q-ma-sm"
                v-model="currInventory.startDate"
                mask="date"
                ref="dateReceived"
                :rules="['date']"
                label="Data de Abertura">
                <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="currInventory.startDate" >
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                        </q-date>
                    </q-popup-proxy>
                    </q-icon>
                </template>
            </q-input>
            <q-separator class="q-mx-sm"/>
            <div class="row q-pa-sm">
              <q-btn unelevated color="blue" class="col" label="Voltar" />
              <q-space />
              <q-btn
                unelevated
                color="red"
                class="q-ml-md col"
                @click="initInventoryClosure()"
                label="Fechar" />
            </div>
          </div>
        </div>
      </div>
      <div class="col q-pt-md q-mr-lg">
          <span
            v-for="drug in drugs" :key="drug.id" >
            <AdjustmentTable
              :drug="drug"
              :inventory="currInventory" />
          </span>
      </div>
    </div>
    <q-dialog v-model="alert.visible" persistent>
      <Dialog :type="alert.type" @closeDialog="closeDialog" @commitOperation="closeInventory">
        <template v-slot:title> {{dialogTitle}}</template>
        <template v-slot:msg> {{alert.msg}} </template>
      </Dialog>
    </q-dialog>
  </div>
</template>

<script>
import Drug from '../../../store/models/drug/Drug'
import { ref } from 'vue'
import { date, SessionStorage } from 'quasar'
import Inventory from '../../../store/models/stockinventory/Inventory'
import Clinic from '../../../store/models/clinic/Clinic'

export default {
  data () {
    return {
      alert: ref({
        type: '',
        visible: false,
        msg: ''
      }),
      dialogTitle: 'Informação',
      adjustments: ref([]),
      step: 'display'
    }
  },
  methods: {
    initInventoryClosure () {
      this.dialogTitle = 'Confirmação do fecho do inventário.'
      this.displayAlert('confirmation', 'Nota: Ao encerrar o presente inventário o stock será actualizado para os dados informados e está operação não poderá ser desfeita. Continuar?')
    },
    closeInventory () {
      console.log('close invenctory')
      Inventory.apiClose(this.currInventory.id).then(resp => {
        this.step = 'display'
        this.fecthInventory()
      })
    },
    fecthInventory () {
      Inventory.apiFetchById(this.currInventory.id)
    },
    formatDate (dateString) {
      return date.formatDate(dateString, 'YYYY-MM-DD')
    },
    getDrugs () {
      if (this.currInventory.generic) {
        return Drug.query()
                   .with('stocks.*')
                   .with('form')
                   .where('active', true)
                   .get()
      } else {
        return this.currInventory.drugs
      }
    },
    displayAlert (type, msg) {
      this.alert.type = type
      this.alert.msg = msg
      this.alert.visible = true
    },
    closeDialog () {
      this.alert.visible = false
    },
    retriveRelatedDrug (adjustment, drugList) {
      let isNewDrug = true
      const drug = Drug.query()
                      .with('stocks')
                      .with('form')
                      .where('id', adjustment.adjustedStock.drug_id)
                      .first()
      if (drugList.length <= 0) {
        drugList.push(drug)
      } else {
        Object.keys(drugList).forEach(function (i) {
          if (drugList[i].id === drug.id) {
            isNewDrug = false
          }
        })
        if (isNewDrug) drugList.push(drug)
      }
    }
  },
  computed: {
    expireDate: {

    },
    isDisplayStep () {
      return this.step === 'display'
    },
    isEditionStep () {
      return this.step === 'edit'
    },
    isCreationStep () {
      return this.step === 'create'
    },
    isDeletionStep () {
      return this.step === 'delete'
    },
    enableFields () {
      return this.isEditionStep || this.isCreationStep
    },
    currInventory () {
      const e = new Inventory(SessionStorage.getItem('currInventory'))
      return Inventory.query()
                          .with('clinic.province')
                          .with('adjustments.adjustedStock')
                          .where('id', e.id)
                          .first()
    },
    drugs () {
      if (this.currInventory.generic) {
        return Drug.query()
                   .with('stocks')
                   .with('form')
                   .where('active', true)
                   .get()
      } else {
        const drugList = []
        Object.keys(this.currInventory.adjustments).forEach(function (i) {
          this.retriveRelatedDrug(this.currInventory.adjustments[i], drugList)
        }.bind(this))
        return drugList
      }
    },
    inventoryType () {
      return this.currInventory.getInventoryType()
    },
    currClinic () {
      return Clinic.query()
                  .with('province')
                  .where('id', SessionStorage.getItem('currClinic').id)
                  .first()
    }
  },
  components: {
    Dialog: require('components/Shared/Dialog/Dialog.vue').default,
    TitleBar: require('components/Shared/TitleBar.vue').default,
    ListHeader: require('components/Shared/ListHeader.vue').default,
    TextInput: require('components/Shared/Input/TextField.vue').default,
    AdjustmentTable: require('components/Stock/Inventory/InventoryAdjustmentsContainer.vue').default
  }
}
</script>

<style lang="scss">
  .box-border {
    border: 1px solid $grey-4
  }
</style>
