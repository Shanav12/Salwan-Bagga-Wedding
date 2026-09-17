/**
 * @typedef {"haldi"|"sangeet"|"baraat"|"weddingCeremony"|"cocktailDinner"|"cocktailHour"|"dinner"} EventKey
 */

/**
 * A guest document in the Firestore "guests" collection.
 * @typedef {Object} GuestDoc
 * @property {string} firstName - Lowercase first name
 * @property {string} lastName - Lowercase last name
 * @property {string} guestId - Deterministic ID in the form `{firstName}{lastName}-{8digits}`, e.g. `johnsmith-04829173`
 * @property {number} guestCount - Total allowed party size
 * @property {string[]} partyMemberIds - `guestId`s for each party member slot (null if slot unfilled); length = guestCount - 1
 * @property {string} [parentGuestId] - guestId of the primary guest this member belongs to (absent on primary guests)
 */

/**
 * Per-event attendance map for a single guest slot.
 * @typedef {Record<EventKey, boolean|null>} AttendanceMap
 */

/**
 * An RSVP document in the Firestore "rsvps" collection.
 * @typedef {Object} RsvpDoc
 * @property {string} guestId - ID matching GuestDoc.guestId
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} [phoneNumber]
 * @property {string} [dietary]
 * @property {AttendanceMap} attendance
 * @property {boolean} isDraft
 * @property {import("firebase/firestore").Timestamp} submittedAt
 */

/**
 * Shape passed to saveRsvps for each party member.
 * @typedef {Omit<RsvpDoc, "isDraft"|"submittedAt">} MemberRsvpPayload
 */

export {};
