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
        <q-item-section >
        Activos na farmacia
        </q-item-section>

        <q-item-section top side>
            <div class="row text-grey-8 q-gutter-xs">
            <q-btn class="gt-xs" flat dense rounded  >Excel</q-btn>
            <q-separator vertical />
            <q-btn class="gt-xs" flat dense rounded >Pdf</q-btn>

            </div>
        </q-item-section>
    </q-item>
  </div>
  </div>
</template>

<script>
  export default {
    props: ['selectedService', 'menuSelected'],
    name: 'DrugStore',
    mounted () {
      console.log(this.selectedService)
    },
    components: {
      ListHeader: require('components/Shared/ListHeader.vue').default
    },
    methods: {
      closeSection () {
        this.$refs.filterDrugStoreSection.remove()
      }

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
