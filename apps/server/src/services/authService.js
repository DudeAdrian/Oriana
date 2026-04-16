const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const register = async (email, username, password, displayName) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }]
    }
  });

  if (existingUser) {
    throw new Error('Email or username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      displayName
    }
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName
    },
    token
  };
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName
    },
    token
  };
};

module.exports = { register, login };
