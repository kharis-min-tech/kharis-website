# Signing In

Content Studio lives at **content.kharis.org**. Accounts are created by invitation only. There is no sign-up page, and nobody can give themselves access.

<Screenshot name="sign-in" alt="Content Studio sign-in screen with the verse panel on the left and the email and password form on the right" />

## Signing in

Enter the email address you were invited with and your password, then press **Sign in**. The eye icon in the password field shows what you've typed.

Use the **Dark mode** or **Light mode** button in the top corner to switch themes. The studio remembers your choice on that device.

::: tip Need an account?
Ask a super admin to invite you. They choose your role and, for branch admins, which branches you can edit. See [Users](/administration/users).
:::

## Accepting an invitation

An invitation arrives by email with a link to choose a password. The link opens a **Choose a password** screen showing the account it belongs to.

<Screenshot name="set-password" alt="The Choose a password screen showing the account email, a new password field and a confirm field" />

| Field            | Notes                 |
| ---------------- | --------------------- |
| New password     | At least 8 characters |
| Confirm password | Must match exactly    |

Press **Save password** and you are taken straight into the studio. Password reset emails use the same screen.

## If the link doesn't work

Links expire, and each one can only be used once. An old or already-used link shows **This link doesn't work**, with the reason Supabase gave. Ask a super admin to press **Send password reset** for your account, and use the newest email.

## Waiting for access

If your account exists but has no role yet, you'll see **Waiting for access** after signing in. Nothing is broken: a super admin needs to give you a role.

<Screenshot name="waiting-for-access" alt="The Waiting for access screen with Check again and Sign out buttons" />

Once they have, press **Check again**. There's no need to sign out and back in.

## We couldn't check your access

The studio asks the Kharis API who you are each time it opens. If that check fails, for example because the API is unreachable, you'll see **We couldn't check your access** with the reason. Press **Try again**. The studio never falls back to showing more than your role allows.

## Signing out

Use the sign-out button at the bottom of the sidebar, next to your email address and the theme toggle.
