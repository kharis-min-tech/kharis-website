# Users

Users is where super admins decide who can sign in to the studio and what they can edit. It lives under **General**. Invitations and password resets are sent by email.

<Screenshot name="users" alt="Users page with counts of super admins and branch admins, above a table of accounts" />

## At a glance

Cards along the top count **Super admins** and **Branch admins**. Below them, every account is listed:

| Column       | Notes                                                                    |
| ------------ | ------------------------------------------------------------------------ |
| User         | The email address they sign in with                                      |
| Role         | **Super admin** or **Branch admin**                                      |
| Branches     | **All branches** for super admins, the chosen branches for branch admins |
| Last sign-in | **Never** if they haven't accepted their invite yet                      |

Search by email, role, or branch.

## Inviting someone

An invite sets everything up in one go: their email, their **role**, and (if they are a branch admin) **which branches** they look after. You don't invite first and assign access later.

Press **Invite user**.

<Screenshot name="user-invite" alt="The Invite user panel with an email field, a role picker and a list of branches to tick" />

1. Enter their **Email**. They get a link to choose a password.
2. Choose their **Role** (Branch admin is selected by default).
3. If you chose **Branch admin**, tick the **Branches** they can edit. At least one is required. The count under the list shows how many you've chosen.
4. Press **Send invite**. You'll see **Invite sent to** and their address.

| Field    | Required          | Notes                                           |
| -------- | ----------------- | ----------------------------------------------- |
| Email    | Yes               | The address they will sign in with              |
| Role     | Yes               | Super admin or Branch admin                     |
| Branches | For branch admins | Which branches they can edit; tick at least one |

What each role allows:

- **Super admin:** Can edit everything in the studio and manage users. Branches are not listed; they already cover every branch.
- **Branch admin:** Can edit only the branches you tick, plus those branches' events, messages and visitors.

::: tip Give the smallest role that works
Most people only need to look after their own branch. Invite them as a **Branch admin** and tick that branch. You can add more branches or change the role later under **Edit**.
:::

## Changing a role or branches

Press **Edit** on the row, change the **Role** or the ticked **Branches**, and press **Save**. The person picks up the change the next time the studio checks their access.

## Password resets

Press **Send password reset** on the row. They get an email with a link to the **Choose a password** screen. Use this when someone's invite link has expired too.

## Removing someone

Press **Delete** on the row. The studio asks first. Deleting removes the account and their sign-in.

::: warning Don't remove the last super admin
Only super admins can change roles. Keep at least two, so one can always help the other.
:::
