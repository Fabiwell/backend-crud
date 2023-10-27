const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

const hashPassword = async (pass) => await bcrypt.hash(pass, 10)
const comparePassword = async (pass, hash) => await bcrypt.compare(pass, hash)

const exists = async (email) => {
  let user = await prisma.user.findFirst({
    where:{
      email: email
    },
    select:{
      email: true,
      id: true,
      name: true,
      
    }
  })
  return user
}

const validate = async (email, password) => {

  if(email == "" || password == "") throw new Error('One or more fields are empty.')

  let user = await prisma.user.findFirst({
    where:{
      email: email
    }
  })

  if(user){
    let result = await comparePassword(password, user.password)
    if(!result) return false
    return user
  }
  return false
}

const findById = async (id) => {
  let user = await prisma.user.findFirst({
      where: { id: id },
      select: {
          email: true,
          firstName: true,
          id: true,
          lastName: true
      }
  })
  return user
}
const register = async (email, name, password) => {

    const existingUser = await exists(email);

    if (existingUser) {
        throw new Error('User with this email already exists.');
    }

    if (email === "" || name === "" || password === ""){
        throw new Error('One or more fields are empty.');
    }


    let hashed = await hashPassword(password)
    let user = await prisma.user.create({
        data:{
            email,
            name,
            password: hashed
        },
        select:{
            id: true,
            email: true,
            name: true
        }
    })
    return user
}

module.exports = {
  exists,
  findById,
  validate,
  register
}
