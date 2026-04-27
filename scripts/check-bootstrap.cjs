const { Client } = require('pg')
;(async () => {
  const c = new Client(process.env.DATABASE_URL)
  await c.connect()
  const users = await c.query('SELECT id, email, role FROM users ORDER BY id')
  console.log('USERS:', users.rows)
  const clubs = await c.query('SELECT id, name, domain, lifecycle FROM clubs ORDER BY id')
  console.log('CLUBS:', clubs.rows)
  await c.end()
})().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
