/** Photographs selected from the KP2 Photography library on KOffice. */
function photo(file: string, alt: string, position = "center") {
  return { src: `/kp2/assets/photography/${file}.webp`, alt, position };
}

export const KP2_PHOTOS = {
  serviceHall: photo("service-hall", "The KP2 congregation gathered in the service hall", "center"),
  serviceCongregation: photo(
    "service-congregation",
    "KP2 members listening together during a service",
    "center",
  ),
  serviceTeaching: photo("service-teaching", "Teaching from the pulpit at a KP2 service", "center"),
  servicePraise: photo(
    "service-praise",
    "The KP2 worship team leading praise on stage",
    "center 35%",
  ),
  serviceWorship: photo(
    "service-worship",
    "KP2 members worshipping with their hands raised",
    "center",
  ),
  servicePrayer: photo("service-prayer", "A KP2 member praying during a service", "center 35%"),
  serviceChoir: photo(
    "service-choir",
    "The KP2 choir leading the congregation in worship",
    "center",
  ),
  serviceSaxophone: photo(
    "service-saxophone",
    "A KP2 saxophonist playing during worship",
    "center",
  ),
  serviceCamera: photo("service-camera", "A KP2 media camera recording the teaching", "center"),
  serviceSound: photo("service-sound", "The sound mixing desk at a KP2 service", "center"),
  serviceNotes: photo("service-notes", "A KP2 member taking notes during the sermon", "center"),
  serviceBible: photo("service-bible", "A KP2 member reading the Bible during a service", "center"),
  serviceTogether: photo(
    "service-together",
    "KP2 members sharing a joyful moment during a service",
    "center",
  ),
  serviceDuet: photo("service-duet", "KP2 singers leading worship together on stage", "center"),
  serviceScreen: photo(
    "service-screen",
    "Teaching projected on the screens at a KP2 service",
    "center",
  ),
  bassDrama: photo("bass-drama", "KP2 actors performing a drama during BASS", "center"),
  bassMusic: photo("bass-music", "Two KP2 vocalists ministering on stage during BASS", "50% 35%"),
  welcomeGroup: photo(
    "welcome-group",
    "KP2 members together in the church entrance hall",
    "center",
  ),
  welcomeSmile: photo("welcome-smile", "KP2 members smiling together at church", "center"),
  midweekHall: photo("midweek-hall", "The KP2 congregation gathered for midweek service", "center"),
  midweekPrayer: photo("midweek-prayer", "KP2 members praying during midweek service", "center"),
  midweekWorship: photo(
    "midweek-worship",
    "KP2 members singing together at midweek service",
    "center",
  ),
  midweekKeys: photo(
    "midweek-keys",
    "A KP2 keyboard player leading worship at midweek service",
    "center",
  ),
  midweekJoy: photo(
    "midweek-joy",
    "KP2 members sharing a joyful moment at midweek service",
    "center",
  ),
  midweekGreeting: photo(
    "midweek-greeting",
    "KP2 members greeting each other during midweek service",
    "center",
  ),
  midweekSharing: photo(
    "midweek-sharing",
    "A KP2 member speaking during midweek service",
    "center",
  ),
  outreachConversation: photo(
    "outreach-conversation",
    "KP2 members sharing the gospel with a passer-by",
    "center",
  ),
  outreachTeam: photo(
    "outreach-team",
    "Two KP2 members wearing yellow Kharis Phase 2 hoodies during outreach",
    "center",
  ),
  outreachSharing: photo(
    "outreach-sharing",
    "KP2 members talking with a passer-by during the Jesus Campaign",
    "center",
  ),
  outreachSpeaker: photo(
    "outreach-speaker",
    "KP2 outreach team carrying a speaker and sharing the gospel",
    "center",
  ),
  outreachStreet: photo(
    "outreach-street",
    "KP2 members taking the Jesus Campaign onto the street",
    "center",
  ),
  outreachMessage: photo(
    "outreach-message",
    "A message being shared outdoors during the KP2 Jesus Campaign",
    "center",
  ),
};
