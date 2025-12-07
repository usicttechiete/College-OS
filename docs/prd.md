Below is a **complete, professional PRD (Product Requirements Document)** for your **College Lost & Found Web App**, including **User Stories, Functional Requirements, Non-Functional Requirements, Frontend Implementation Plan, Backend Implementation Plan, APIs, Data Models, and Acceptance Criteria**.

This is written like a real industry PRD used by PMs + developers.

---

# 📘 **PRODUCT REQUIREMENTS DOCUMENT (PRD)**

## **College Lost & Found Web App (Mobile-First PWA)**

### Version 1.0 — Detailed PRD, User Stories, Frontend & Backend Architecture

---

# 1. **Product Overview**

The **College Lost & Found Web App** is a mobile-first Progressive Web App designed for college students to quickly report lost items, post found items, browse found items, and communicate with each other to return belongings. It features a **top app bar** (branding + user picture) and a **bottom navigation bar** with **Home, Found, Messages, Account**.

The system ensures **trust, safety, speed, real-time communication**, and **anti-fraud verification**.

---

# 2. **Goals & Objectives**

### Primary Goals

* Make it **fast and easy** for any student to report lost or found items.
* Reduce the number of permanently lost items on campus.
* Create a **trust-based community** around honesty and helpfulness.
* Replace WhatsApp and scattered college groups with one clean platform.

### Secondary Goals

* Provide analytics to the student cell.
* Increase digitization of campus operations.
* Handle disputes fairly.

---

# 3. **User Personas**

### **1. Riya (General Student)**

* Loses ID cards often.
* Wants quick submission & notifications.

### **2. Arjun (Finder)**

* Finds items frequently.
* Wants easy posting & proof-based return.

### **3. Student Cell / CR**

* Needs moderation panel.
* Manages disputes and flagged posts.

---

# 4. **Key Features**

### **Top Bar**

* Branding (College Name / Logo)
* User Profile icon → dropdown: Profile, Settings, Logout, etc.
* Notification

### **Bottom Navigation**

* **Home**
* **Found**
* **Messages**
* **Account**

### **Home**

* CTA: *Raise Lost Query*
* CTA: *Post: I Found a Product*
* Recent achievements (successful returns)
* Policies/warnings
* Notifications icon

### **Found Page**

* Grid/list of found items
* Filters (date, category, building)
* Item detail page → Message finder, Claim item

### **Messaging**

* Real-time chat (socket)
* Share photos
* Verified meet-up suggestions

### **Account Page**

* Profile details
* Stats (trust score)
* My Lost Queries
* My Found Posts
* Theme settings
* Logout

### **Verification & Trust System**

* Claim Verification flow
* Ratings & feedback
* Trust score increase on successful returns

### **Admin Panel**

* Approve flagged posts
* Handle disputes
* Export analytics

---

# 5. **User Stories**

## **5.1 Students (Primary Users)**

### **Lost Item**

1. **As a student, I want to report a lost item** so that others can help me find it.
2. **As a student, I want to upload photos or write descriptions** to improve match accuracy.
3. **As a student, I want suggestions for matching found posts automatically** so I don’t have to search manually.
4. **As a student, I want notifications when someone finds something similar** so I can quickly act.

### **Found Item**

5. **As a student, I want to post found items easily** so the owner can claim them.
6. **As a student, I want to hide personal contact info** until I verify the claimant.
7. **As a student, I want to hand over items safely** via a verification step.

### **Messages**

8. **As a user, I want real-time chat** for faster coordination.
9. **As a user, I want to share photos in chat** for verification.

### **Account**

10. **As a user, I want to update my profile** so I look trustworthy.
11. **As a user, I want to track my lost & found history.**

---

## 5.2 **Admin / Student Cell**

12. **As an admin, I want to view reported posts or users** to address abuse.
13. **As an admin, I want to resolve disputes** between users.
14. **As an admin, I want analytics** about frequent lost items, hotspots.

---

# 6. **Functional Requirements**

## **6.1 Authentication**

* Signup with:

  * Name
  * Email
  * Password
  * Enroll No
  * Batch
  * Branch
  * Profile picture
* Login with email + password.
* Email verification (optional first release).
* Session management (JWT + refresh token).

---

## **6.2 Home Screen**

* Show two primary CTAs:

  * Raise Lost Query
  * Post: I Found a Product
* Show recent successful returns.
* Show warnings.
* Show small notifications bubble.

---

## **6.3 Lost Query Module**

* User can create a new lost item entry.
* Fields:

  * Title
  * Category
  * Photos
  * Where lost
  * When lost
  * Description
  * Reward (optional)
* API returns similar found items (auto-match).

---

## **6.4 Found Item Module**

* User can create a found item post.
* Fields:

  * Photos
  * Category
  * Where found
  * When found
  * Condition
  * Submission type: (Keep with me / Submit to desk)
* Visible on Found Page.

