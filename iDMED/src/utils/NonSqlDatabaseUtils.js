
import { nSQL } from 'nano-sql'
import { getMode } from 'cordova-plugin-nano-sqlite/lib/sqlite-adapter'

export default {
    createModel (fields) {
    const listaFields = []
    for (var key in fields) {
      let dataType = 'date'
          const valor = Object.getPrototypeOf(fields[key]).constructor.name
          switch (valor) {
            case 'BelongsTo': dataType = 'object'; break
            case 'HasMany': dataType = 'list'; break
            case 'Attr': dataType = 'string'; break
            default: dataType = 'string'; break
          }
          let obj = {}
          if (key === 'id') {
             obj = { key: key, type: 'uuid', props: ['pk'] }
         } else {
             obj = { key: key, type: dataType }
        }
        listaFields.push(obj)
    }
    return listaFields
  },
 async initDatabase (entityList) {
    try {
        const MyDb = nSQL()
        for (let i = 0; i < entityList.length; i++) {
          const model = this.createModel(entityList[i].fields())
          MyDb.table(entityList[i].entity)
          .config({
            mode: getMode()
          })
          .model(model)
        }
      await Promise.all([MyDb.connect()])
    } catch (error) {
      console.error(error)
    }
  }
}
