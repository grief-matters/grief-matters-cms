---
title: People & Organization
order: 8
---

# People & Organization

## Organization (Singleton)

The Organization document controls site-wide branding — the name, logos, mission statement, and legal text that appear across the entire website. It is a **singleton**, meaning there is exactly one instance. You can edit it but cannot create a second one or delete it.

### Organization Fields

All fields are required:

| Field | Purpose |
|-------|---------|
| **Name** | The organization name |
| **Legal Name** | The full legal entity name |
| **Slogan** | Tagline displayed on the site |
| **Mission** | Mission statement (rich text) |
| **Logos** | Three logo variants: light background, dark background, and dark monochrome |
| **Copyright Notice** | Copyright text for the footer |
| **Nonprofit Notice** | Nonprofit status disclosure |
| **Small Print** | Legal text, disclaimers, and other footer content (rich text) |

## People

Person documents represent team members. Each person can have a profile that appears on the About page, and optionally a dedicated page with their personal story.

### Person Fields

| Field | Purpose |
|-------|---------|
| **Full Name** | The person's name (required). Also used to generate their page URL. |
| **Role** | Their role or title in the organization |
| **Avatar** | Profile photo (supports hotspot for smart cropping) |
| **Short Bio** | A brief biography (rich text). Should be written in **third person** (e.g., "Jane is a grief counselor...") |
| **Personal Story** | An extended personal narrative (rich text). Should be written in **first person** (e.g., "I became involved in grief support when...") |
| **Email** | Contact email (ensure you have consent before adding) |
| **LinkedIn** | LinkedIn profile URL |

### When Does a Person Get Their Own Page?

Only people who have a **Personal Story** get a dedicated page on the website at `/about/{name}`. People without a personal story still appear on the team overview page (`/about/`) but don't have individual pages.

## Person Groups

Person Groups organize people into named collections, such as "Board of Directors" or "Advisory Council."

### Person Group Fields

| Field | Purpose |
|-------|---------|
| **Name** | The group name (required) |
| **Description** | Optional description of the group |
| **Members** | An ordered list of person references (at least 1 required) |

The order of members in the list determines their display order on the website.
