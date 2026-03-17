# Workshop Manifest Integration

## Summary

Workshops are now included in the `manifest.json` file, just like documents! This allows external consumers to access workshop data through a unified API.

## Changes Made

### 1. Updated `initializeManifest()` function
- Added `workshops: []` to the initial manifest structure

### 2. Updated `regenerateManifestFromDB()` function
- Now fetches workshops from the database
- Includes workshop data in the manifest with the following structure:
  ```json
  {
    "id": 1,
    "title": "Workshop Title",
    "description": "Workshop content/description",
    "date": "2024-01-15T10:30:00.000Z",
    "images": ["/workshop-imgs/image1.jpg", "/workshop-imgs/image2.jpg"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "createdBy": "admin"
  }
  ```

### 3. Updated Workshop Endpoints
All workshop CRUD operations now regenerate the manifest automatically:
- **POST /api/admin/workshops** - Creates workshop and regenerates manifest
- **PUT /api/admin/workshops/:id** - Updates workshop and regenerates manifest
- **DELETE /api/admin/workshops/:id** - Deletes workshop and regenerates manifest

## Manifest Structure

The `manifest.json` file now has this structure:

```json
{
  "policy": [],
  "project-readiness": [],
  "templates": [],
  "deliverable": [],
  "workshops": [],
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

## Workshop Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | Number | Workshop ID (auto-incrementing) |
| `title` | String | Workshop title |
| `description` | String | Workshop content/description (mapped from `content` field) |
| `date` | ISO Date String | Creation date (from `created_at` field) |
| `images` | Array of Strings | Array of image URLs (prefixed with `/workshop-imgs/`) |
| `createdAt` | ISO Date String | Creation timestamp |
| `createdBy` | String | Username of admin who created the workshop |

## API Access

### Get the Manifest
```bash
GET /docs/manifest.json
```

Returns all documents and workshops in a single JSON file.

### Public Workshop APIs (Still Available)
```bash
# Get all workshops
GET /api/workshops

# Get single workshop
GET /api/workshops/:id
```

### Admin Workshop APIs (Require Authentication)
```bash
# Create workshop
POST /api/admin/workshops

# Update workshop
PUT /api/admin/workshops/:id

# Delete workshop
DELETE /api/admin/workshops/:id
```

## Usage Examples

### 1. Fetching Workshop Data from Manifest

```javascript
// Fetch the manifest
const response = await fetch('/docs/manifest.json');
const manifest = await response.json();

// Access workshops
const workshops = manifest.workshops;

// Display workshops
workshops.forEach(workshop => {
  console.log(`Title: ${workshop.title}`);
  console.log(`Description: ${workshop.description}`);
  console.log(`Date: ${workshop.date}`);
  console.log(`Images: ${workshop.images.length}`);
});
```

### 2. Creating a Workshop

```javascript
// Create workshop via admin API
const formData = new FormData();
formData.append('title', 'Climate Finance Workshop');
formData.append('content', 'This workshop covers climate finance fundamentals...');
formData.append('images', file1); // Upload up to 10 images
formData.append('images', file2);

const response = await fetch('/api/admin/workshops', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

// Manifest is automatically regenerated after this!
```

### 3. Accessing Workshop Images

```javascript
// Images are served with the workshop-imgs prefix
const workshop = manifest.workshops[0];

workshop.images.forEach(imgUrl => {
  // imgUrl will be like: /workshop-imgs/workshop-12345-abc.jpg
  const fullUrl = imgUrl; // Ready to use directly
  console.log(fullUrl);
});
```

## Benefits

1. **Unified Access**: All content (documents + workshops) in one place
2. **Automatic Sync**: Manifest auto-updates on any workshop change
3. **Image URLs Pre-formatted**: Image paths are already prefixed and ready to use
4. **Backward Compatible**: Existing document structure unchanged
5. **Consistent Data**: Same update mechanism as documents

## Notes

- The manifest is regenerated on:
  - Server startup
  - Document upload/delete
  - Workshop create/update/delete
- Workshops are ordered by `created_at` (newest first)
- Images are limited to 10 per workshop
- All image paths in the manifest are prefixed with `/workshop-imgs/`
- Workshop `description` field maps to the database `content` field
