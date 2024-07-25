import { CreateUserDto } from "@/domain/dtos";
import { UserFactory } from "@/domain/factories";
import { PrismaTransaction } from "@/domain/interfaces";
import {
  ClerkService,
  InvitationService,
  UserService
} from "@/domain/services";
import { mapClerkUserToPrismaUser } from "@/infrastructure/mappers/user.mapper";
import {
  InvitationRepository,
  UserRepository
} from "@/infrastructure/repositories";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Posts the requested agency ID to the server and returns the agency ID.
 *
 * @handler /api/invitation
 * @method POST
 *
 * @param {NextRequest} request - The request object.
 * @returns {Promise<NextResponse>} The response object.
 * @throws {Error} If the user is not authenticated or the user is not found.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const createUserDto: CreateUserDto = {
    name: user.fullName || "",
    email: user.emailAddresses[0].emailAddress,
    avatarUrl: user.imageUrl,
    agencyId: "",
    role: ""
  };

  const prismaTransaction: PrismaTransaction = {
    run: async <T>(callback: () => Promise<T>): Promise<T> => callback()
  };

  const invitationService = new InvitationService(
    new InvitationRepository(),
    new UserRepository(),
    new UserService(
      new UserRepository(),
      new UserFactory(),
      mapClerkUserToPrismaUser(user, createUserDto)
    ),
    new ClerkService(),
    prismaTransaction
  );

  try {
    const agencyId = await invitationService.acceptInvitation(user);
    return NextResponse.json({ agencyId }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Failed to accept invitation" },
      { status: 500 }
    );
  }
}
