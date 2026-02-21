---
title: Images & Accessibility
order: 9
---

# Images & Accessibility

Images play an important role on the website, and good image practices make the site more accessible and visually appealing.

## Alt Text

Alt text is **required** on all images and is critical for accessibility. Screen readers read alt text aloud to visually impaired users, and it appears when images fail to load.

### Writing Good Alt Text

- **Do** describe what's meaningful about the image in the context it's used
- **Do** keep it concise but descriptive
- **Don't** start with "image of," "photo of," or "photograph of" — the system already knows it's an image. You'll see a warning if you do this.
- **Don't** leave it blank — it's a required field for a reason

**Good:** "A family sitting together in a garden, smiling"
**Avoid:** "Photo of a family sitting together in a garden, smiling"

## Hotspot

When you upload an image, you can set a **hotspot** — the focal point that should stay visible when the image is cropped at different sizes. The website displays images at various aspect ratios depending on context, and the hotspot ensures the important part of the image is always visible.

To set a hotspot, click on the image after uploading and drag the focal point to the most important area.

## Image Sources

The **Image Source** field tracks where an image came from for licensing compliance. You'll see a warning if you leave this empty. Keeping track of image sources helps ensure the organization has the right to use every image on the site.

## Image Collections

Image Collections are groups of images used as **fallback images**. When a resource or category doesn't have its own image, the website uses an image from a collection instead. This ensures the site always has visual content even when individual items lack images.

### Image Collection Fields

| Field | Purpose |
|-------|---------|
| **Title** | Name of the collection (for Studio organization) |
| **Images** | Array of images with alt text |

## Technical Details

You generally don't need to worry about these — the website handles them automatically:

- Images are served in responsive sizes (from 320px to 2500px wide) to optimize loading speed
- WebP, JPG, and PNG formats are supported
- Crop and hotspot data from Sanity is respected in the final rendering
- The default aspect ratio is 7:5, with 1:1 (square) used in some contexts
