import type { Document } from "mongodb";
import { getDatabase } from "./mongodb.ts";

interface UserDoc extends Document {
	email: string
	roles: string[]
}

export async function Users() {
  const db = await getDatabase();
  return db.collection<UserDoc>("users");
}

export async function Roles() {
  const db = await getDatabase();
  return db.collection("roles");
}

export async function ABACRules() {
  const db = await getDatabase();
  return db.collection("abac_rules");
}