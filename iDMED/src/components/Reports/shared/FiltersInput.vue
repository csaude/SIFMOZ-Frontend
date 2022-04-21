<template>
             <div class="row ">
                <q-select
                    dense outlined
                    class="col q-mr-md"
                    :options="provinces"
                    v-model="province"
                    ref="province"
                    option-value="id"
                    style="max-width: 170px"
                    option-label="description"
                    :rules="[ val => ( val != null ) || ' Por favor indique a província']"
                    lazy-rules
                    label="Província *" />

                     <q-select
                    class="col q-mr-md"
                    dense outlined
                    :options="districts"
                    v-model="district"
                    ref="district"
                    option-value="id"
                    option-label="description"
                    style="max-width: 150px"
                    :rules="[ val => ( val != null) || ' Por favor indique o Distrito']"
                    lazy-rules
                    label="Distrito *" />

                     <q-select
                    class="col q-mr-md"
                    dense outlined
                    :options="clinics"
                    v-model="clinic"
                    ref="clinic"
                    option-value="id"
                    option-label="clinicName"
                    style="max-width: 220px"
                    :rules="[ val => ( val != null) || ' Por favor indique a farmácia']"
                    lazy-rules
                    label="Farmácia *" />

                      <q-select
                    class="col q-mr-md"
                    dense outlined
                    :options="periodos"
                    v-model="periodo"
                   style="max-width: 140px"
                    @update:model-value="val => onPeriodoChange(val)"
                    ref="period"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null) || ' Por favor indique o período']"
                    lazy-rules
                    label="Período *" />

                        <SpecificPeriod v-if="periodo.id ===1"/>
                        <MonthlyPeriod v-model="month" v-else-if="periodo.id ===2" />
                        <QuarterlyPeriod v-else-if="periodo.id ===3" />
                        <SemesterPeriod v-else-if="periodo.id ===4" />
                        <AnnualPeriod v-else-if="periodo.id ===5" />

                        <div class="" >
                        <q-btn class="flat rounded"
                        color="grey"
                        size ="sm"
                        rounded
                        icon="chevron_right"
                        @click.stop="processReport(id,typeService)"
                            >
                            <q-tooltip class="bg-primary">processar o relatório</q-tooltip>
                            </q-btn>
                        </div>
                </div>
</template>

<script>
import Province from '../../../store/models/province/Province'
import District from '../../../store/models/district/District'
import Clinic from '../../../store/models/clinic/Clinic'

export default {
    props: ['typeService', 'menuSelected', 'id'],
    data () {
            return {
                province: null,
                district: null,
                clinic: null,
                periodo: '',
                periodos: [
                    { id: 1, description: 'Especifico' },
                    { id: 2, description: 'Mensal' },
                    { id: 3, description: 'Trimestral' },
                    { id: 4, description: 'Semestral' },
                    { id: 5, description: 'Anual' }]
            }
    },
    computed: {
          provinces () {
            return Province.query().with('districts').has('code').get()
        },
        districts () {
            if (this.province !== null) {
            console.log('Provincia', this.province)
            return District.query().with('clinics').where('province_id', this.province.id).get()
            } else {
                return null
            }
        },
         clinics () {
            if (this.district !== null) {
            console.log('district', this.district)
            return Clinic.query().with('districts').where('district_id', this.district.id).get()
            } else {
                return null
            }
        }
    },
    methods: {
    processReport (id, typeService) {
        console.log('Processando o report UUID', id)
        console.log('Tipo de Servico', typeService.code)
        console.log('Data inicio', this.startDate)
        console.log('Data fim', this.thruDate)
        console.log('Mes', this.month)
    },
    onPeriodoChange (val) {
         console.log('Valor seleccionado: ', val)
    }
    },
    components: {
       SpecificPeriod: require('components/Reports/shared/SpecificPeriod.vue').default,
       SemesterPeriod: require('components/Reports/shared/SemesterPeriod.vue').default,
       MonthlyPeriod: require('components/Reports/shared/MonthlyPeriod.vue').default,
       QuarterlyPeriod: require('components/Reports/shared/QuarterlyPeriod.vue').default,
       AnnualPeriod: require('components/Reports/shared/AnnualPeriod.vue').default
    }

}
</script>

<style>
    .fild-radius {
        border-radius: 5px;
    }
</style>
