import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export async function hashSenha(senha: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scryptAsync(senha, salt, 64)) as Buffer;
  return `${salt}:${hash.toString("hex")}`;
}

export async function verificarSenha(senha: string, armazenada: string): Promise<boolean> {
  try {
    const [salt, hash] = armazenada.split(":");
    const hashBuffer = Buffer.from(hash, "hex");
    const derivado = (await scryptAsync(senha, salt, 64)) as Buffer;
    return timingSafeEqual(hashBuffer, derivado);
  } catch {
    return false;
  }
}
