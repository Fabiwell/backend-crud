const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const pushWallet = async (amount, coin) => {
    const newWallet = await prisma.wallet.create({
        data: {
          userId: userId,
        },
      });
      
}

module.exports = {
    pushWallet
}