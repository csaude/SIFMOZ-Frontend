
export default {
    menusVisible (name) {
        const menus = localStorage.getItem('role_menus')
        if (!menus.includes(name)) {
          return false
        } else {
          return true
        }
      }
}
