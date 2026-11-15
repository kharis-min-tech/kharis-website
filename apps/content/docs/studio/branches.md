# Branches

The Branches page holds every Kharis campus. It is the source for the branch pages on kharis.org, the KP2 locations, and the campus list in the app. Super admins see every branch. Branch admins see the branches they've been given.

<Screenshot name="branches" alt="Branches page showing a card for each campus with its hero photo and an Active badge" />

## Branch cards

Each branch is shown as a card with:

- The hero photo, or a church icon if there isn't one yet
- Branch name and subtitle
- An **Active** or **Inactive** badge

Use the **Active**, **Inactive**, and **All** tabs above the list to switch between live branches and deactivated ones, and the search box to find a branch by name.

## Opening a branch

Click a card to open the editor. Everything about the branch is on one long page, saved together with **Save branch** at the bottom.

<Screenshot name="branch-editor" alt="The branch editor showing name, slug, city, workspace, descriptions and the pastor section" />

### Details

| Field             | Required | Notes                                                                         |
| ----------------- | -------- | ----------------------------------------------------------------------------- |
| Name              | Yes      | The slug fills itself in from the name until you edit the slug                |
| Slug              | Yes      | The branch's web address, for example `london` in kharis.org/locations/london |
| City              | No       | Shown on the branch card                                                      |
| Workspace         | No       | General, Kharis Website, or KP2 Website                                       |
| Short description | No       | The one-liner on cards and lists                                              |
| Description       | No       | The longer introduction on the branch page                                    |
| Sort order        | No       | Lower numbers appear first                                                    |
| Active            | No       | Off hides the branch from the websites and app                                |

### Pastor

**Name**, **Role** (Pastor or Branch Lead), **Bio**, and **Pastor photo**. A line underneath previews exactly how the site will introduce them.

### Contact

**Email**, **Phone**, **Giving link**, and **Instagram**.

### Hero image and branch video

The **Hero image** is the large photo at the top of the branch page. The **Branch video** fills the "A look at …" section. See [Images & Video](/guides/images-and-video) for sizes and formats.

### Venues

A branch can meet in more than one place. Each venue has a **Name**, **City**, **Address**, **Postcode**, **Parking**, **Public transport** notes, and a **Venue photo**. Addresses live on venues, not on the branch, because that's what the websites show.

Under the fields, place the venue on the map. Type a name into **Search for a venue** and press **Search**, or fill in the address and press **Look up address**, then choose the right result. The address, postcode, city, and **Latitude** and **Longitude** fill in for you, and a map preview appears. The pin is what puts the venue on the websites' maps and directions.

Press **Add venue** for another one. A saved venue can be **Deactivated** rather than removed. When any are inactive, a **Show inactive** link appears beside the heading so you can see and **Reinstate** them.

### Services

Each service time has a **Day**, **Time**, **Label** (for example "Sunday Service"), and the **Venue** it happens at. Press **Add service** for another. Saved services are deactivated and reinstated the same way as venues.

::: warning Deactivating a venue that's still in use
If you deactivate a venue that active services still meet at, the studio tells you how many. Move those services to another venue, otherwise their address won't show on the websites.
:::

### Gallery

Drop several photos at once into the gallery. They appear on the branch page in the order shown.

## Adding a branch

Super admins see **New branch** at the top of the list. On a new branch, **Branch template** fills in a starting set of venues, service times, and the usual parking and transport wording, which you then edit to match the campus. For the full walk-through, see [Adding a Branch](/guides/adding-a-branch).

::: tip Photos before the first save
You can choose photos for a branch that hasn't been saved yet. They're held in the browser and upload when you press **Save branch**, at the same moment the branch's Cloudflare folder is created.
:::

## Deactivating a branch

Open the branch and press **Deactivate branch** (super admins only). The studio asks first. Deactivating hides the branch from the websites and app, but keeps its venues, services, photos, events, and messages. Open it from the **Inactive** tab and press **Reinstate branch** to bring it back.

Branch admins can't deactivate or reinstate a branch, or create a new one. They edit the branches they've been given.

## If part of a save fails

Saving a branch does several things in order: the details, the Cloudflare folder, each new photo, the gallery, the venue photos, the video, and finally tidying up images that are no longer used. If one of the later steps fails, the branch itself is still saved and the message says which part didn't go through, for example **Branch saved, but the gallery was not**. Open the branch and save again.
