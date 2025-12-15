// api/clerk/webhook/ 

import { db } from '@/server/db';

export const POST = async (req: Request) => {
    const { data } = await req.json();
    
    console.log("Clerk Webhook received data:", data);

    
    const primaryEmailId = data.primary_email_address_id;
    const emailAddress = data.email_addresses?.find(
        (email: { id: string; email_address: string }) => email.id === primaryEmailId
        )?.email_address || null;
    const firstName = data.first_name;
    const lastName = data.last_name;
    const imageUrl = data.image_url;
    const id = data.id;

    await db.user.create({
        data: {
            id: id,
            emailAddress: emailAddress || "",
            firstName: firstName,
            lastName: lastName,
            imageUrl: imageUrl,
        },
    });

    console.log("User created in database from Clerk webhook");

    return new Response("Webhook received", { status: 200 });
};