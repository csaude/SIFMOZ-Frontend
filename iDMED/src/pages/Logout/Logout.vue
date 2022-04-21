<template>
  <div>Logout</div>
</template>
<script>

export default {
  data () {
    return {}
  },
  created: function () {
  //  UsersService.logout()
  //  localStorage.setItem('id_token', null)
   localStorage.setItem('user', null)
  this.$router.push({ path: '/Login' })
  }
}
</script>
