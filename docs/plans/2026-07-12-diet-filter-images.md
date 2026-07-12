# UI & Image Enhancements (Phase 2)

## Goal
Implement a 3-way diet toggle ("All", "Veg", "Non-Veg") across both mobile and desktop menus, and replace a batch of generic/duplicate images with ultra-realistic, 4K food photography.

## Proposed Changes

### 1. Three-Way Diet Filter
- **State Update:** Change the `isVegOnly: boolean` state to `dietFilter: "All" | "Veg" | "Non-Veg"` in `StorefrontPages.tsx`.
- **Desktop UI (`ExploreMenu.tsx`):** Replace the current "All / Veg Only" toggle with a sleek 3-segment pill control.
- **Mobile UI (`FilterMenu.tsx`):** Add a similar 3-tab selector inside the mobile filter modal.
- **Filtering Logic (`FoodDisplay.tsx` & Menus):** Update the category deduction and food filtering logic so that:
  - `"Veg"` strictly shows items where `isVeg === true`.
  - `"Non-Veg"` strictly shows items where `isVeg === false`.
  - `"All"` shows everything.

### 2. High-Quality 4K Image Generation
Since generating 80+ images at once is heavily rate-limited and time-consuming, I will generate a new batch of **10 highly unique, photorealistic 4K images** for the most commonly confused/duplicate items across different categories.

**Targeted Items for this batch:**
1. Kachumber Salad
2. Indian Onion Salad
3. Chicken Kathi Roll
4. Veg Roti Roll
5. Bombay Sandwich
6. Paneer Tikka Sandwich
7. Masala Pasta
8. Hakka Noodles
9. Gulab Jamun
10. Aloo Gobi

*(Note: For these 10 items, I will generate the images, upload them to Cloudinary via a script, and update the MongoDB database. For the rest of the menu, we can do further batches later!)*

## Open Questions
- Does the list of 10 items for the image generation batch look good to you, or are there specific items you noticed that look particularly bad/duplicated that I should prioritize instead?

## Verification Plan
1. Test the 3-way filter on Desktop. Ensure clicking "Non-Veg" hides Veg items and empty categories.
2. Test the 3-way filter on Mobile.
3. Generate the 10 images and verify they appear in the UI and look like authentic 4K food photography.
