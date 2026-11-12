/**
 * Creates or promotes the master admin account defined by ADMIN_EMAIL / ADMIN_PASSWORD
 * in your .env file. Safe to run more than once.
 *
 *   npm run seed:admin
 */
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../models/User';

async function run() {
  if (!env.adminEmail || !env.adminPassword) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env before running this script.');
    process.exit(1);
  }

  await mongoose.connect(env.mongoUri);

  const existing = await User.findOne({ email: env.adminEmail.toLowerCase() });

  if (existing) {
    existing.role = 'admin';
    if (existing.name === 'ODDSBOOK Admin' || !existing.name) existing.name = env.adminName;
    await existing.save();
    console.log(`Promoted existing user ${existing.email} to admin.`);
  } else {
    const passwordHash = await bcrypt.hash(env.adminPassword, 12);
    const admin = await User.create({
      name: env.adminName,
      email: env.adminEmail.toLowerCase(),
      passwordHash,
      role: 'admin',
      bio: 'Official ODDSBOOK picks, verified and tracked.',
    });
    console.log(`Created master admin account: ${admin.email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
