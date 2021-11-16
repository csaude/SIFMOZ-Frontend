<template>
  <div>
      <q-card style="width: 500px;">
        <q-card-section>
          <div class="row">
            <q-icon :name="iconName" size="md" :color="color"></q-icon>
            <div class="text-h6 q-ml-sm" :class="titleColor"><slot name="title"></slot></div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none q-mt-md q-ml-sm">
          <slot name="msg"></slot>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat
            label="Cancelar"
            v-if="isConfirmationDialog"
            color="primary"
            v-close-popup
            class="q-mr-sm"
            @click="$emit('closeDialog')"/>

          <q-btn flat
            label="Continuar"
            v-if="isConfirmationDialog"
            color="primary"
            v-close-popup
            class="q-mr-sm"
            @click="$emit('commitOperation')"/>

          <q-btn flat
            label="OK"
            v-if="!isConfirmationDialog"
            color="primary"
            v-close-popup
            class="q-mr-sm"
            @click="$emit('closeDialog')"/>
        </q-card-actions>
      </q-card>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  props: ['type'],
  data () {
    return {
      alert: ref(false)
    }
  },
  computed: {
    iconName () {
      if (this.type === 'error') return 'report'
      if (this.type === 'warning' || this.type === 'confirmation') return 'warning'
      return 'info'
    },
    color () {
      if (this.type === 'error') return 'red'
      if (this.type === 'warning' || this.type === 'confirmation') return 'warning'
      return 'primary'
    },
    titleColor () {
      if (this.type === 'error') return 'text-red'
      if (this.type === 'warning' || this.type === 'confirmation') return 'text-warning'
      return 'text-primary'
    },
    isConfirmationDialog () {
      return this.type === 'confirmation'
    }
  }
}
</script>

<style>

</style>
