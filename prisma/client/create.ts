const { prisma } = require('./generated/')

// A `main` function so that we can use async/await
async function createVisit() {
  // Create a new user called `Alice`
  const newVisit = await prisma.createVisitForm({
    clientName: "Alice",
    visitDatetime: "2015-11-22T13:57:31.123Z",
    outcomeIndex: 2,
    ableToMakeDecisions: true,
    careDecisions: true,
  })
  console.log(`Created new user: ${newVisit.name} (ID: ${newVisit.id})`)

  // Read all users from the database and print them to the console
  const allVisits = await prisma.users()
  console.log(allVisits)
}

createVisit().catch(e => console.error(e))
