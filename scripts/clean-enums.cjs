const { Client } = require('pg')
;(async () => {
  const c = new Client(process.env.DATABASE_URL)
  await c.connect()
  const tables = await c.query(
    "SELECT tablename FROM pg_tables WHERE schemaname='public'",
  )
  if (tables.rows.length > 0) {
    console.error('Refus : des tables existent en BDD, on ne touche pas aux enums.')
    console.error(tables.rows.map((r) => r.tablename))
    process.exit(1)
  }
  const enums = await c.query(
    "SELECT t.typname FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE n.nspname='public' AND t.typtype='e'",
  )
  console.log(`Drop de ${enums.rows.length} enums orphelins...`)
  for (const row of enums.rows) {
    await c.query(`DROP TYPE IF EXISTS public."${row.typname}" CASCADE`)
    console.log(`  ✓ ${row.typname}`)
  }
  await c.end()
  console.log('Cleanup OK.')
})().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
