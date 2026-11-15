# Roles & Permissions

What you can see and do in Content Studio is decided by the **role** on your account. There are three. There is no role switcher, and nothing to choose after signing in. A super admin sets your role, and it takes effect the next time the studio checks your access.

## The one thing to understand first

The studio hides what your role cannot use, but hiding is not the protection. Every read and every save goes through the Kharis API as **you**, and the database's row level security decides whether it is allowed. A branch admin who typed the address of another branch's page would get nothing back, because the database would refuse.

That is also why a failed access check never falls back to full access. If the studio can't confirm your role, it shows you nothing.

## The three roles

| Role         | What it means                          | Reach                                                |
| ------------ | -------------------------------------- | ---------------------------------------------------- |
| Super admin  | Runs the studio                        | Every workspace, every branch, and studio users      |
| Branch admin | Looks after one or more named branches | Those branches, and their events, messages, visitors |
| No access    | Has an account but no role yet         | Nothing                                              |

---

## Super admin

**Can do:**

- Open every workspace and every section
- Create, edit, deactivate, and reinstate any branch
- Add events with no branch, for all campuses
- Read and manage every message, visitor, and newsletter address
- Edit sermons, testimonies, announcements, the featured video, department videos, and all app content
- Invite users, change roles and branches, send password resets, and delete accounts

::: warning Keep at least two super admins
Super admins are the only people who can change roles. If the only super admin loses access, nobody inside the studio can give it back.
:::

---

## Branch admin

A branch admin is given a list of branches when they are invited. Everything they see is narrowed to those branches.

<Screenshot name="overview-branch-admin" alt="The overview for a branch admin, showing only the General, Mobile App, Kharis Website and KP2 Website sections they can use" />

**Can do:**

- Edit their branches: details, pastor, contact, photos, video, venues, service times, and gallery
- Add and edit events for their branches, and choose which sites show them
- Read, mark, archive, and delete messages sent to their branches
- View and edit visitors who planned a visit to their branches

**Cannot do:**

- Create a new branch, or deactivate and reinstate one
- Add an event without a branch
- Open Announcements, Testimonies, Sermons, Newsletter, Department Videos, Featured Video, any Mobile App daily content, Live, or Users
- See another branch's events, messages, or visitors

::: tip Each workspace shrinks to fit
For a branch admin, every workspace shows only Branches, Events, Messages, and Visitors, whichever of those that workspace has. A workspace with none of them left is hidden.
:::

---

## No access

An account with no role can sign in and see the **Waiting for access** screen. That's all. This is the state for someone who has been invited but not yet given a role, or whose role has been taken away without deleting the account.

## Changing a role

Only a super admin can change a role, from [Users](/administration/users). The change applies the next time the person's studio checks their access: when they open the studio, or press **Check again**.

For a full screen-by-screen table, see the [Access Reference](/administration/access-reference).
