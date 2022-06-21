const { prisma } = require('./generated/')

export async function createVisit({ clientName, visitDatetime, outcomeIndex, ableToMakeDecisions, careDecisions }: any) {
  return prisma.createVisitForm({
    clientName,
    visitDatetime,
    outcomeIndex,
    ableToMakeDecisions,
    careDecisions
  })
}


