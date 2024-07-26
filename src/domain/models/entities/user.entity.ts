import { Role } from "@prisma/client";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  agencyId: string;
  createdAt: Date;
}
