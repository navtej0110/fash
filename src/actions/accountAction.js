"use server";
import Account from "@/models/Account";
import User from "@/models/User";
import Stripe from "stripe";
import dbConnect from "@/lib/db";
import { auth } from "@/auth";

// Function to store accountId in the database
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function getQRData() {
  try {
    const session = await auth();
    if (!session) {
      return { status: 400, error: "Invalid User" };
    }
    await dbConnect();
    const user = await User.findById(session.user.id);
    const account = await Account.findOne({ userId: session.user.id });
    const userData = {
      firstName: user.firstname,
      lastName: user.lastname,
      email: session.user.email,
      accountId: account?.accountId || "",
    };
    return {
      status: 200,
      qrData: userData || "",
    };
  } catch (error) {
    return {
      status: 400,
      error: error.message || "An error occurred while retrieving QR Data",
    };
  }
}
export async function getAccountId() {
  try {
    const session = await auth();
    if (!session) {
      return { status: 400, error: "Invalid User" };
    }
    await dbConnect();
    const account = await Account.findOne({ userId: session.user.id });
    const user = await User.findById(session.user.id);

    let stripeAccount = null;
    try {
      stripeAccount = await stripe.accounts.retrieve(account.accountId);
    } catch (err) {
      if (err.code == "account_invalid") {
        await Account.deleteOne({ _id: account._id });
        return {
          status: 200,
          accountId: "",
          isAccountComplete: false,
          userRole: user?.role,
        };
      }
    }

    return {
      status: 200,
      accountId: account?.accountId || "",
      isAccountComplete: account?.isAccountComplete || false,
      userRole: user?.role,
    };
  } catch (error) {
    return {
      status: 400,
      error: error.message || "An error occurred while retrieving accountId",
    };
  }
}

export async function storePercentage(data) {
  const session = await auth();
  if (!session) {
    return { status: 400, error: "Invalid User" };
  }
  const user = await User.findById(session.user.id);

  if (!user || user.role != "store") {
    return { status: 404, error: "Invalid User" };
  }

  const account = await Account.findOne({ userId: session.user.id });
  if (!account) {
    return { status: 404, error: "Account not found" };
  }

  account.percentage = data.percentage;

  try {
    await account.save();
    return { status: 200, message: "Percentage updated successfully" };
  } catch (error) {
    return { status: 500, error: "Error updating percentage" };
  }
}

export async function getPercentage() {
  const session = await auth();
  if (!session) {
    return { status: 400, error: "Invalid User" };
  }

  const account = await Account.findOne({ userId: session.user.id });
  if (!account) {
    return { status: 404, error: "Account not found" };
  }
  console.log(account.percentage, "account.percentage");
  return { status: 200, percentage: account.percentage || null };
}

export async function storeSuccessResult(accountId) {
  try {
    const session = await auth();
    if (!session) {
      return { status: 400, error: "Invalid User" };
    }
    if (!accountId) {
      return {
        status: 400,
        error: "Account ID is required.",
      };
    }

    // Retrieve the account from Stripe
    const account = await stripe.accounts.retrieve(accountId);
    if (!account) {
      return {
        status: 400,
        error: "Account not found.",
      };
    }
    const isChargesEnabled = account.charges_enabled;
    const isPayoutsEnabled = account.payouts_enabled;

    const missingRequirements =
      account.requirements && account.requirements.currently_due.length > 0;
    const eventuallyDueRequirements =
      account.requirements && account.requirements.eventually_due.length > 0;

    // Determine if the account is fully filled (i.e., complete and enabled)
    const isAccountComplete =
      isChargesEnabled &&
      isPayoutsEnabled &&
      !missingRequirements &&
      !eventuallyDueRequirements;
    // Check if the account document exists for the user
    const existingAccount = await Account.findOne({ userId: session.user.id });

    if (existingAccount) {
      // try {
      //   const account = await stripe.accounts.retrieve(
      //     existingAccount.accountId
      //   );
      //   if (account) {
      //     const oldAccount = existingAccount.accountId;
      //     await stripe.accounts.del(oldAccount);
      //   }
      // } catch (error) {
      //   console.log(error.message);
      // }

      existingAccount.accountId = accountId;
      existingAccount.isAccountComplete = isAccountComplete;
      await existingAccount.save();

      return {
        status: 200,
        message: "Account updated successfully",
      };
    } else {
      const newAccount = new Account({
        userId: session.user.id,
        accountId: accountId,
        percentage:10,
        isAccountComplete: isAccountComplete,
      });
      await newAccount.save();
      return {
        status: 200,
        message: "Account created successfully",
      };
    }
  } catch (error) {
    return {
      status: 500,
      error: "An error occurred while refreshing the onboarding process.",
    };
  }
}

export async function getTransactionsForConnectedAccount(accountId) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("User is not authenticated");
    }

    // Connect to the database
    await dbConnect();

    const account = await Account.findOne({ userId: session.user.id });

    const transactions = await stripe.balanceTransactions.list(
      {
        limit: 100, // Fetch up to 100 transactions at a time
      },
      {
        stripeAccount: account.accountId, // Connected account ID
      }
    );

    return {
      status: 200,
      transactions: transactions.data,
    };
  } catch (error) {
    return {
      status: 500,
      error: "Something went wrong",
    };
  }
}
