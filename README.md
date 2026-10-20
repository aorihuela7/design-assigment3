# Pack Again

Pack Again is a packing list for trips you take again and again: a weekend at your parents', a conference, a beach weekend. If you rebuild the same list from memory each time and forget the same things, Pack Again keeps the list for you. Open it, tick items off as you pack, add anything you forgot for next time, and find the list ready when the next trip comes around. There's no account and nothing to set up: three starter lists are there on your first visit.

Live: https://design-assigment3.vercel.app

## Flows

First visit, main task, coming back. Notes: [flows.md](flows.md).

```mermaid
flowchart TD
  subgraph first["First visit"]
    direction TB
    A1(["Open Pack Again"]) --> A2["Loading your lists…"]
    A2 --> A3{"Lists saved in<br/>this browser?"}
    A3 -- "None yet" --> A4["3 starter lists appear<br/>nothing asked first"]
    A3 -- "Yes" --> A7
    A3 -- "Can't read them" --> A5["Copy kept, start fresh<br/>No lists yet · Add the starter lists back"]
    A3 -- "Browser not saving" --> A6["Lists work, with a banner:<br/>this browser isn't saving"]
    A4 --> A7["My trips<br/>ticket cards, newest first"]
  end

  subgraph main["Main task"]
    direction TB
    B1["My trips"] -- "Open a card" --> B3["Packing list<br/>sticky bar: count and plane"]
    B1 -- "New trip type" --> B2["Trip name<br/>empty · duplicate · too long"]
    B2 -- "Create list" --> B3
    B3 -- "Add item" --> B4["Added X to Section<br/>or an error under the field"]
    B4 --> B3
    B3 -- "Remove" --> B5["Removed X · Undo"]
    B5 --> B3
    B3 -- "Tick every item" --> B6["All packed. Have a good trip."]
    B6 -- "Forgot something?" --> B7["Saved as packed and New,<br/>for next time"]
    B8(["Old or wrong link"]) --> B9["List not found<br/>Back to My trips"]
  end

  subgraph back["Coming back"]
    direction TB
    C1(["Come back before the next trip"]) --> C2["My trips<br/>Last packed · N new since last trip"]
    C2 -- "After 2+ days away" --> C3["Welcome back.<br/>N lists ready to pack again."]
    C2 -- "Forgot something? Add it" --> C7["List opens with<br/>Add item focused"]
    C2 -- "Open the list" --> C4{"Packed over 2 days ago<br/>and still ticked?"}
    C4 -- "Yes" --> C5["Packing for a new trip?<br/>Clear ticks · Keep them"]
    C4 -- "No" --> C8["The list as you left it"]
    C5 -- "Clear ticks" --> C6["Ready to pack again<br/>New items listed first"]
    C5 -- "Keep them" --> C8
  end

  %% Invisible links stack the three flows top to bottom.
  first ~~~ main
  main ~~~ back
```

## Run it locally

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000. `npm run check:contrast` checks the color contrast of every pair the app uses.

## First-run check

An AI agent used the live app as a first-time user, judging only from the screen: first visit, adding items (including an empty submit and a duplicate), ticking, removing, finishing a list, adding something forgotten, coming back in a new tab and a new browser session, at 1440px and 390px, and once with the keyboard only. It had built the app itself, so it wasn't a truly fresh user; treat this as a first pass before testing with people.

**Summary.** Useful within about 5 seconds and two clicks, with no sign-up and realistic starter lists. You always know where you are, errors appear under the field and keep what you typed, ticks don't rely on color, the lists are remembered across tabs and browser restarts, and the keyboard flow works. The weak spots were feedback you can't see and changes you can't take back.

**The 5 problems, most severe first**

1. **Removing was instant and permanent.** After a removal, the next row's Remove slid under the pointer, so a second click deleted another item.
2. **The "forgot last time" memory was fragile.** Unticking and re-ticking any item in a fully packed list erased every New mark, so "N new since last trip" never showed.
3. **"All packed" appeared off screen.** It showed at the top of the page while you ticked the last item at the bottom.
4. **No visible confirmation when adding.** An item added to a section further down appeared off screen; the "Added" message was only for screen readers.
5. **Errors didn't say what to do and lingered.** "Sunscreen is already in Toiletries" gave no next step, and old errors stayed on screen after moving on.

**What I changed**

| Problem | Decision | What changed |
|---|---|---|
| 1. Permanent removal | Fixed | "Removed Socks." with an Undo button, until your next change. Undo puts the item back in its place. |
| 2. New marks erased | Fixed | New marks now clear only when the next trip is packed (after Clear ticks), not when you re-tick within the same trip. |
| 3. Success off screen | Fixed | The count, plane and "All packed" sit in a bar that sticks to the top as you scroll. |
| 4. No add confirmation | Fixed | The bar shows "Added Sunglasses to Other" on screen, not only to screen readers. |
| 5. Errors | Fixed | "…is already in Toiletries. Tick it there or use another name". Errors clear when the form changes or you leave an empty field. |
| On phones the form sits above the list | Left for now | The list is reachable by scrolling and the bar shows progress; collapsing the form is a bigger layout change. |
| Item names can't be edited | Left for now | Remove and add again works, and Undo makes removing safe. Editing would add a form state to every row. |
| Extra Tab stop after opening a list with Enter | Left for now | Seen only in headless Chrome; needs checking in a real browser first. |
| Confusing copy ("New trip type", codes like WEP) | Left for now | Worth a wording pass with real users rather than guessing. |

## What it remembers

Everything stays in your browser's local storage under `pack-again:v1`: your lists, their items and sections, which items are ticked or marked New, when each list was last packed, when you cleared the ticks, and whether you answered "Packing for a new trip?". If saved data can't be read, a copy is kept under `pack-again:backup` before starting fresh.

Nothing leaves your device: no account, no server, no analytics, and the fonts are bundled with the app. Lists don't sync to other browsers or devices, and clearing your browser's site data deletes them.
