<template>
<div>
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
</template>

<script>
    export default {
        name: 'DrugStore'
 }
</script>
