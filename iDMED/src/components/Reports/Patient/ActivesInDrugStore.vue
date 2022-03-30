<template>
<div>
  <ListHeader
    :addVisible="false"
    :mainContainer="true"
    bgColor="bg-orange-5">Serviço {{selectedService !== null ? selectedService.code : ''}}: Activos na Farmácia
  </ListHeader>
  <div class="row param-container">
    <q-item>
        <q-item-section avatar top>
            <q-btn class="gt-xs" size="12px" flat dense round icon="close" />
        </q-item-section>
        <q-item-section >
        Activos na farmacia
        </q-item-section>

        <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
            <q-btn class="gt-xs" size="12px" flat dense round  >Excel</q-btn> |
            <q-btn class="gt-xs" size="12px" flat dense round >Pdf</q-btn>

            </div>
        </q-item-section>
    </q-item>
  </div>
  </div>
</template>

<script>
  export default {
    props: ['selectedService'],
    name: 'DrugStore',
    mounted () {
      console.log(this.selectedService)
    },
    components: {
      ListHeader: require('components/Shared/ListHeader.vue').default
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
