# Backend API Documentation — Nova School

This document specifies the required API endpoints, request payloads, and response structures for the Nova School frontend. All property names use **snake_case** as requested.

---

## 🔒 General Standards

- **Base URL**: `https://api.thenovagroupco.com/api/v1`
- **Content-Type**: `application/json`
- **Authentication**: `Authorization: Bearer <jwt_token>` (for all protected routes)
- **Response Format**: 
  ```json
  {
    "status": true,
    "message": "Optional success message",
    "data": { ... }
  }
  ```

---

## 📚 1. Course Listing Page
**Route**: `/courses`  
**Purpose**: Display a searchable, filterable grid of available courses.

### [GET] `/courses`

#### Query Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `page` | `integer` | Current page number (default: 1) |
| `search` | `string` | Search query for title/description |
| `categories[]` | `array` | Filter by category names |
| `levels[]` | `array` | Filter by levels (Beginner, Intermediate, etc.) |
| `packages[]` | `array` | Filter by package names |

#### Response Shape
```json
{
  "status": true,
  "data": {
    "courses": [
      {
        "id": "1",
        "title": "Complete UI/UX Design Masterclass",
        "description": "Master design thinking...",
        "thumbnail": "/images/course-1.png",
        "category": "Design",
        "level": "Beginner",
        "duration": "12 Hours",
        "total_chapters": 48,
        "price": 49.00,
        "completed_percent": 65,
        "rating": 4.9,
        "students_count": 3200
      }
    ],
    "pagination": {
      "total_count": 145,
      "total_pages": 25,
      "current_page": 1,
      "per_page": 6
    }
  }
}
```

---

## 🔍 2. Course Details Page
**Route**: `/courses/{course_id}`  
**Purpose**: Display full information about a specific course before enrollment or viewing.

### [GET] `/courses/{id}`

#### Response Shape
```json
{
  "status": true,
  "data": {
    "id": "1",
    "title": "Complete UI/UX Design Masterclass",
    "description": "...",
    "thumbnail": "/images/course-1.png",
    "price": 49.00,
    "duration": "12 Hours",
    "learning_outcomes": "By the end of this course you will...",
    "module_count": 6,
    "total_hours": 12,
    "available_for_packages": ["Basic", "Premium"],
    "available_for_groups": ["Designers"],
    "skills_gained": ["UI Design", "Figma"],
    "modules": [
      {
        "id": "m1",
        "title": "Introduction to UI/UX Design",
        "chapter_count": 6,
        "chapters": [
          { "id": "c1", "title": "What is UI vs UX?", "duration": "10:00" },
          { "id": "c2", "title": "The Design Thinking Process", "duration": "15:00" }
        ]
      }
    ],
    "related_courses": [
      { "id": "2", "title": "React for Designers", "thumbnail": "..." }
    ]
  }
}
```

---

## 🎥 3. Course Player Page
**Route**: `/player` (with `course_id` and `lesson_id` query params)  
**Purpose**: Deliver video content and track user progress.

### [GET] `/courses/{id}/content`
**Purpose**: Get the sidebar structure and current progress.

#### Response Shape
```json
{
  "status": true,
  "data": {
    "course_id": "1",
    "total_lessons": 27,
    "completed_lessons": 2,
    "modules": [
      {
        "id": "m1",
        "title": "Module 1: Orientation",
        "duration": "1 Hour",
        "chapters": [
          {
            "id": "c1",
            "title": "Lesson 1: Intro",
            "duration": "30:00",
            "is_completed": true,
            "is_locked": false,
            "video_url": "https://..."
          },
          {
            "id": "c2",
            "title": "Lesson 2: Setup",
            "is_completed": false,
            "is_locked": false
          }
        ]
      }
    ]
  }
}
```

### [POST] `/lessons/{id}/complete`
**Purpose**: Mark a lesson as finished to unlock the next one.

#### Response Shape
```json
{
  "status": true,
  "message": "Lesson marked as completed",
  "data": {
    "next_lesson_id": "c3",
    "course_completed_percent": 15
  }
}
```

---

## 👤 4. User Profile & Dashboard
**Route**: `/profile`  
**Purpose**: Show account info and learning statistics.

### [GET] `/user/profile-stats`

#### Response Shape
```json
{
  "status": true,
  "data": {
    "user_data": {
      "id": 101,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "image": "/images/avatar.png"
    },
    "stats": {
      "total_courses": 10,
      "subscribed_courses": 2,
      "not_started": 1,
      "in_progress": 0,
      "completed": 0,
      "completion_percentage": 0
    },
    "recent_courses": [
      {
        "id": "2",
        "title": "Full-Stack React",
        "thumbnail": "...",
        "last_watched": "2024-03-20T10:00:00Z"
      }
    ],
    "recommended_courses": [
      { "id": "5", "title": "Laravel Backend Mastery", "thumbnail": "..." }
    ]
  }
}
```

---

## ⚠️ Shared Response Codes
- `200`: Success.
- `401`: Unauthorized (Token expired/Missing).
- `403`: Forbidden (User not enrolled in the course).
- `404`: Resource not found.
- `422`: Validation error (Missing required fields).
