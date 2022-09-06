
<template>
 <q-layout v-cloak >
    <q-page-container>
      <q-page class="flex flex-center">
       <div id="particles-js" :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"></div>
        <q-btn
          color="white"
          class="absolute-top-right"
          flat
          round
          @click="$q.dark.toggle()"
          :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
        />
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <q-card v-bind:style="this.$q.screen.lt.sm?{'width': '80%'}:{'width':'50%','height':'950px','border-radius': '50%'}">
            <q-card-section>
           <div class="col-auto text-grey text-caption q-pt-sm row no-wrap items-center justify-center">
            <q-avatar size="250px">
            <q-img src="~assets/LogoiDMED.png"/>
            </q-avatar>
            </div>
              <div class="row q-pa-sm text-center q-mt-md column">
                  <div style="font-family: 'line-awesome';font-size: 40px;" class="row text-center column q-pa-md text-gray text-subtitle1 ellipsis">Sistema Inteligente para Dispensa</div>
                  <div style="font-family: 'line-awesome';font-size: 40px;" class="row text-center column text-gray text-subtitle1 ellipsis"> de Medicamentos </div>
              </div>
            </q-card-section>
            <q-card-section align="center">
              <q-form class="q-gutter-md" @submit.prevent="authUser" v-if="configs !== null">
            <div class="q-pa-sm text-center justify-center" style="max-width: 50%">
            <div class="row q-mb-sm">
                <q-input
                    class="col"
                    ref="user"
                    v-model="username"
                    type="text"
                    :rules="[ val => val.length >= 3 || 'O nome do utilizador deve ter um minimo de 4 caracteres']"
                    lazy-rules
                    label="Utilizador" >
                    <template v-slot:append>
                        <q-icon name="person"  color="primary"/>
                    </template>
                </q-input>
            </div>
            <div class="row q-mb-sm">
                <q-input
                    v-model="password"
                    class="col"
                    label="Senha"
                    :rules="[ val => val.length >= 4 || 'A senha deve ter um minimo de 4 caracteres']"
                    ref="password"
                    :type="isPwd ? 'password' : 'text'">
                    <template v-slot:append>
                        <q-icon
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwd = !isPwd"
                            color="primary"
                        />
                    </template>
                </q-input>
            </div>
            <div class="row">
                <q-btn
                    :loading="submitting"
                    class="full-width q-py-sm"
                    unelevated rounded
                    color="primary"
                    type="submit"
                    label="Entrar" />
            </div>
            </div>
              </q-form>
                         <q-form class="q-gutter-md" @submit.prevent="doSave" v-if="configs === null">
            <div class="q-pa-sm text-center justify-center" style="max-width: 50%">
            <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-radio v-model="instalation_type" val="PROVINCIAL" label="Provincial" />
      <q-radio v-model="instalation_type" val="LOCAL" label="Local" />
    </div>
            </div>
            <div class="row q-mb-sm">
                         <q-select
                    dense outlined
                    class="col"
                    v-model="province"
                    :options="provinces"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    ref="province"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null ) || ' Por favor indique a província']"
                    lazy-rules
                    label="Província *" />
            </div>
            <div class="row q-mb-sm" v-if= "instalation_type === 'LOCAL'">
                  <q-select
                    class="col"
                    dense outlined
                     transition-show="flip-up"
                    transition-hide="flip-down"
                    v-model="district"
                    :options="districts"
                    ref="district"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null) || ' Por favor indique o Distrito']"
                    lazy-rules
                    label="Distrito" />
            </div>
             <div class="row q-mb-sm" v-if= "instalation_type === 'LOCAL'">
                <q-select
                    dense outlined
                    class="col"
                    v-model="clinic"
                    :options="clinics"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    ref="clinic"
                    option-value="id"
                    option-label="clinicName"
                    :rules="[ val => ( val != null ) || ' Por favor indique a clinica']"
                    lazy-rules
                    label="Clinica" />
            </div>
            <div class="row">
                <q-btn
                    :loading="submitting"
                    class="full-width q-py-sm"
                    unelevated rounded
                    color="primary"
                    type="submit"
                    label="Proximo" />
            </div>
            </div>
              </q-form>
            </q-card-section>
            <q-card-section align="center">
              <div class="row justify-center q-pt-xl q-py-xl q-gutter-xl">
              <div class="justify-left q-pt-md q-py-md">
                <q-avatar round size="130px" style="opacity: 40%">
                  <q-img src="~assets/MoHLogo.png"/>
                </q-avatar>
              </div>
               <div class="q-pb-md">
                <q-avatar square size="190px" style="opacity: 40%">
                  <q-img src="~assets/pepfar-new-logo.jpeg"/>
                </q-avatar>
              </div>
              </div>
            </q-card-section>
          </q-card>
        </transition>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { QSpinnerBall, useQuasar } from 'quasar'
