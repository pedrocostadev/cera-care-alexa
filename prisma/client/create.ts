const { prisma } = require('./generated/')

export async function createVisit({ clientName, address, visitDatetime, outcomeIndex, ableToMakeDecisions, careDecisions }: any) {
  return prisma.createVisitForm({
    clientName,
    address,
    visitDatetime,
    outcomeIndex,
    ableToMakeDecisions,
    careDecisions
  })
}


