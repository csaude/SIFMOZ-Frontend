<template>
   <q-banner
    dense
    inline-actions
    :class="[bgColor, headerClass]"
    class="text-white q-pa-none">
        <span class="text-bold text-subtitle1 vertical-middle q-pl-md"><slot></slot></span>
        <template v-slot:action>
          <q-btn dense flat round color="white" icon="expand_less" class="float-right" @click="$emit('expandLess')"/>
          <q-btn dense v-if="addVisible" flat round color="white" icon="add" class="float-right" @click="$emit('showAdd')"/>
        </template>
    </q-banner>
</template>

<script>
export default {
    props: ['addVisible', 'bgColor', 'mainContainer'],
    setup () {
      return {
        headerClass: ''
      }
    },
    methods: {
      determineHeaderClass () {
        if (this.mainContainer) {
          this.headerClass = 'list-header'
        } else {
          this.headerClass = ''
        }
      }
    },
    created () {
      this.determineHeaderClass()
    }
}
</script>

<style>
    .list-header {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }
</style>
