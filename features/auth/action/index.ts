"use server"

import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function onBoardUserToDatabase(){
    const {userId} = await auth()
    if(!userId)
        return
    const clerkUser = await currentUser()
    if(!clerkUser)
        return

    const email = clerkUser.primaryEmailAddress?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? null
    const name = clerkUser.fullName ?? ([clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null)

    await prisma.user.upsert({
        where: { clerkId: userId },
        create:{
            clerkId: userId,
            email,
            firstName: clerkUser.firstName ?? null,
            lastName: clerkUser.lastName ?? null,
            name,
            imageUrl: clerkUser.imageUrl ?? null,
        },
        update:{
            email,
            firstName: clerkUser.firstName ?? null,
            lastName: clerkUser.lastName ?? null,
            name,
            imageUrl: clerkUser.imageUrl ?? null,
        }
    })
}


export async function getCurrentUser(){
    /**
     * find from the clerk user and then find from the database
     */
    const user = await currentUser()
    if(!user)
        return null

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id }
    })
    return dbUser
}
