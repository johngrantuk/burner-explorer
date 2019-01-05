const Web3 = require('web3');
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: /*process.env.DATABASE_URL*/'postgres://xbaydndxonqipl:8fea1f19de56e5a935cab7b6d9244289fee37f709d1321f68b4ffa6b6efbac6c@ec2-23-21-86-22.compute-1.amazonaws.com:5432/dmt5n9tsrugnj',
  ssl: true
});


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/db', async (req, res) => {
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
