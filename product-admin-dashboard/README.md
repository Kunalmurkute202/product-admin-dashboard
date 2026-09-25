# Product Admin Dashboard

This is a Next.js (App Router) product management dashboard built with React, Tailwind CSS, and Axios, using the DummyJSON API.

## Setup Steps
1. Clone the repository.
2. Run `npm install` to install dependencies (Axios, Lucide React).
3. Run `npm run dev` to start the development server.
4. Open `http://localhost:3000` in your browser.
5. Log in using `emilys` and `emilyspass`.

## Finished Features
* [x] Login page with error handling and protected routes.
* [x] Shared Axios instance for token injection and global error handling.
* [x] Responsive product list (desktop table, mobile cards).
* [x] Custom URL-synced pagination (10/20/50 page sizes).
* [x] Debounced search, category filtering, and sorting synced to the URL.
* [x] Product details page with image gallery and reviews, plus a custom 404 page.
* [x] Add, edit, and delete functionality with form validation and confirm modals.
* [x] Comprehensive loading, empty, and error states with retry functionality.
* [x] Protection against rapid multi-clicks and race conditions.

## Explanation of Choices
* **API Limitation (Search & Category):** The DummyJSON API cannot search and filter by category simultaneously. To handle this, I made the inputs mutually exclusive. If a user selects a category, the search bar clears. If they type a search, the category resets to "All".
* **Mock Mutations (Add/Edit/Delete):** Because DummyJSON does not permanently save POST/PUT/DELETE requests, I used **Local State Patching**. Upon a successful mock API response, the React state array is manually updated (e.g., prepending the new product or filtering out the deleted ID) so the UI reflects the changes instantly without triggering a re-fetch that would erase them.

## Problem Faced & Fixed
**Problem:** When typing rapidly in the search bar, older delayed API responses could resolve after newer ones, causing the UI to display outdated results (race conditions). 
**Fix:** I implemented an `AbortController` inside the `useEffect` hook. Whenever the URL parameters change before a fetch completes, the cleanup function triggers `controller.abort()`, canceling the previous Axios request and ensuring only the most recent search data is rendered.

## AI Usage
I used an AI assistant as a thought partner to help structure the Next.js App Router layout, design the Tailwind CSS responsive table, and implement the AbortController logic for handling race conditions. I understand the implementation of all generated code and customized it to fit the specific assignment edge cases.