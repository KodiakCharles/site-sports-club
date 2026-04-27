const { Client } = require('pg')
;(async () => {
  const c = new Client(process.env.DATABASE_URL)
  await c.connect()
  const types = await c.query(
    "SELECT t.typname FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE n.nspname='public' AND t.typtype='e' ORDER BY t.typname",
  )
  console.log('ENUMS:', types.rows.map((r) => r.typname))
  const enumValues = await c.query(
    "SELECT e.enumlabel FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid WHERE t.typname='enum_clubs_status'",
  )
  console.log('enum_clubs_status values:', enumValues.rows.map((r) => r.enumlabel))
  const tables = await c.query(
    "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename",
  )
  console.log('TABLES:', tables.rows.map((r) => r.tablename))
  await c.end()
})().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
