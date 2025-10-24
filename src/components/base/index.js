import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
// import BaseCard from './BaseCard.vue'
// import BaseDialog from './BaseDialog.vue'
// import BaseForm from './BaseForm.vue'
import BaseSearch from './BaseSearch.vue'
// import BaseSelect from './BaseSelect.vue'
// import BaseTable from './BaseTable.vue'
// import BasePagination from './BasePagination.vue'
// import BaseTag from './BaseTag.vue'
// import BaseLoading from './BaseLoading.vue'

export default {
  install(app) {
    app.component('BaseButton', BaseButton)
    app.component('BaseInput', BaseInput)
    // app.component('BaseCard', BaseCard)
    // app.component('BaseDialog', BaseDialog)
    // app.component('BaseForm', BaseForm)
    app.component('BaseSearch', BaseSearch)
    // app.component('BaseSelect', BaseSelect)
    // app.component('BaseTable', BaseTable)
    // app.component('BasePagination', BasePagination)
    // app.component('BaseTag', BaseTag)
    // app.component('BaseLoading', BaseLoading)
  }
}
