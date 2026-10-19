import * as bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

export function generateAccountNumber(): string {
  const accountArr: number[] = [];
  let i;
  for (i = 0; i < 10; i++) {
    accountArr.push(Math.trunc(Math.random() * 10));
  }
  return accountArr.join('');
}
