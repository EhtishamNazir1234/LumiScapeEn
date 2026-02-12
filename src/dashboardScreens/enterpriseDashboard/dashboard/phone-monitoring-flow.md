## Mobile Phone Monitoring & Control Flow

This document explains how an end‑user can register their mobile phone as a virtual device, control it from the dashboard, and see its simulated energy consumption update in near real time.

---

## 1. High-level behaviour

For each authenticated user (especially **end-users**):

- They can **register their phone** as a special `Device` entry.
- A **“My Phone” card** appears on the enterprise/end‑user dashboard:
  - Shows current ON/OFF state.
  - Shows live **instant power (W)** and **total energy used (Wh / kWh)**.
  - Exposes a **Power toggle** to switch the phone ON/OFF.
- Consumption is **simulated** based on how long the phone is ON and a configurable **power rating** (default 15 W), then surfaced via a small polling loop for near real-time updates.

---

## 2. Backend: Device model extensions

**File:** `backend/models/Device.model.js`

The `Device` schema already supports categories, types, and energy metrics:

- `energyConsumption.currentUsage` – current usage (numeric)
- `energyConsumption.totalUsage` – accumulated usage
- `energyConsumption.cost` – derived cost

To support virtual phone devices controlled from the web UI, the model has been extended with:

```js
isOn: {
  type: Boolean,
  default: false
},
powerRatingW: {
  type: Number,
  default: 15 // approximate phone charging power in watts
},
lastPowerOnAt: {
  type: Date,
  default: null
},
```

- `isOn` – explicit power state, independent of `status` (`Online`/`Offline`).
- `powerRatingW` – configurable wattage used to estimate energy consumption.
- `lastPowerOnAt` – timestamp when the device was last turned ON, used to compute elapsed energy when turning OFF or when reading live consumption.

Devices representing a phone are created with:

- `category: "Other"`
- `type: "Mobile Phone"`
- `variant: "Personal Device"`
- `assignedTo: <current user id>`

---

## 3. Backend routes for phone registration & control

**File:** `backend/routes/device.routes.js`  
Base path: `/api/devices`

### 3.1 Helper: `computeLiveConsumption(device)`

Used internally to calculate live metrics without mutating the database:

- Inputs:
  - `device.energyConsumption.totalUsage` (Wh accumulated at last state change)
  - `device.isOn`
  - `device.lastPowerOnAt`
  - `device.powerRatingW`
- Logic:
  - If `isOn` and `lastPowerOnAt` are set, compute:
    - `extraWh = hoursSince(lastPowerOnAt) * powerRatingW`
  - `totalWh = baseTotalWh + extraWh`
  - `currentWatts = powerRatingW` if `isOn`, otherwise `0`
  - Simple demo cost: `cost = (totalWh / 1000) * 0.2`

Returns:

```js
{
  currentWatts, // instantaneous power
  totalWh,
  totalKwh,
  cost,
}
```

### 3.2 Register phone

**Route:** `POST /api/devices/register-phone`  
**Access:** Any authenticated user

Behaviour:

1. Check for an existing phone device:
   - `Device.findOne({ assignedTo: req.user._id, type: 'Mobile Phone' })`
   - If found → return it as-is.
2. If not found:
   - Create a new `Device` with:
     - `name`: body `name` or default `"My Phone"`
     - `serial`: generated as `PHONE-<userId>-<timestamp>`
     - `category: 'Other'`
     - `type: 'Mobile Phone'`
     - `variant: 'Personal Device'`
     - `assignedTo: req.user._id`
     - `energyConsumption` all zeroes
     - `isOn: false`, `powerRatingW` from body or default 15, `lastPowerOnAt: null`
3. Return the populated device (with `assignedTo` info).

### 3.3 Get current user’s phone with live consumption

**Route:** `GET /api/devices/my-phone`  
**Access:** Any authenticated user

Behaviour:

- Finds one device:

  ```js
  Device.findOne({
    assignedTo: req.user._id,
    type: 'Mobile Phone',
  })
  ```

- If not found: `404 "Phone device not registered"`.
- If found:
  - Compute `liveConsumption = computeLiveConsumption(device)`.
  - Return:

  ```json
  {
    ...device,
    "liveConsumption": {
      "currentWatts": number,
      "totalWh": number,
      "totalKwh": number,
      "cost": number
    }
  }
  ```

This endpoint is safe to call frequently from the frontend for near real-time updates.

### 3.4 Toggle phone power

**Route:** `PATCH /api/devices/:id/toggle-power`  
**Access:** Device owner **or** `admin` / `super-admin`

Behaviour:

1. Load the device by `id`.
2. Authorization:
   - Owner: `device.assignedTo === req.user._id`
   - Or role is `admin` / `super-admin`.
3. Determine `desiredState`:
   - From `req.body.isOn` if provided (boolean),
   - Or toggled from the current `device.isOn` otherwise.
4. Calculate accumulated energy:
   - Start from `device.energyConsumption.totalUsage` (Wh).
   - If **currently ON** and `lastPowerOnAt` is set:
     - Add `hours * powerRatingW` to `totalWh`.
   - Update `device.energyConsumption.totalUsage = totalWh`.
