export default {
  data () {
    return {
      mobile: typeof cordova === 'undefined', // this.$q.platform.is.mobile,
      website: typeof cordova !== 'undefined'
    }
 }
}
