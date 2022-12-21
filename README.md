# equal.place
Just another [nostr](https://github.com/nostr-protocol/nostr) web client.


## Libraries used
- sveltekit
- tailwind
- dicebear - Handsome avatars
- noble/secp256k1 - Key generation

## Important
This is a project in progress. May not be functional.


# Changes
- All profiles are now stored in indexedDB

## TODO
- ✅ Store fetched users
- 🟩 Fetch Group info
- 🟩 Home Page: Feed type selection: Global / Feed
- 🟩 Feed update groupping. (Show 'load new' whenever there is more than 10 new items)
- 🟩 `NIP5`: User verification
- 🟩 `NIP8`: Mentions, tags
- 🟩 `NIP9`: Content deletion
- 🟩 `NIP10`: Replies
- 🟩 `NIP19`: Bech32 Keys
- 🟩 `NIP25`: Reactions
- 🟩 `NIP28`: Chats
- 🟩 Data submission
- 🟩 Connect to alternate relays when submitting.
- 🟩 Update profile
- 🟩 Send actions
- 🟩 Parse actions
- 🟩 Search?
- 🟩 Private Messages
- 🟩 Relay list (Store any seen relay address)

## Required Fixes
- 🟩 Fix: Refresh on navigation.
- 🟩 Fix: Connect spam, get rid of `isInitiated`.



## TODO Phase 2
- 🟦 Chat Rooms
- 🟦 Contact Book
- 🟦 Server Management.
- 🟦 Store Management


## TODO Phase 3 (these kind does not exists. Just spitballing.)
- 💭 Audio Stream (Kind:70)
- 💭 Video Stream (Kind:71)
- 💭 File Share (Kind:72)
- 💭 Disocvery Sharing (Kind:80)


## 💭 Optimization Ideas
- Fetch simultaneously fetched profile count.
- Connect when publishing.
- Connect queue (Chaining).
- Automatically fetch new people.
- Store first, display in groups.
- Fetch if visible. (scroll to load)
- indexedDB
- index: Last Seen Date, nip5 Value, photo.
- store Notes.
- isFollowed


## Legends
### ⏳ In progress
### ✅ Completed 
### 🟩 Next In Line
### 🟦 Will be handled later on.
### 🔴 Can't figure out.
### ❌ Dead end / cancelled.
