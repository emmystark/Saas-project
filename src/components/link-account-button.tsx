'use client'

import React  from "react";
import { Button } from "./ui/button";
import { getAurinkoAuthUrl } from "@/lib/aurinko";


const LinkAccountButton = () => { 
   return (
    <Button onClick={async () => {
        const authUrl = await getAurinkoAuthUrl('Google');
        console.log('Redirecting to:', authUrl);
        window.location.href = authUrl;
    }}>
        Link Account
    </Button>
   )

};


export default LinkAccountButton;