5. Update power state:
   - If turning ON:
     - `device.isOn = true`, `device.status = 'Online'`,
     - `device.lastPowerOnAt = now`,
     - `device.energyConsumption.currentUsage = powerRatingW`.
   - If turning OFF:
     - `device.isOn = false`, `device.status = 'Offline'`,
     - `device.lastPowerOnAt = null`,
     - `device.energyConsumption.currentUsage = 0`.
6. Update cost:
   - `device.energyConsumption.cost = (totalWh / 1000) * 0.2`.
7. Save the device and respond with:

```json
{
  ...device,
  "liveConsumption": {
    "currentWatts": number,
    "totalWh": number,
    "totalKwh": number,
    "cost": number
  }
}
```

---

## 4. Frontend services

**File:** `src/services/device.service.js`

New methods:

```js
registerPhone: async (payload = {}) => {
  const response = await api.post('/devices/register-phone', payload);
  return response.data;
},

getMyPhone: async () => {
  const response = await api.get('/devices/my-phone');
  return response.data;
},

togglePhonePower: async (id, isOn) => {
  const response = await api.patch(`/devices/${id}/toggle-power`, { isOn });
  return response.data;
},
```

These wrap the backend endpoints and are used in the dashboard UI.

---

## 5. End-user dashboard UI: My Phone card

**Files:**
- `src/dashboardScreens/enterpriseDashboard/dashboard/ActionsAndDeviceCategories.jsx`
- `src/dashboardScreens/enterpriseDashboard/dashboard/MyPhoneCard.jsx`

### 5.1 Placement

The enterprise/end‑user dashboard layout:

- `Index.jsx` → left column: `Consumptions`, right column: `ActionsAndDeviceCategories`.
- `ActionsAndDeviceCategories` stacks:
  - `CustomDropdown` (time filter)
  - `UsageProgressBar`
  - `QuickActions`
  - **`MyPhoneCard`** ← added here
  - `CustomDeviceCategories`

This makes “My Phone” part of the quick actions / control area for end-users.

### 5.2 MyPhoneCard behaviour

**File:** `MyPhoneCard.jsx`

State:

- `phone` – the phone device (or `null` if not registered).
- `liveConsumption` – `{ currentWatts, totalWh, totalKwh, cost }` from backend.
- `loading` – initial load flag.
- `saving` – during register/toggle actions.
- `error` – message to show for failures.

#### Initial load & polling

On mount:

1. Calls `deviceService.getMyPhone()` once.
2. Starts a `setInterval` (5 seconds) that refetches via `getMyPhone()`:
   - This computes live consumption server-side and updates UI.
3. Cleans up the interval on unmount.

This provides **near real-time** updates without manual refresh.

#### Register flow

If `getMyPhone()` returns 404:

- `phone` remains `null` and the card shows:
  - Explanation text.
  - **“Register My Phone”** button.

On click:

- Calls `deviceService.registerPhone()`.
- On success, stores the returned device and (if present) `liveConsumption`.
- The next polling cycles will keep consumption up to date.

#### Toggle ON/OFF

If `phone` exists:

- The card shows:
  - Phone status badge (`ON` / `OFF`).
  - Text with:
    - `formatEnergy(totalWh)` – human-readable Wh / kWh.
    - Current power in W (`currentWatts`).
    - Estimated cost.
  - A `ToggleSwitch` labelled **“Power”**:
    - `checked={phone.isOn}`.
    - `onChange={(checked) => handleToggle(checked)}`.

`handleToggle`:

- Calls `deviceService.togglePhonePower(phone._id, desiredState)`.
- On success:
  - Updates `phone` with returned device.
  - Updates `liveConsumption` with returned data.

Any errors show a small red text message above the card contents.

---

## 6. Data & control flow summary

```mermaid
flowchart LR
  user[End User] --> ui[MyPhoneCard (React)]
  ui -->|on mount + every 5s| getMyPhone["GET /api/devices/my-phone"]
  ui -->|Register My Phone| registerPhone["POST /api/devices/register-phone"]
  ui -->|Toggle Power| togglePower["PATCH /api/devices/:id/toggle-power"]

  registerPhone --> deviceDoc[Device (Mobile Phone, assignedTo=user)]
  togglePower --> deviceDoc
  getMyPhone --> deviceDoc

  deviceDoc --> liveCalc["computeLiveConsumption(device)"]
  liveCalc --> ui
```

**Key points:**

- Each user can have at most one `Mobile Phone` device assigned to them.
- Registration is idempotent: calling register again returns the existing phone.
- Energy use is simulated based on ON durations and a power rating in watts.
- The dashboard polls for live data every 5 seconds for a near real-time feel.

---

## 7. How to extend further

- **Multiple personal devices:** Generalize from a single phone to an array of virtual devices per user (e.g. tablet, laptop).
- **Custom power rating:** Expose a small form to let users override `powerRatingW` for their phone model.
- **Deeper analytics:** Feed phone consumption into the main analytics graphs by adding it to the existing `/api/enterprise/energy` and `/api/analytics/system` endpoints.
- **WebSocket real-time:** Replace polling with Socket.IO events (`device_energy_update`) emitted each time `toggle-power` is called or on a timer.*** End Patch***`
+*** End Patch

*** End PatchREADME.md***