---

## **6.5 Found Page**

* Browse all found items.
* Filters by category/date/location.
* Item Detail page:

  * Photos
  * Found location
  * Finder name (partial)
  * Message button
  * Claim button

---

## **6.6 Messaging**

* One-to-one chat.
* Real-time via WebSockets.
* Unread count.
* Attachments allowed.

---

## **6.7 Account Page**

* Edit profile.
* View:

  * My Found posts
  * My Lost queries
* Trust score.
* Theme toggle.
* Logout.

---

## **6.8 Admin Panel**

* View flagged content.
* Block/ban users.
* Resolve disputes.
* Monthly dashboard.

---

# 7. **Non-Functional Requirements**

### **Performance**

* PWA with offline caching (found posts cached).
* First paint < 2 seconds on 4G.

### **Security**

* JWT-based authentication.
* Input sanitization.
* Rate limiting on post creation.
* Suspicious activity detection.

### **Scalability**

* Should handle 5k concurrent users.
* WebSocket load managed with clustering.

### **Reliability**

* Automatic retries for message sending if network drops.

---

# 8. **Frontend Implementation Plan (React + Vite + Tailwind)**

## **8.1 Folder Structure**

```
src/
 ├─ components/
 │   ├─ TopBar.jsx
 │   ├─ BottomNav.jsx
 │   ├─ ItemCard.jsx
 │   ├─ ChatBubble.jsx
 │   └─ Filters.jsx
 ├─ pages/
 │   ├─ Home.jsx
 │   ├─ Found.jsx
 │   ├─ ItemDetail.jsx
 │   ├─ Messages.jsx
 │   ├─ Account.jsx
 │   ├─ LostForm.jsx
 │   └─ FoundForm.jsx
 ├─ context/
 │   ├─ AuthContext.jsx
 │   └─ ThemeContext.jsx
 ├─ api/
 │   ├─ auth.js
 │   ├─ lost.js
 │   ├─ found.js
 │   └─ messages.js
 ├─ utils/
 └─ main.jsx
```

## **8.2 Components**

* **TopBar**: Branding + Profile avatar
* **BottomNav**: Home, Found, Messages, Account
* **ItemCard**: Card for found item
* **Chat UI**: Dynamic scroll, real-time updates

## **8.3 State Management**

* Context API for:

  * Auth
  * Theme
  * Notifications
* Local Storage for drafts & caching.

## **8.4 Frontend Libraries**

* Axios
* Socket.io-client
* React Router
* Tailwind
* Shadcn UI

---

# 9. **Backend Implementation Plan (Express + Node.js + MongoDB)**

## **9.1 Architecture**

* **MVC architecture**
* Controllers
* Services
* Models
* Routes
* Middlewares
* Utility helpers

## **9.2 Folder Structure**

```
backend/
 ├─ src/
 │   ├─ controllers/
 │   ├─ routes/
 │   ├─ models/
 │   ├─ services/
 │   ├─ middlewares/
 │   ├─ utils/
 │   ├─ websockets/
 │   └─ server.js
```

---

# 10. **Database Models (MongoDB)**

### **User**

```
name
email
passwordHash
enroll
batch
branch
profilePic
trustScore
role
```

### **LostItem**

```
title
category
photos[]
location
time
description
ownerId
status (open/matched/closed)
```

### **FoundItem**

```
title
category
photos[]
whereFound
whenFound
finderId
status (available/matched/returned)
```

### **Messages**

```
threadId
participants[]
messages: [
  {sender, text, timestamp}
]
```

### **Reports**

```
sourceUser
targetUser
reason
evidence
status
```

---

# 11. **API Endpoints**

## **Auth**

* POST `/auth/signup`
* POST `/auth/login`

## **Lost**

* POST `/lost/create`
* GET `/lost/matches/:lostId`
* GET `/lost/mine`

## **Found**

* POST `/found/create`
* GET `/found/all`
* GET `/found/:id`

## **Messages**

* POST `/messages/send`
* GET `/messages/thread/:id`

## **Admin**

* GET `/admin/flags`
* POST `/admin/ban`

---

# 12. **Acceptance Criteria**

### Posting a lost item:

* User fills form → valid → saved in DB.
* Auto-match returns suggestions.
* Post visible under “My Queries”.

### Posting a found item:

* Must have at least one image.
* Shows on Found Page within 1 second.

### Messaging:

* Real-time.
* Messages persist on reload.

### User Profile:

* Updating should reflect immediately.

### Admin Panel:

* Flagged content visible.
* Ban works instantly.

---

# 13. **Release Plan (MVP)**

### **Phase 1**

* Authentication
* Home + Lost + Found
* Item detail pages
* Basic messaging
* Account page

### **Phase 2**

* Auto-match
* Trust score
* Flags + Admin panel

### **Phase 3**

* PWA app install
* Offline caching
* Advanced filters
* Statistics dashboard

---