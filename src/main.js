import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import BaseComponents from './components/base'
import router from './router'

const app = createApp(App)

app.use(BaseComponents)
app.use(router)     
app.mount('#app')  
