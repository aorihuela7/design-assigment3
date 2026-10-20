# Flows

First visit → main task → coming back. Routes: `/` My trips, `/trips/new` New trip type, `/trips/[id]` Packing list.

```mermaid
flowchart TD
  subgraph first["First visit"]
    Open(["Open Pack Again"]) --> Loading["Loading your lists…<br/>same on server and first render"]
    Loading --> Read{"Read pack-again:v1"}
    Read -- "Key missing" --> Seed["Create 3 starter lists<br/>Weekend at parents', Conference trip, Beach weekend"]
    Read -- "Storage blocked" --> Banner["Banner: this browser isn't saving"]
    Banner --> Seed
    Read -- "Unreadable" --> Backup["Copy raw data to pack-again:backup<br/>Notice: we kept a copy and started fresh"]
  end

  Read -- "Valid" --> Home
  Seed --> Home
  Backup --> NoLists

  Home["/ My trips<br/>cards sorted by last used<br/>progress · last packed · N new since last trip"]
  Home -- "Deleted every list" --> NoLists["No lists yet<br/>New trip type · Add the starter lists back"]
  NoLists --> Home

  subgraph main["Main task"]
    NewTrip["/trips/new<br/>Name field"]
    NewTrip -- "Enter a name · already exists · too long" --> NewTrip
    NewTrip -- "Saved" --> EmptyList["Empty list<br/>Add item field focused"]
    EmptyList -- "Add first item" --> Packing

    Exists{"List exists?"}
    Exists -- "No" --> NotFound["This list doesn't exist anymore<br/>Back to My trips"]
    Exists -- "Yes" --> Gap{"Fully packed more<br/>than 2 days ago?"}
    Gap -- "No" --> Packing["Packing<br/>sections: Clothes, Toiletries, Tech, Documents, Other<br/>7 of 15 packed"]
    Packing -- "Tick / untick · remove item · Clear all ticks" --> Packing
    Packing -- "Add item: name + section<br/>Enter an item name · already in section · too long" --> Packing
    Packing -- "Every item ticked" --> AllPacked["All packed. Have a good trip.<br/>save lastPackedAt · clear New marks"]
  end

  Home -- "New trip type" --> NewTrip
  Home -- "Open a card" --> Exists
  NotFound --> Home

  subgraph back["Coming back"]
    AllPacked -- "Forgot something? Add it for next time" --> Forgot["Item saved and marked New"]
    Forgot --> AllPacked
    Return(["Come back before the next trip"]) --> Loading
    Gap -- "Yes" --> Prompt["Packing for a new trip?<br/>Clear ticks · Keep them"]
    Prompt -- "Clear ticks<br/>New items shown first in their section" --> Packing
    Prompt -- "Keep them" --> AllPacked
  end

  AllPacked -- "Back to My trips" --> Home
```

## Notes

- Starter lists are created only when the key is missing, never over unreadable data.
- An item added from "Forgot something?" is saved as already packed, so the list stays "All packed" for the trip you just took. It shows as New until the list is fully packed again.
- The "new trip?" prompt depends on today's date, so it is decided only after the page mounts.
- The Add item section starts on the last section picked on that page (not stored).
