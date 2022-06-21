const { prisma } = require('./generated/')

export async function readAllVisits() {
  return prisma.visitForms()
}

