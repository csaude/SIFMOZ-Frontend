<template>
  <div>
    <ListHeader
      :addVisible="showAddButton"
      :mainContainer="true"
      bgColor="bg-primary"
      @showAdd="showAddPharmaceuticalAtention = true">
      Atenção Farmacêutica
    </ListHeader>
    <EmptyList >Nenhuma Atenção Farmacêutica Adicionada</EmptyList>
    <div v-show="infoVisible" >
    </div>
    <q-dialog persistent v-model="showAddPharmaceuticalAtention">
      <AddEditPharmaceuticalAtention
        @close="showAddPharmaceuticalAtention= false" />
  </q-dialog>
  </div>
</template>

<script>
export default {
  props: ['selectedPatient'],
  data () {
    return {
      showAddPharmAttention: false,
      infoVisible: false,
      showAddPharmaceuticalAtention: false
    }
  },
  methods: {
    expandLess (value) {
      this.infoVisible = value
    }
  },
  computed: {
    showAddButton () {
      return this.selectedPatient.identifiers.length > 0
    }
  },
  components: {
      ListHeader: require('components/Shared/ListHeader.vue').default,
      EmptyList: require('components/Shared/ListEmpty.vue').default,
      AddEditPharmaceuticalAtention: require('components/Patient/PharmaceuticalAtention/AddEditPharmaceuticalAtention.vue').default
  }
}
</script>

<style>

</style>
