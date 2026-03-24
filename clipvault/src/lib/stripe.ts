import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string,
  customerId?: string
): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    customer_email: customerId ? undefined : email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: {
      userId,
    },
  });

  return session;
}

export async function createCustomerPortalSession(customerId: string): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile`,
  });

  return session;
}

export async function createConnectAccount(email: string): Promise<Stripe.Account> {
  const account = await stripe.accounts.create({
    type: 'express',
    email,
    capabilities: {
      transfers: { requested: true },
    },
  });

  return account;
}

export async function createConnectAccountLink(accountId: string): Promise<Stripe.AccountLink> {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/creator/dashboard`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/creator/dashboard`,
    type: 'account_onboarding',
  });

  return accountLink;
}

export async function createPayout(
  accountId: string,
  amount: number,
  currency: string = 'usd'
): Promise<Stripe.Transfer> {
  const transfer = await stripe.transfers.create({
    amount: Math.round(amount * 100),
    currency,
    destination: accountId,
  });

  return transfer;
}

export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return subscription;
}
