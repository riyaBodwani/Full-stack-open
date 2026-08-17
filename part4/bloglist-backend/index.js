const mongoose = require('mongoose')
const config = require('./utils/config')
const app = require('./app')

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})