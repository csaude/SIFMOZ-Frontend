<template>
  <q-banner
    dense
    inline-actions
    :class="[bgColor, headerClass]"
    class="text-white q-pa-none">
      <span class="text-bold text-subtitle1 vertical-middle q-pl-md"><slot></slot></span>
      <template v-slot:action class="items-center">
          <q-select
            class="col q-my-md"
            dense outlined
            v-model="dispenseMode"
            :options="dispenseModes"
            option-value="id"
            option-label="description"
            label="Modo de dispensa" />
      </template>
  </q-banner>
</template>

<script>
import DispenseMode from 'src/store/models/dispenseMode/DispenseMode'
export default {
  data () {
    return {
      dispenseMode: []
    }
  },
   mounted () {
        this.doDispenseModeGetAll(0)
  },
  computed: {
    dispenseModes () {
          return DispenseMode.all()
    }
  },
  methods: {
    submitForm () {
      this.$emit('proccedToDispense', this.dispenseMode)
    },
    doDispenseModeGetAll (offset) {
         DispenseMode.api().get('/dispenseMode?offset=' + offset + '&max=100').then(resp => {
            offset = offset + 100
            if (resp.response.data.length > 0) {
              setTimeout(this.doDispenseModeGetAll(offset), 2)
            }
            }).catch(error => {
                console.log(error)
            })
    }
  }
}
</script>

<style>

</style>
