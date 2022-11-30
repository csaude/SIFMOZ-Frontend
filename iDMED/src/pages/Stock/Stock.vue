<template>
<div>
  <Index />
</div>
</template>

<script>
import { QSpinnerBall, SessionStorage } from 'quasar'
import Clinic from '../../store/models/clinic/Clinic'
import StockEntrance from '../../store/models/stockentrance/StockEntrance'
import StockCenter from '../../store/models/stockcenter/StockCenter'
import Stock from '../../store/models/stock/Stock'
 import { InventoryStockAdjustment } from '../../store/models/stockadjustment/InventoryStockAdjustment'
import StockOperationType from '../../store/models/stockoperation/StockOperationType'
import ReferedStockMoviment from '../../store/models/stockrefered/ReferedStockMoviment'
import DestroyedStock from '../../store/models/stockdestruction/DestroyedStock'
import Province from '../../store/models/province/Province'
import Drug from '../../store/models/drug/Drug'
import mixinplatform from 'src/mixins/mixin-system-platform'
import Inventory from '../../store/models/stockinventory/Inventory'
import db from 'src/store/localbase'
export default {
  mixins: [mixinplatform],
  components: {
    Index: require('components/Stock/Index.vue').default
  },
  methods: {
    init () {
         const offset = 0
        const max = 300
          StockCenter.apiGetAll(offset, max)
          Stock.apiGetAll(offset, max)
          StockOperationType.apiGetAll(offset, max)
          ReferedStockMoviment.apiGetAll(offset, max)
          DestroyedStock.apiGetAll(offset, max)
          Drug.apiGetAll(offset, max)
          Province.apiGetAll(offset, max)
          this.getAllStockOfClinic()
          InventoryStockAdjustment.apiGetAll(offset, max)

   // copoia o stock do localbase para o VueX
     if (this.website) {
        db.newDb().collection('stocks').get().then(stock => {
                    Stock.insert(
                      {
                        data: stock
                      })
                      })
        db.newDb().collection('stockOperationTypes').get().then(stockOperationType => {
                    StockOperationType.insert(
                      {
                        data: stockOperationType
                      })
                      })
        db.newDb().collection('inventorys').get().then(inventory => {
                          Inventory.insert(
                            {
                              data: inventory
                            })
                            })
        db.newDb().collection('stockEntrances').get().then(stockEntrance => {
        StockEntrance.insert(
          {
            data: stockEntrance
          })
          }).then(item => {
              console.log('SessionClinic: ', SessionStorage.getItem('currClinic'))
              Clinic.insert({
              data: SessionStorage.getItem('currClinic')
            })
          })
      }
    },
   getAllStockOfClinic () {
      const offset = 0
      const max = 100
      this.doStockEntranceGet(this.clinic.id, offset, max)
    },
    doStockEntranceGet (clinicId, offset, max) {
      StockEntrance.apiGetAllByClinicId(clinicId, offset, max).then(resp => {
        console.log(resp.response.data)
            if (resp.response.data.length > 0) {
              offset = offset + max
              setTimeout(this.doStockEntranceGet(clinicId, offset, max), 2)
            }
        }).catch(error => {
            console.log(error)
        })
    }
  },
  mounted () {
    this.init()
  },
  created () {
    this.$q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall
    // delay: 400 // ms
  })

  setTimeout(() => {
    this.$q.loading.hide()
  }, 600)
  },
  computed: {
    clinic: {
      get () {
        return new Clinic(SessionStorage.getItem('currClinic'))
      }
    }
  }

}
</script>

<style>

</style>
