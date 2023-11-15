const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//function to create a new instance in the database for the wallet
const pushWallet = async (amount, coin) => {
    const newWallet = await prisma.wallet.create({
        data: {
          user,
          userId,
          coin,
          priceUsd,
          priceEuro,
          amount,
          icon
        },
      });
      return newWallet
}

module.exports = {
    pushWallet
}