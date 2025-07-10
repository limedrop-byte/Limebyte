# Post Pinning Feature

## Overview
The post pinning feature allows administrators to pin important posts to the top of the articles list. Pinned posts will always appear first, regardless of the selected sorting option.

## Database Schema
A new `pinned` boolean column has been added to the `posts` table:
- `pinned BOOLEAN DEFAULT FALSE NOT NULL`
- Indexed for optimal query performance

## Installation/Migration

### For Existing Databases
Run the migration to add the pinned column:
```bash
npm run migrate-pin
```

### For Fresh Deployments
The pinned column is automatically included in fresh deployments:
```bash
npm run deploy
```

## Features

### Frontend
- **Pin Indicators**: Pinned posts show a 📌 emoji before the title
- **Visual Highlighting**: Pinned posts have a subtle yellow border and background gradient
- **Consistent Display**: Pin indicators appear on both the articles list and individual post pages

### Backend API
- **Toggle Endpoint**: `PATCH /api/posts/:identifier/pin`
- **Automatic Sorting**: Pinned posts always appear first in query results
- **Backward Compatible**: Works with existing slug and ID-based post identifiers

### Admin Interface
- **Pin/Unpin Button**: Available in the admin actions on individual post pages
- **Real-time Updates**: Button text updates immediately after successful pin/unpin
- **Visual Feedback**: Success messages and loading states

## Usage

### For Admins
1. Navigate to any post page
2. Use the "Pin" or "Unpin" button in the admin actions
3. The post will immediately move to the top of the articles list

### For Visitors
- Pinned posts appear at the top with a 📌 indicator
- Posts maintain normal sorting (date/views) within pinned and unpinned groups
- Visual distinction makes important posts easily identifiable

## Technical Implementation

### Query Logic
```sql
ORDER BY p.pinned DESC, p.created_at DESC
```
- Pinned posts first (pinned DESC)
- Then sorted by selected criteria (date/views)

### Database Performance
- Dedicated index on `pinned` column
- Efficient queries even with large datasets
- No impact on existing functionality

## Dark Mode Support
- Pin indicators work in both light and dark modes
- Visual highlighting adapts to the current theme
- Consistent styling across all components 