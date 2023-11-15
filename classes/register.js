// Import necessary modules
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// Function to hash a password using bcrypt
const hashPassword = async (pass) => await bcrypt.hash(pass, 10);

// Function to compare a password with its hash using bcrypt
const comparePassword = async (pass, hash) => await bcrypt.compare(pass, hash);

// Function to check if a user with a given email exists
const exists = async (email) => {
  let user = await prisma.user.findFirst({
    where: {
      email: email
    },
    select: {
      email: true,
      id: true,
      name: true,
    }
  });
  return user;
}

// Function to validate user credentials (email and password)
const validate = async (email, password) => {

  // Check if email or password is empty
  if (email == "" || password == "") throw new Error('One or more fields are empty.');

  // Find a user with the given email
  let user = await prisma.user.findFirst({
    where: {
      email: email
    }
  });

  // If user exists, compare the provided password with the stored hash
  if (user) {
    let result = await comparePassword(password, user.password);
    if (!result) return false;
    return user;
  }
  return false;
}

// Function to find a user by their ID
const findById = async (id) => {
  let user = await prisma.user.findFirst({
    where: { id: id },
    select: {
      email: true,
      firstName: true,
      id: true,
      lastName: true
    }
  });
  return user;
}

// Function to register a new user
const register = async (email, name, password) => {

  // Check if a user with the given email already exists
  const existingUser = await exists(email);

  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  // Check if any of the registration fields is empty
  if (email === "" || name === "" || password === "") {
    throw new Error('One or more fields are empty.');
  }

  // Hash the provided password and create a new user in the database
  let hashed = await hashPassword(password);
  let user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashed
    },
    select: {
      id: true,
      email: true,
      name: true
    }
  });
  return user;
}

// Export the functions for use in other modules
module.exports = {
  exists,
  findById,
  validate,
  register
}