# Pack Again

Packing lists for trips you repeat. Pick a trip type, tick items off as you pack, and find the list waiting for you before the next trip. Data stays in your browser (localStorage).

## Flows

Source and notes: [flows.md](flows.md).

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

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.
