import { LocalStorage } from 'quasar'

export default {
 methods: {},
  computed: {
    isAppSyncDone () {
      return LocalStorage.getItem('system-sync-status') === 'done'
    }
  }
}
