# Atlas - Task List

## Refactor the codebase

Extract shared components/composables and utilize them throughout the app.

- PageLayout - replace 4 near-identical pages.
- Extract logic throughout the app into composables to avoid duplications and improve maintainability. Example of such case: auth token is appended on each api call. A `withAuth` composable could be created to handle this. There are many such cases throughout the app.
- Many components could be simplified and made more reusable leading to a more maintainable codebase.

## Migration

- Migrate to Nuxt 4.
- Migrate to Pinia as Vuex is deprecated (<https://vuex.vuejs.org>).
- Bump all packages to their latest versions.

5 - 10 days to complete both migration and refactor - mandatory before proceeding with other tasks.

## UX issues

Severity: 🔴 High (disorients / blocks core use) · 🟠 Moderate (clearly broken but workable) · 🔵 Low (cosmetic / polish)

### 🔴 UX-1 - Clicking a zoomed-in pin zooms the map back out

**Reproduce:**

1. Open `/people`.
2. Zoom all the way in on a cluster until individual pins show (zoom ~18).
3. Click one pin.
4. **Bug:** map snaps back out to zoom 12. Expected: stay at current zoom.

Video also shows UX-2 (stuck tooltip + green pin after modal close).

[video](./UX-1.mp4)

### 🟠 UX-2 - Tooltip + green pin stay stuck after closing modal when the pin is in a cluster

**Reproduce:**

1. Open `/people`.
2. Zoom all the way in on a cluster until individual pins show (zoom ~18).
3. Click a pin that, at zoom 12, falls inside a cluster.
4. Modal opens; map ends at zoom 12; the marker is absorbed into the cluster.
5. Close the modal (×).
6. **Bug:** the name-card tooltip + green pin stay floating next to the cluster bubble, with no way to dismiss them. (Does NOT repro when the pin stays standalone at zoom 12.)

Check video from UX-1.

### 🟠 UX-3 - Off-center cluster: spiderfy opens then immediately collapses

**Reproduce:**

1. Open `/people`, zoom to ~12 so a numbered cluster shows.
2. Click a cluster that is not at the center of the map.
3. **Bug:** pins fan out, then the map auto-pans to center the cluster and the spiderfy collapses back to the bubble (sidebar opens instead).
4. Counter-check: click a cluster already centered → spiderfy stays open, no collapse.

Check video from UX-1.

### 🟠 UX-4 - Cluster sidebar stays open when a person modal opens

**Reproduce:**

1. Open the "People in that cluster" sidebar (UX-3).
2. Click a person (in the list or a spiderfied pin).
3. **Bug:** the detail modal opens on top of the still-open sidebar. Closing the modal leaves the sidebar open. Is it intentional that the sidebar stays open?

Check video from UX-1.

### 🟠 UX-5 - Clicking a cluster made of two distant sub-clusters zooms to empty space between them

**Reproduce:**

1. Open /people, Europe view.
2. Click a cluster whose children are two separate groups far apart (e.g. the "74" near western France → a coastal "2" + an inland "71").
3. **Bug:** map zooms to fit both groups, centering on the empty gap between them. The two sub-clusters sit in opposite corners; the center of the screen shows nothing. Looks like the map zoomed to nowhere.
4. Counter-check: a cluster whose children are all close together zooms in fine.

**Expected behavior:** When a cluster contains two groups, the map should zoom only as much as needed for the two groups to separate into distinct clusters - and no further. At that point the two groups sit close together, near the center, clearly visible as two separate clusters the user can then click into. The user keeps their bearings and can drill down one step at a time, instead of being thrown into an empty view.

[video](./UX-5.mp4)

### 🟠 UX-6 - Mouse-wheel zoom feels sluggish

**Reproduce:**

1. Open any map page.
2. Zoom using the +/− buttons → instant.
3. Now zoom using the mouse wheel / trackpad.
4. **Bug:** wheel zoom is laggy. Inconsistent with the buttons.

[video](./UX-6.mp4)

### 🟠 UX-7 - Accordion opens from title but won't close from title

**Reproduce:**

1. Open `/people` (or any page with filters).
2. Open the filter panel.
3. Click an accordion section's **title row** → it opens.
4. Click the same title row again.
5. **Bug:** nothing happens. Only clicking the tiny chevron icon closes it.

[video](./UX-7.mp4)

### 🟠 UX-8 - Mobile navigation menu can't be closed without picking a link

**Reproduce:**

1. Open `/people` on a mobile-width screen.
2. Open the navigation menu (hamburger, bottom-right).
3. **Bug:** there's no close (✕) button and no tap-outside-to-close. The only way out is to select a link. A user who just wanted to peek is stuck.

[video](./UX-8.mp4)

### 🔵 UX-9 - No loading feedback when applying filters

**Reproduce:**

1. Open any map page and open the filter panel.
2. Select a filter and apply it (preferably throttle network in DevTools to make it slow).
3. **Bug:** no spinner / overlay during the request. The page looks frozen until results swap in.

[video](./UX-9.mp4)

### 🔵 UX-10 - Modals can't be closed with Esc, no focus trap

**Reproduce:**

1. Open any map page.
2. Click a pin to open a detail modal.
3. Press Esc key on your keyboard.
4. **Bug:** nothing happens. Only the small × in the header closes it. Tab focus is also not trapped inside the modal.

### 🔵 UX-11 - Name list sorts caps before lowercase (looks like two alphabets)

**Reproduce:**

1. Open `/people`.
2. Look at the directory list panel.
3. **Bug:** all-caps names (`ALEXIS KONIDIS`, `ANTONIO …`) appear before normal-case names (`Abdennadher Jihene`). Looks like two separate alphabetical lists.

![UX-11](./UX-11.png)

### 🔵 UX-12 - Layout visibly jumps when resizing between desktop and mobile

**Reproduce:**

1. Open `/people`.
2. Slowly resize the browser window from wide to narrow.
3. **Bug:** the section `Filters` and `List view` panels rearrange from the desktop layout to the mobile layout on screen - bars slide and restack visibly instead of switching cleanly.

[video](./UX-12.mp4)

### 🔵 UX-13 - About panel looks outdated and misaligned

**Reproduce:**

1. Open the About / Welcome panel.
2. **Bug:** centered title + centered intro mixed with left-aligned bullet text; the intro paragraph starts lowercase (your comprehensive guide…), reading like a broken sentence. Feels unfinished.

![UX-13](./UX-13.png)

### 🔵 UX-14 - Modal header alignment and stray scrollbar

**Reproduce:**

1. Open `/people` (or any page) and click a pin to open a detail modal.
2. **Bug 1:** the close (✕) button is not vertically aligned with the heading - it sits higher than the title text instead of centered against it.
3. **Bug 2:** vertical and horizontal scrollbars show in the modal body even when the content fits and there's nothing to scroll.

![UX-14](./UX-14.png)

## Enhancements

### E-1 - Show result count next to each filter value

**Problem:** Filter values render a label only. No count of matching results. Users can't tell how many items a value yields, and can pick a filter that returns 0 with no warning.

**Desired:** each checkbox shows a count e.g. `Professional (42)`. Ideally counts recompute against the currently-active filter set.

**Note:** This might require backend changes to support counting filtered results.

### E-2 - Add a "Clear all filters" button

**Problem:** Users have to manually clear each filter one by one. There's no way to reset to the initial state.

**Desired:** Add a "Clear all filters" button that resets all filters to their default state.

### E-3 - Filters not added as query parameters

**Problem:** Filters are not added as query parameters, so users can't share a link with specific filters applied.

**Desired:** Add filters as query parameters so users can share a link with specific filters applied.
