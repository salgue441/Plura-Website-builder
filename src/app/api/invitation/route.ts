import { NextApiRequest, NextApiResponse } from "next";
import {
  UserRepository,
  InvitationRepository
} from "@/infrastructure/repositories";
import {
  InvitationService,
  AuthService,
  ClerkService
} from "@/domain/services";
import { InvitationFactory } from "@/domain/factories";
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

const userRepository = new UserRepository();
const invitationRepository = new InvitationRepository();
const clerkService = new ClerkService();
const invitationService = new InvitationService(
  invitationRepository,
  userRepository,
  new InvitationFactory()
);

/**
 * Accepts an invitation
 *
 * @method POST
 * @api /api/invitation
 *
 * @param {NextApiRequest} req - The request object
 * @returns {Promise<NextResponse>} The response object
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await invitationService.acceptInvitation("", userId);
    return NextResponse.json(
      { message: "Invitation accepted" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
