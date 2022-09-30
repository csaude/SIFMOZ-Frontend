import CryptoJS from 'crypto-js'
export default {
  data () {
    return {
      passKey: 'a6489554-f07d-404d-8dd6-b6ea9c307b28'
    }
  },
  methods: {
   encrypt (obj) {
    Object.keys(obj).forEach(key => {
      if (key === 'value' || key === 'name' || key === 'description' || key === 'code') {
        obj[key] = CryptoJS.AES.encrypt(JSON.stringify(obj[key]), this.passKey).toString()
      }
    })
    return obj
   },
   decrypt (obj) {
    Object.keys(obj).forEach(key => {
      if (key === 'value' || key === 'name' || key === 'description' || key === 'code') {
        obj[key] = CryptoJS.AES.decrypt(JSON.stringify(obj[key]), this.passKey).toString()
      }
    })
    return obj
   }
  }
}
