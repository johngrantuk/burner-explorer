const Web3 = require('web3');
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM accounts');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
