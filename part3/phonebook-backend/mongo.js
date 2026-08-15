const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://riyabodwani02_db_user:${password}@phonebook.rfr6nw1.mongodb.net/?appName=PhoneBook`
mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
  console.log('Password is required')
  process.exit(1)
}

mongoose
  .connect(url)
  .then(() => {
    if (process.argv.length === 3) {
      return Person.find({})
    }

    if (process.argv.length === 5) {
      const person = new Person({
        name: name,
        number: number
      })

      return person.save()
    }

    console.log('Invalid number of arguments')
    mongoose.connection.close()
    return null
  })
  .then(result => {
    if (!result) {
      return
    }

    if (Array.isArray(result)) {
      console.log('phonebook:')

      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
    } else {
      console.log(
        `added ${result.name} number ${result.number} to phonebook`
      )
    }

    mongoose.connection.close()
  })
  .catch(error => {
    console.log(error)
    mongoose.connection.close()
  })