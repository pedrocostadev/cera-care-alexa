const express = require('express')
const app = express()
const port = 3002
const { readAllVisits } = require("../prisma/client/read")

app.use(express.json());

app.get('/visits', async (_req: any, res: any) => {
  const visits = await readAllVisits()
  res.send(visits)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
