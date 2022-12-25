
[![GitHub stars](https://img.shields.io/github/stars/siniradam/equal.place.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/siniradam/equal.place/stargazers/)
[![GitHub followers](https://img.shields.io/github/followers/siniradam.svg?style=social&label=Follow&maxAge=2592000)](https://github.com/siniradam?tab=followers) 

# equal.place
Just another [nostr](https://github.com/nostr-protocol/nostr) web client built on SvelteKit. 

>You don't know what nostr is? [I can try to explain like you are five](https://gist.github.com/siniradam/73cf670871228daeaeeb7593c6d26999).

![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge) 
![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Libraries used
- sveltekit
- tailwind
- dicebear - Handsome avatars
- noble/secp256k1 - Key generation



## Important
This is a project in progress. Some features aren't implemented.


# Changes
- All profiles are now stored in indexedDB
- Platform icon is displayed if exists.
- Settings page added. (Not stored)
- Relay status icons (testing)

# In progress
- User settings
- Bech32
- Storing; relays, notes, rooms ...

# Next
- change setXXX function format to "ON" format.

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

---
If you add to your stars, you would make me happy!
