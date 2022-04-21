<template>
<div ref="filterDrugStoreSection">
  <ListHeader
    :addVisible="false"
    :mainContainer="true"
    :closeVisible="true"
    @closeSection="closeSection"
    bgColor="bg-orange-5">Serviço {{selectedService !== null ? selectedService.code : ''}}: Activos na Farmácia
  </ListHeader>
  <div class="param-container">
    <q-item>
        <q-item-section  class="col-10" >
            <FiltersInput
              :id="id"
              :typeService="selectedService"
              class="q-mg-xs"
            />
        </q-item-section>

        <q-item-section top  class="col-2">
            <div class="row text-grey-8 ">

                  <div  class="col-8 " >
                         <q-linear-progress size="15px" :value="progress1" color="red">
                                <div class="absolute-full flex flex-center">
                                    <q-badge color="white" text-color="accent" :label="progressLabel1" />
                                </div>
                            </q-linear-progress>

                  </div>

                  <div class="col-4">
                             <div class="row ">
                              <q-btn class="gt-xs" flat dense  size="sm" icon="article" style="height:20px" >
                                <q-tooltip class="bg-primary">Baixar Excel</q-tooltip>
                                .Xls
                                </q-btn>
                          </div>
                          <div class="row  ">
                            <q-btn class="gt-xs" flat dense  size="sm"  @click.stop="getReport(id)" icon="article" title=".pdf" style="height:20px">
                              <q-tooltip class="bg-primary">Baixar Pdf</q-tooltip>
                              .Pdf
                              </q-btn>
                          </div>
                  </div>
            </div>
        </q-item-section>
    </q-item>
  </div>
  </div>
</template>

<script>

import Pack from 'src/store/models/packaging/Pack'
import { ref, computed } from 'vue'
  export default {
    setup () {
        const progress1 = ref(0.25)
        return {
        progress1,
        progressLabel1: computed(() => (progress1.value * 100).toFixed(2) + '%')
        }
    },
    props: ['selectedService', 'menuSelected', 'id'],
    name: 'DrugStore',
    mounted () {
      console.log(this.selectedService)
    },
    components: {
      ListHeader: require('components/Shared/ListHeader.vue').default,
      FiltersInput: require('components/Reports/shared/FiltersInput.vue').default
    },
    methods: {
      closeSection () {
        this.$refs.filterDrugStoreSection.remove()
      },
    getReport (id) {
      // UID da tab corrente
      console.log('UUID da tab seleccionada:', id)
          Pack.api().get('/report/',
          { responseType: 'blob' }).then(resp => {
            console.log(resp)
             console.log(resp.response.data)
              const file = new Blob([resp.response.data], { type: 'application/pdf' })
      const fileURL = URL.createObjectURL(file)
        const link = document.createElement('a')
        link.href = fileURL
         link.setAttribute('download', 'file.pdf')
        document.body.appendChild(link)
        link.click()
          })
      }
              //  const bytes = btoa(new Uint8Array(resp.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
             //  const url = 'data:application/pdf;base64, ' + bytes
        /*    const link = document.createElement('a')
             const downloadUrl = window.URL.createObjectURL(new Blob([resp.response.data]))
            link.href = downloadUrl
            link.setAttribute('download', 'file.pdf')
           document.body.appendChild(link)
            link.click()
            link.remove() */
        /*   axios({
              url: 'http://localhost:8884/report/',
            method: 'GET',
          responseType: 'blob' // important
             }).then((resp) => {
                const file = new Blob([resp.data], { type: 'application/pdf' })
      const fileURL = URL.createObjectURL(file)
        const link = document.createElement('a')
        link.href = fileURL
         link.setAttribute('download', 'file.pdf')
        document.body.appendChild(link)
        link.click()
             }) */
    //  }

    }
  }
</script>

<style lang="scss" scoped>
  .param-container {
    border-bottom: 1px dashed $grey-13;
    border-left: 1px dashed $grey-13;
    border-right: 1px dashed $grey-13;
    border-radius: 0px 0px 5px 5px;
  }
</style>
