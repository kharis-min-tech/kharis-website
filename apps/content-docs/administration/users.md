# Users

Users is where super admins decide who can sign in to the studio and what they can edit. It lives under **General**. Invitations and password resets are sent by email.

<Screenshot name="users" alt="Users page with counts of super admins, branch admins and people waiting for access, above a table of accounts" />

## At a glance

Three cards along the top count **Super admins**, **Branch admins**, and accounts **Waiting for access**. Below them, every account is listed:

| Column       | Notes                                                                    |
| ------------ | ------------------------------------------------------------------------ |
| User         | The email address they sign in with                                      |
| Role         | **Super admin**, **Branch admin**, or **No access**                      |
| Branches     | **All branches** for super admins, the chosen branches for branch admins |
| Last sign-in | **Never** if they haven't accepted their invite yet                      |

Search by email, role, or branch.

## Inviting someone

Press **Invite user**.

<Screenshot name="user-invite" alt="The Invite user panel with an email field, a role picker and a list of branches to tick" />

| Field    | Required          | Notes                                                           |
| -------- | ----------------- | --------------------------------------------------------------- |
| Email    | Yes               | They get an email with a link to choose a password              |
| Role     | Yes               | Branch admin is selected by default                             |
| Branches | For branch admins | Tick at least one. The count below shows how many you've chosen |

Under the role, the panel describes what it allows:

- **Super admin:** Can edit everything in the studio and manage users.
- **Branch admin:** Can edit the chosen branches, plus their events, messages and visitors.
- **No access:** Can sign in but can't see or edit anything yet.

Press **Send invite**. You'll see **Invite sent to** and their address.

::: tip Give the smallest role that works
Most people only need to look after their own campus. Make them a branch admin for that branch. You can always widen it later.
:::

## Changing a role or branches

Press **Edit** on the row, change the **Role** or the ticked **Branches**, and press **Save**. The person picks up the change the next time the studio checks their access.

## Password resets

Press **Send password reset** on the row. They get an email with a link to the **Choose a password** screen. Use this when someone's invite link has expired too.

## Removing someone

Press **Delete** on the row. The studio asks first. Deleting removes the account; to keep the account but take away access, edit it and set the role to **No access** instead.

::: warning Don't remove the last super admin
Only super admins can change roles. Keep at least two, so one can always help the other.
:::
