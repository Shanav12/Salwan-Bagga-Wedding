/**
 * @typedef {"haldi"|"sangeet"|"baraat"|"weddingCeremony"|"cocktailDinner"|"cocktailHour"|"dinner"} EventKey
 */

/**
 * A guest document in the Firestore "guests" collection.
 * @typedef {Object} GuestDoc
 * @property {string} firstName - Lowercase first name
 * @property {string} lastName - Lowercase last name
 * @property {string} guestId - UUID for this guest
 * @property {number} guestCount - Total allowed party size
 * @property {string[]} partyMembers - Full names of additional party members (index 0 = slot 1, etc.)
 * @property {string[]} partyMemberIds - UUIDs corresponding to each partyMembers entry
 */

/**
 * Per-event attendance map for a single guest slot.
 * @typedef {Record<EventKey, boolean|null>} AttendanceMap
 */

/**
 * An RSVP document in the Firestore "rsvps" collection.
 * @typedef {Object} RsvpDoc
 * @property {string} guestId - UUID matching GuestDoc.guestId
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
