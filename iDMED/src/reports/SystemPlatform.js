export default {
    isWebsite () {
        if (typeof cordova === 'undefined') {
            return true
        } else {
            return false
        }
    }
}
