"use server";
import Account from "@/models/Account";
import Stripe from "stripe";
import dbConnect from "@/lib/db";
import { auth } from "@/auth";
// Function to store accountId in the database
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function storeAccountId(data) {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("User is not authenticated");
    }
    const { account } = data;

    // Check if userId and accountId are provided
    if (!account) {
      throw new Error("UserId and AccountId are required");
    }
    try {
      await stripe.accounts.retrieve(account);
    } catch (error) {
      return {
        status: 400,
        message:
          "Please check your Account Id and it is connected with fashbiz",
      };
    }

    await dbConnect();
    // Check if the account document exists for the user
    const existingAccount = await Account.findOne({ userId: session.user.id });

    if (existingAccount) {
      // If the account exists, update it with the new accountId
      existingAccount.accountId = account;
      await existingAccount.save(); // Save the updated document
      return {
        status: 200,
        message: "Account updated successfully"
      };
    } else {
      // If no existing account, create a new one
      const newAccount = new Account({
        userId: session.user.id,
        accountId: account,
      });
      await newAccount.save(); // Save the new document
      return {
        status: 200,
        message: "Account created successfully"
      };
    }
  } catch (error) {
    return {
      status: 400,
      message: "An error occurred while storing accountId",
    };
  }
}

export async function getAccountIdByUserId(userId) {
  try {
    await dbConnect(); // Ensure the DB connection is established
    const account = await Account.findOne({ userId });

      return {
        status: 200,
        accountId: account?.accountId||'', 
      };
    
  } catch (error) {
    return {
      status: 400,
      message: "An error occurred while retrieving accountId",
    };
  }
}