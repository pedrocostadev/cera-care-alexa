const express = require('express')
const app = express()
const cors = require('cors')
const { readAllVisits, readVisitById } = require("../prisma/client/read")

const port = 3002

app.use(express.json());
app.use(cors())

app.get('/visits', async (_req: any, res: any) => {
  const visits = await readAllVisits()
  res.send(visits)
})

app.get('/visits/:id', async (req: any, res: any) => {
  const { id } = req.params
  const visit = await readVisitById(id)
  res.send(visit)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
