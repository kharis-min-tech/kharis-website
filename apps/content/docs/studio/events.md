# Events

Events are services, gatherings, conferences, and camps. Each workspace has its own list: the Mobile App, Kharis Website, and KP2 Website. One event can be shown on any combination of sites.

<Screenshot name="events" alt="Events page showing event cards with date tiles, category badges, a Weekly badge and a Hidden badge" />

## Event cards

Each card shows:

- A date tile and the title
- The full date and time
- The branch, or the location, or **All campuses**
- The **category** badge
- **Weekly** for repeating events
- **Hidden** for events that aren't shown on any site

Branch admins only see events for their branches.

## Adding an event

Press **New event**. The panel opens on the right.

<Screenshot name="event-editor" alt="The event editor panel with title, date, times, branch, category, repeats, show on, published and featured" />

| Field       | Required      | Notes                                                                            |
| ----------- | ------------- | -------------------------------------------------------------------------------- |
| Title       | Yes           |                                                                                  |
| Description | No            |                                                                                  |
| Date        | Yes           | The first or only date                                                           |
| Start       | Yes           |                                                                                  |
| End         | No            | Same day as the start                                                            |
| Location    | No            | Free text, for events away from a branch venue                                   |
| Branch      | Branch admins | Super admins can choose **No branch (all campuses)**                             |
| Category    | Yes           | service, fellowship, conference, camp, or general                                |
| Repeats     | Yes           | **Does not repeat** or **Weekly**                                                |
| Show on     | No            | Kharis website, KP2 website, Mobile app. The current workspace is ticked for you |
| Published   | No            | Off clears **Show on** and hides the event everywhere                            |
| Featured    | No            | Puts the event forward where a site highlights events                            |
| Cover image | No            | See [Images & Video](/guides/images-and-video)                                   |

Press **Save event**.

## Weekly events

Choose **Weekly** under **Repeats** and pick one or more **Weekdays**. Add a **Repeat until** date to stop it, or leave it empty to repeat indefinitely. The studio won't save a weekly event with no weekdays ticked.

A weekly event only needs to be entered once. The overview, the websites, and the app all work out its next date for themselves.

## Show on and Published

**Show on** is the list of sites that display the event. **Published** is a shortcut: turning it off empties that list when you save, so the event is shown nowhere and its card is marked **Hidden**. Turn it back on and tick the sites again to bring it back.

::: tip One event, three places
You don't need to copy an event into each workspace. Write it once and tick every site under **Show on**. See [Publishing an Event](/guides/publishing-an-event).
:::

## Deleting an event

Press **Delete** on the card. The studio asks first. Deleting removes the event from every site it was shown on. If you only want to take it down for now, turn **Published** off instead.

## Who can do what

| Action                      | Super admin | Branch admin   |
| --------------------------- | ----------- | -------------- |
| See events                  | All         | Their branches |
| Add an event for a branch   | Yes         | Their branches |
| Add an event with no branch | Yes         | No             |
| Edit or delete              | Yes         | Their branches |