import Province from '../../store/models/province/Province'
import District from '../../store/models/district/District'
import Clinic from 'src/store/models/clinic/Clinic'
import { ref } from 'vue'
import SystemConfigs from 'src/store/models/systemConfigs/SystemConfigs'
import UsersService from '../../services/UsersService'
export default ({
  data () {
     const $q = useQuasar()
    return {
       instalation_type: ref(null),
        province: null,
      district: null,
      clinic: null,
      systemConfigs: new SystemConfigs(),
      instalationConfig: null,
      context: 'login context',
      $q,
      username: '',
      password: '',
      isPwd: true,
      submitting: false,
      data: {
        rememberMe: false,
        fetchUser: true
      },
      error: null,
      initialDistrict: 0,
      users: [
        {
          utilizador: 'IDMED.FHI',
          senha: 'Fhi761'
        },
        {
          utilizador: 'IDMED.EPIC',
          senha: 'Epic007'
        },
        {
          utilizador: 'IDMED.I-TECH',
          senha: 'I-tech881'
        },
        {
          utilizador: 'IDMED.ICAP',
          senha: 'Icap123'
        },
        {
          utilizador: 'IDMED.CCS',
          senha: 'Ccs452'
        },
        {
          utilizador: 'IDMED.ARIEL',
          senha: 'Ariel872'
        },
        {
          utilizador: 'IDMED.ECHO',
          senha: 'Echo827'
        },
        {
          utilizador: 'IDMED.EGPAF',
          senha: 'Egpaf897'
        },
        {
          utilizador: 'IDMED.JHPIEGO',
          senha: 'Jhpiego562'
        },
        {
          utilizador: 'IDMED.FGH',
          senha: 'Fgh542'
        },
        {
          utilizador: 'IDMED.USAID',
          senha: 'Usaid098'
        },
        {
          utilizador: 'IDMED.CDC',
          senha: 'Cdc622'
        },
        {
          utilizador: 'IDMED.CMAM',
          senha: 'Cmam252'
        },
        {
          utilizador: 'IDMED.PHIV',
          senha: 'Phiv545'
        },
        {
          utilizador: 'iDMED',
          senha: 'iDMED123'
        },
        {
          utilizador: 'IDMED.JEMBI',
          senha: 'Jembi123'
        },
        {
          utilizador: 'domingos.bernardo',
          senha: 'dBernardo1'
        }
      ]
    }
  },
  created () {
    this.$q.loading.show({
      message: 'Carregando ...',
      spinnerColor: 'grey-4',
      spinner: QSpinnerBall
      // delay: 400 // ms
    })
 this.loadProvinceAndDistrict()
    setTimeout(() => {
      this.$q.loading.hide()
    }, 600)
  },
   mounted () {
},
  computed: {
     provinces () {
            return Province.query().with('districts').has('code').get()
        },
        districts () {
        if (this.province !== null) {
            return District.query().with('province').where('province_id', this.province.id).get()
        } else {
            return null
        }
  },
   clinics () {
        if (this.district !== null) {
           return this.getClinicsByDistrictId()
        } else {
            return null
        }
  },
      configs () {
       return SystemConfigs.query().where('key', 'INSTALATION_TYPE').first()
      }
  },
  methods: {
      loadProvinceAndDistrict () {
         const offset = 0
        const max = 100
         SystemConfigs.apiGetAll()
        Province.apiGetAll(offset, max)
        District.apiGetAll(offset, max)
        // Clinic.apiGetAll(offset, max)
    },
      async getAllClinicsByDistrictId (districtId) {
           await Clinic.api().get('/clinic/district/' + districtId).then(resp => {
            }).catch(error => {
                console.log(error)
            })
      },
       getClinicsByDistrictId () {
        if (this.initialDistrict !== this.district.id) {
               this.$q.loading.show({
          spinner: QSpinnerBall,
          message: 'Carregando Unidades Sanitarias. Por favor, aguarde...'
        })
         this.initialDistrict = this.district.id
              this.getAllClinicsByDistrictId(this.district.id).then(resp => {
                this.clinic = null
                  this.$q.loading.hide()
              })
        }
              return Clinic.query().with('province').with('district')
                   .with('district.province').where('district_id', this.district.id).get()
        },
    processForm: function () {
      console.log({ username: this.username, password: this.password })
      this.submitting = true
      setTimeout(() => {
        this.submitting = false
      }, 500)
      localStorage.setItem('user', 'admin')
      localStorage.setItem('hisUser', this.username)
      localStorage.setItem('hisPass', this.password)

      if (this.users.filter(user => user.utilizador === this.username && user.senha === this.password).length > 0) {
        this.$router.push({ path: '/' })
      } else {
         this.$q.notify({
            icon: 'announcement',
            message: 'Utilizador ou Senha inválida',
            type: 'negative',
            progress: true,
            timeout: 3000,
            position: 'top',
            color: 'negative',
            textColor: 'white',
            classes: 'glossy'
         })
      }
    },
     async doSave () {
       this.systemConfigs.value = this.instalation_type
       this.systemConfigs.key = 'INSTALATION_TYPE'
       this.systemConfigs.description = this.instalation_type === 'LOCAL' ? this.clinic.uuid : this.province.code
        await SystemConfigs.apiSave(this.systemConfigs).then(resp => {
         /// this.$router.push({ path: '/Login' })
           }).catch(error => {
            this.listErrors = []
          if (error.request.status !== 0) {
            const arrayErrors = JSON.parse(error.request.response)
            if (arrayErrors.total == null) {
              this.listErrors.push(arrayErrors.message)
            } else {
              arrayErrors._embedded.errors.forEach(element => {
                this.listErrors.push(element.message)
              })
            }
          }
          })
      },
       authUser () {
            console.log({ username: this.username, password: this.password })
            this.$refs.user.validate()
            this.$refs.password.validate()
            if (!this.$refs.user.hasError && !this.$refs.password.hasError) {
                this.submitting = true
                UsersService.login({
                    username: this.username,
                    password: this.password
                }).then((response) => {
                    this.submitting = false
                        console.log('Login >>>>>>>>', response)
                        localStorage.setItem('id_token', response.response.data.access_token)
                        localStorage.setItem('refresh_token', response.response.data.refresh_token)
                        localStorage.setItem('username', response.response.data.username)
                        localStorage.setItem('user', this.username)
                        localStorage.setItem('hisUser', this.username)
                       localStorage.setItem('hisPass', this.password)
                        localStorage.setItem('role_menus', response.response.data.menus)
                        this.$router.push({ path: '/' })
                }).catch(error => {
                    console.log(error)
                    this.submitting = false
                    if (error.request.response != null) {
                        const arrayErrors = JSON.parse(error.request.response)
                        if (arrayErrors.total == null) {
                        this.listErrors.push(arrayErrors.message)
                        } else {
                        arrayErrors._embedded.errors.forEach(element => {
                            this.listErrors.push(element.message)
                        })
                        }
                        console.log(this.listErrors)
                    }
                })
            }
        }
  }
})
</script>

<style>
.bg-image {
  background-repeat: no-repeat;
  background-size: cover;
}

[v-cloak] {
  display: none !important;
}
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}
.normal_gradient {
  background: linear-gradient(145deg, #00AFDB 30%, #00BEA4 70%);
}
.dark_gradient {
  background: linear-gradient(145deg, #014758 15%, #014b41 70%);
}
.login-form {
  position: absolute;
}
</style>
