# CIPEM - Catalogue Formation Professionnelle 2026

Modern, interactive corporate digital catalog for CIPEM (Centre International de Perfectionnement et de Management), tailored for executive partners and clients including OLA Development and NOC.

## 🌟 Overview

This application transforms the complete 32-page 2026 training catalog into a modern, responsive, and bilingual digital experience.

- **Bilingual Interface**: Seamless instant toggle between French (Original official catalog) and English (Full international adaptation).
- **Executive Navigation**: 5 tailored Centres of Excellence + complete 39 thematic categories.
- **Search & Live Filtering**: Instant multi-keyword search across course titles, codes, categories, and delivery modes (INTER / INTRA).
- **Interactive Modals & Inquiries**: Course detail popups with pre-filled training registration inquiry forms.
- **Export & Print**: Dedicated print stylesheets for high-quality corporate PDF exports.

## 🗂️ Project Structure

```text
├── index.html              # Main HTML markup and layout
├── style.css               # Modern corporate styling and responsive design
├── app.js                  # Interactive logic, search, modals, and i18n
├── courses-data.js         # Full French catalog database (39 categories, 330+ courses)
├── courses-data-en.js      # Full English catalog database
├── Assets/
│   ├── Catalogue Formation CIPEM 2026.pdf
│   └── images/             # Official CIPEM branding and cover assets
└── .gitignore
```

## 🚀 Getting Started

Simply open `index.html` in any modern web browser or serve via any static HTTP server:

```bash
# Using python
python -m http.server 8000

# Using Node.js
npx serve .
```

---
© 2026 CIPEM. All rights reserved.
