const EventEmitter = require('events')
const chalk = require('chalk')
const Auth = new EventEmitter()
process.log.users = {}

Auth.on('unauthorized', ({ _id, email, source }) => {
  if (!process.log.users[_id]) {
    process.log.users[_id] = {
      email,
      source,
      count: 1
    }

    return console.log(chalk.black.bgGreenBright('  NEW  '), process.log.users[_id])
  }

  process.log.users[_id].count++
  if (process.log.users[_id].count > 4) {
    if (process.log.users[_id].count === 5)
      setTimeout(
        () => delete process.log.users[_id],
        300000
      );

    Auth.emit('ParahNih', email)
  }

  console.log(chalk.black.bgRedBright(' FINAL '), process.log.users[_id])
})

Auth.on('ParahNih', email => {
  console.log(`Sending email to ${email}`)
})

module.exports = Auth
