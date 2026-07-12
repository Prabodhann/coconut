# Filter & UI Enhancements

## Goal
Implement a multi-select category filter that dynamically computes available categories based on the active Veg/Non-Veg preference. Apply device-specific visibility rules (FAB on mobile, inline list on desktop). Introduce modern UX enhancements (glassmorphism, micro-animations, empty states), add a "warming up" UI for cold backend starts on Render, and clean up temporary migration scripts.

## Proposed Changes

### 1. State Management & Filtering Logic
- **Multi-select Categories:** Change `category` state from `string` to `string[]` (an array of selected categories) in `StorefrontPages.tsx`. If the array is empty, it means "All" categories are selected.
- **Dynamic Category Derivation:** Both the mobile modal and the desktop list will iterate through `foodList` and the active `isVegOnly` filter to deduce which categories actually contain items. Empty categories will be hidden.

### 2. Device-Specific UI
- **Mobile (`md:hidden`):** The FAB (Floating Action Button) will remain, but the modal will be updated to handle multi-select (e.g. clicking a category adds it to a list, showing a checkmark).
- **Desktop (`hidden md:block`):** Reintroduce `ExploreMenu.tsx` as a sleek, horizontal list of interactive chips/pills at the top of the food display.

### 3. UX Enhancements (The "Pro" Touch)
- **Glassmorphism:** Apply backdrop blurs to the mobile filter modal (`backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80`) and the top navigation bar for a modern, OS-level feel.
- **Micro-animations:** 
  - Add a smooth, subtle hover lift to `FoodItem.tsx` (`hover:-translate-y-1 hover:shadow-xl transition-all duration-300`).
  - Animate the selection checkmarks in the category filters.
- **Empty States:** When a filter combination yields zero results, show a beautifully designed empty state with a friendly illustration (using Lucide icons) instead of plain text, and a quick "Reset Filters" button.

### 4. Cold Start "Warm-up" UI
- Since the backend is hosted on Render and sleeps after inactivity, the initial load can take ~30-50 seconds.
- I will implement a **Smart Loader** in `FoodDisplay.tsx`:
  - If loading takes less than 3 seconds (server is awake), it shows a standard skeleton loader.
  - If loading takes > 3 seconds, it dynamically transforms into a **"Waking up the Kitchen"** animated screen.
  - This screen will feature a sleek Framer Motion animation (e.g., an oven heating up or chef preparing), friendly text explaining that the server is waking up, and a 30-40 second countdown progress bar so the user knows exactly what to expect.

### 5. Code Cleanup
- **DELETE** `backend/fetch_foods.js`
- **DELETE** `backend/migrate_db.js`

## Open Questions
- For the desktop menu, do you prefer small pill-shaped chips (like YouTube tags), or larger square cards with images (like the original design)? I propose the pill-shaped chips as they are cleaner for multi-select, but let me know your preference!

## Verification Plan
1. Test multi-select logic on desktop and mobile.
2. Verify that clicking "Veg Only" hides categories that only contain non-veg items.
3. Confirm the FAB is hidden on desktop and the desktop menu is hidden on mobile.
4. Simulate a long loading state (using a timeout) to verify the new "Warm-up" UI and countdown timer work perfectly.
5. Verify files are deleted.
