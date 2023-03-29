import { LocalStorage } from 'quasar'
import mixinplatform from '../mixins/mixin-system-platform'

export default {
    mixins: [mixinplatform],
    data () {
      return {
        isOnline: typeof cordova !== 'undefined' ? true : LocalStorage.getItem('clinic_sectors').includes('NORMAL') // this.$q.platform.is.mobile,
      }
   }
  }
