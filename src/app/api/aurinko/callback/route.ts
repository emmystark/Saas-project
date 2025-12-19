// /api/aurinko/callback
import { exchangeCodeForToken, getAccountDetails } from "@/lib/aurinko";
import { NextRequest, NextResponse } from "next/server";
import { db } from '@/server/db';    
import { auth } from "@clerk/nextjs/server";
import { get } from "http";


export const GET = async (req: NextRequest) => {
    const { userId } = await auth();
    if (!userId) { return NextResponse.json({ message: "User not authenticated" }, { status: 401 }); }

    const params = req.nextUrl.searchParams
    const status = params.get('status')

    if (status !== 'success') {
        return NextResponse.json({ message: "Authorization failed" }, { status: 400 });
    }


    const code = params.get('code');
    if (!code) {
        return NextResponse.json({ message: "Authorization code missing" }, { status: 400 });
    }

    const token = await exchangeCodeForToken(code);

    if (!token) {
        return NextResponse.json({ message: "Token exchange failed" }, { status: 500 });
    }

    console.log('Aurinko callback received for user:', userId);

    const accountDetails = await getAccountDetails(token.accessToken);

    await db.account.upsert({
        where: {
            id: token.accoundId.toString(),
        },
        update: {
            accessToken: token.accessToken,
        },
        create: {
            id: token.accoundId.toString(),
            userId: userId,
            emailAddress: accountDetails.email,
            name: accountDetails.name,
            accessToken: token.accessToken,
        },
    });

    console.log('Linked Aurinko account details:', accountDetails);

    return NextResponse.redirect(new URL('/mail', req.url));
}