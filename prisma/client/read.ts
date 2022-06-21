const { prisma } = require('./generated/')

export async function readAllVisits() {
  return prisma.visitForms()
}

export async function readVisitById(id: string) {
  return prisma.visitForm({ id })
}

