[README.md](https://github.com/user-attachments/files/31853421/README.md)
# Gift4Joy Online Store



Gift4Joy is a South African e-commerce store for kidswear, hoodies, T-shirts, sunglasses, and lifestyle products. This repository contains the **website**, a **mobile-app prototype** (responsive PWA), Task 1 documentation, and automated checks.



The project follows the WIL plan for Innovatech Solutions / Gift for Joy: customers browse a catalogue, manage a wishlist and cart, check out, and track orders. Staff use an admin dashboard for products, stock, and reports.



## Open the site



No build step is required for the pages.



1. Open `index.html` in a browser, **or**

2. From this folder run a local server so cart/wishlist storage and tests behave consistently:



```bash

npx --yes serve .

```



Then visit `http://localhost:3000`.



Mobile prototype: open `mobile/index.html` or resize the browser below 768px.



## Folder structure



```text

gift4joy/

├── index.html              Home

├── pages/                  Catalogue, product, cart, checkout, account, admin

├── mobile/                 App-style shell with bottom navigation

├── css/                    Shared styles

├── js/                     Products, cart, auth, layout

├── assets/                 Brand graphics

├── docs/                   Task 1 document (plan, sitemap, wireframes)

├── tests/                  Automated site checks

└── .github/workflows/      CI test run

```



**Do not submit a zip.** Push this repository to GitHub and share the repo URL.



## Team allocation (Task 1)



| Member | Role | Deliverable |

| --- | --- | --- |

| Iviwe | Project manager | Updated project plan, DevOps lifecycle, GitHub process |

| Muhle | Research analyst | Catalogue copy, audience messaging, sitemap content |

| Owami | Creative designer | Visual identity, web and mobile wireframes, page layout |

| Yanga Matyolo | Lead developer | HTML/CSS/JS site, mobile prototype, automated tests |

| Amanda Mthethwa | Secretary | Task 1 document structure, README, submission checklist |



## Automated testing



```bash

npm test

```



If Node.js is not installed yet, run:



```powershell

powershell -File tests/check-site.ps1

```



The checks confirm required pages exist, navigation and README are present, and HTML files include titles, headings, and images.



## Task 1 document



Open [`docs/task1-document.html`](docs/task1-document.html) and print to PDF for Learn. Headings are in the required order: Cover Page, Table of Contents, List of figures, Update Project Plan, Site Map, Wireframes.

