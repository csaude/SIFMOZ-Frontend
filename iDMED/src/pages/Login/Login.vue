
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
              <q-form class="q-gutter-md" @submit.prevent="processForm">
            <div class="q-pa-sm text-center justify-center" style="max-width: 50%">
            <div class="row q-mb-sm">
                <q-input
                    class="col"
                    ref="user"
                    v-model="username"
                    type="text"
                    :rules="[ val => val.length >= 4 || 'O nome do utilizador deve ter um minimo de 4 caracteres']"
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

export default ({
  data () {
     const $q = useQuasar()
    return {
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

    setTimeout(() => {
      this.$q.loading.hide()
    }, 600)
  },
   mounted () {
},
  computed: {
  },
  methods: {
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

      // UsersService.login({
      //   'username': this.username,
      //   'password': this.password
      // }).then((response) => {
      //     if (response.response.data) {
      //       console.log('Login >>>>>>>>', response.response.data)//.access_token);
      //       localStorage.setItem('id_token', response.response.data.access_token)
      //       localStorage.setItem('refresh_token', response.response.data.refresh_token)

      //       if (response.response.data.roles[0] === 'ROLE_ADMIN') {
      //         this.$router.push({path: '/'})
      //         // this.$router.push({path: 'Admin'})
      //       } else if (response.response.data.roles[0] === 'ROLE_DRIVER') {
      //         this.$router.push({name: 'Garage'})
      //       } else {
      //         this.$router.push({name: '/'})
      //       }
      //     }
      //   })
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
