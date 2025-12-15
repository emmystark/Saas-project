import { db } from "./server/db";


await db.user.create({
  data: {
    emailAddress: "sw@gmail.com",
    firstName: "Steve",
    lastName: "Wozniak",
    
  },
});

console.log("User created successfully");