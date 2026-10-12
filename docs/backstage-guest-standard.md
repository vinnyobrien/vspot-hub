# Backstage guest page standard

The pilot lives at `/backstage/shaje/`. Keep the physical dressing room, vanity
bulbs, chair name and interactive sticky notes. Guest actions must stay clear on
mobile. Respect reduced motion. Preserve the existing V Spot palette and fonts.

The public room is an unindexed preview. Live guest operations require a
personal capability link and separate guest password created inside the
authenticated cockpit Guests room. No email is sent by pass creation.

The cockpit owns the guest pass document and received assets. The site proxies
only the guest-scoped operation to `/api/guest-pass`. Tokens expire after 90 days.
Headshots remain private and are downloadable through an authenticated endpoint.
The guest confirms permission before submitting a headshot or bio.

Check-in records acceptance of the podcast invitation only. Booking status comes
from a matching event on Vinny's connected Google calendar, with the invited
email address and the selected show's recording. It never follows from opening
the booking link. The guest can request a calendar check after booking.

Create Shaje's pilot pass inside the cockpit, then copy its link and guest
password. Future guests use the same room through a pass that personalises their
name, brief, show booking URL and episode scope. A full show-specific theme and
automated Calendly webhook are separate extensions, not part of this pilot.

Progress and received assets overlay the existing cockpit guest roster. Existing
roster data and authentication settings remain in place. Use the authenticated
guest room to see received bios, notes and headshots. The password and capability
link must never be copied into public site data, screenshots or source control.

The preview includes dated, scoped audience numbers, verified previous guest
names and attributed quotes. Refresh figures with sources before changing them.
The AI scenario answers remain local and are not saved.
