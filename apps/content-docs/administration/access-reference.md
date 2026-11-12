# Access Reference

Every section of the studio, by workspace, and who can open it. Accounts with **No access** can't open any of them.

## General

| Section           | Super admin | Branch admin               |
| ----------------- | ----------- | -------------------------- |
| Branches          | ✓           | Their branches             |
| Department Videos | ✓           |                            |
| Sermons           | ✓           |                            |
| Testimonies       | ✓           |                            |
| Visitors          | ✓           | Visitors to their branches |
| Messages          | ✓           | Messages to their branches |
| Newsletter        | ✓           |                            |
| Users             | ✓           |                            |

## Mobile App

| Section        | Super admin | Branch admin              |
| -------------- | ----------- | ------------------------- |
| Events         | ✓           | Events for their branches |
| Announcements  | ✓           |                           |
| Daily Reading  | ✓           |                           |
| Daily Message  | ✓           |                           |
| Daily Prayers  | ✓           |                           |
| Bible          | ✓           |                           |
| Sermon library | ✓           |                           |
| Live           | ✓           |                           |

## Kharis Website

| Section           | Super admin | Branch admin               |
| ----------------- | ----------- | -------------------------- |
| Branches          | ✓           | Their branches             |
| Department Videos | ✓           |                            |
| Events            | ✓           | Events for their branches  |
| Testimonies       | ✓           |                            |
| Featured Video    | ✓           |                            |
| Announcements     | ✓           |                            |
| Messages          | ✓           | Messages to their branches |

## KP2 Website

| Section           | Super admin | Branch admin               |
| ----------------- | ----------- | -------------------------- |
| Branches          | ✓           | Their branches             |
| Department Videos | ✓           |                            |
| Events            | ✓           | Events for their branches  |
| Testimonies       | ✓           |                            |
| Announcements     | ✓           |                            |
| Messages          | ✓           | Messages to their branches |
| Newsletter        | ✓           |                            |

## Actions only super admins can take

- Create a branch, or deactivate and reinstate one
- Add an event with no branch
- Invite, edit, reset, and delete studio users

## How it's enforced

The sidebar, the workspace list, and the overview only show what your role can use. If a branch admin opens the address of a section they can't use, the studio sends them back to the overview.

Underneath that, every request goes through the Kharis API as the signed-in person, and the database's row level security decides what they can read and save. See [Roles & Permissions](/getting-started/roles-permissions).
