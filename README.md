# Zorvyn Finance Dashboard API

An enterprise-grade robust backend designed strictly around a Role-Based Access Control (RBAC) model allowing users to manage financial records, analyze summaries, and enforce strict security rules safely via APIs.

## 🏗 Architecture Details
This backend emphasizes separation of concerns logic adhering strictly to a Model-View-Controller (MVC) and Services pattern.

### Separation of Concerns Design
*   **Routing Layer**: Dedicated to explicitly defining URL paradigms and integrating Express middlewares (Rate Limiting, Authorization parsing).
*   **Controller Layer**: Exclusively responsible for parsing HTTP input/params and managing exact JSON Response generation. 
*   **Validation Layer** (`validations.js`): Intercepts bad API payloads aggressively utilizing `zod` before any controller attempts database logic operations.
*   **Service Layer** (`services.js`): Heavily complex business rules (e.g., extensive MongoDB Analytics aggregations) are stripped completely out of the HTTP controllers and centralized in static class services, making them easily callable by automated scripts or secondary routes if necessary.
*   **Models**: Standard `mongoose` schemas strictly managing default states alongside indexing hooks.

## 🔒 Tradeoffs and Assumptions Made
* **Soft Deletions**: Deleting historical financial records is typically a bad idea (e.g., auditing mismatches). The decision was made to use `isDeleted` flag modifications rather than permanently erasing the document. 
* **Authentication Method**: We heavily favored robust **`httpOnly` JSON Web Tokens** stored strictly within encrypted cookies, rather than standard Header-Attached Bearer Tokens. This explicitly blocks the possibility of Cross-Site Scripting (XSS) attacks compromising user credentials.
* **Database Aggregations**: We specifically assumed scaling analytics using `$lookup` and `$group` within the MongoDB service processor is significantly more performant than running `.find` iterations inside Node.js itself.

## 🚀 Setup & Installation
1. Guarantee Node Version `>= 18.0`.
2. Extract the codebase and install packages natively via `npm install`.
3. Create a basic `.env` folder mirroring standard Mongoose configurations:
   ```env
   PORT=3000
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=super_secret_fallback_key
   ```
4. Run locally with `node index.js`.

**Testing Suite:** `npm test` runs basic Jest checks confirming `authMiddleware` gracefully handles arbitrary failures securely.

## 📖 Endpoint Summary Documentation
Please review `API_DOCS.md` for specific payload documentation.

* `/api/users/register` [POST] -> Creates the bootup 'ADMIN' dynamically.
* `/api/users/login` [POST] -> Validates Passwords, generates JWT.
* `/api/records/` [GET | POST] -> Handles Fetching and Pagination with RegEx `search` support. (Admin strictly limits writes).
* `/api/records/summary` [GET] -> Dispatches Service layer aggregation computations.
