# LMS Frontend Integration Guide
## Laravel + Bunny.net Stream — React Developer Docs

> **Auth method:** Laravel Sanctum with **cookie-based sessions** (not Bearer tokens).  
> All requests must be same-origin or use the configured CORS domain.

---

## Table of Contents

1. [Setup & Prerequisites](#1-setup--prerequisites)
2. [Sanctum Cookie Auth — How It Works](#2-sanctum-cookie-auth--how-it-works)
3. [Axios Configuration](#3-axios-configuration)
4. [Authentication Flow](#4-authentication-flow)
5. [Create a Lesson](#5-create-a-lesson)
6. [Upload a Lesson Video](#6-upload-a-lesson-video)
7. [Stream a Lesson Video](#7-stream-a-lesson-video)
8. [Full React Example — Lesson Creator Page](#8-full-react-example--lesson-creator-page)
9. [Error Reference](#9-error-reference)
10. [Environment Variables](#10-environment-variables)

---

## 1. Setup & Prerequisites

### Install dependencies

```bash
npm install axios
```

### What you need from the backend team

| Value | Example | Where to use |
|---|---|---|
| Laravel base URL | `https://api.yourlms.com` | `VITE_API_URL` in `.env` |
| Sanctum cookie domain | `yourlms.com` | `axios.defaults` |
| CORS allowed origin | `https://app.yourlms.com` | Your frontend domain |

### Environment file

```env
VITE_API_URL=https://api.yourlms.com
```

---

## 2. Sanctum Cookie Auth — How It Works

Sanctum cookie auth is **different from token/Bearer auth**. Here's what you need to know:

```
1. Call GET /sanctum/csrf-cookie  →  Laravel sets XSRF-TOKEN cookie
2. Axios reads that cookie        →  Axios sends it as X-XSRF-TOKEN header on every request
3. Call POST /login               →  Laravel sets laravel_session cookie
4. All future requests carry both cookies automatically
```

**Key rules for React:**
- Always call `/sanctum/csrf-cookie` before login and before the first POST/PUT/DELETE of a session.
- Set `withCredentials: true` on every axios request — this is what sends the cookies cross-origin.
- Never store the session in `localStorage`. The cookies handle it.
- Your frontend domain and API domain must share a root domain, or the backend must have CORS configured for your exact origin.

---

## 3. Axios Configuration

Create this file once and import it everywhere instead of using plain `fetch` or bare `axios`.

```js
// src/lib/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,         // REQUIRED — sends cookies cross-origin
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',  // tells Laravel this is an AJAX request
  },
});

export default api;
```

> **Never remove `withCredentials: true`.** Without it, browsers block cookies on cross-origin requests and every request will return `401 Unauthenticated`.

---

## 4. Authentication Flow

### 4.1 Initialize CSRF (call once on app load)

```js
// src/lib/csrf.js
import api from './axios';

export async function initCsrf() {
  await api.get('/sanctum/csrf-cookie');
}
```

Call this in your app entry point:

```jsx
// src/main.jsx  or  src/App.jsx
import { initCsrf } from './lib/csrf';

initCsrf(); // fire and forget on app mount
```

### 4.2 Login

```js
// src/api/auth.js
import api from '../lib/axios';
import { initCsrf } from '../lib/csrf';

export async function login(email, password) {
  await initCsrf();  // always refresh CSRF before login

  const response = await api.post('/login', { email, password });
  return response.data;
}

export async function logout() {
  await api.post('/logout');
}

export async function getUser() {
  const response = await api.get('/api/user');
  return response.data;
}
```

---

## 5. Create a Lesson

Before uploading a video, you need to create the lesson record in the database. The lesson creation and video upload are two separate steps.

### API endpoint

```
POST /api/courses/{courseId}/lessons
Content-Type: application/json
```

### Request body

```json
{
  "title": "Introduction to Variables",
  "description": "Learn what variables are and how to use them.",
  "order": 1,
  "is_free_preview": false
}
```

### Response (201 Created)

```json
{
  "id": 42,
  "course_id": 7,
  "title": "Introduction to Variables",
  "description": "Learn what variables are and how to use them.",
  "order": 1,
  "is_free_preview": false,
  "bunny_video_id": null,
  "video_status": "pending",
  "created_at": "2025-04-10T10:00:00.000000Z"
}
```

### JavaScript function

```js
// src/api/lessons.js
import api from '../lib/axios';

export async function createLesson(courseId, lessonData) {
  const response = await api.post(`/api/courses/${courseId}/lessons`, {
    title: lessonData.title,
    description: lessonData.description,
    order: lessonData.order,
    is_free_preview: lessonData.isFreePreview ?? false,
  });
  return response.data; // returns the created lesson including its `id`
}
```

---

## 6. Upload a Lesson Video

Video upload uses `multipart/form-data`, not JSON. You must use a `FormData` object and **override** the default `Content-Type` header so the browser sets the correct multipart boundary automatically.

### API endpoint

```
POST /api/lessons/{lessonId}/upload
Content-Type: multipart/form-data
```

### Request body

| Field | Type | Required | Notes |
|---|---|---|---|
| `video` | File | Yes | Accepted: mp4, mov, avi, mkv. Max: 2 GB |

### Response (200 OK)

```json
{
  "message": "Video uploaded successfully",
  "video_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

### JavaScript function with upload progress

```js
// src/api/lessons.js  (add to the same file)

export async function uploadLessonVideo(lessonId, videoFile, onProgress) {
  const formData = new FormData();
  formData.append('video', videoFile);

  const response = await api.post(
    `/api/lessons/${lessonId}/upload`,
    formData,
    {
      headers: {
        // Override Content-Type to let the browser set multipart boundary
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percent);
        }
      },
    }
  );

  return response.data;
}
```

> **Important:** Do not manually set `Content-Type: multipart/form-data` with a boundary string. Let the browser compute it from the `FormData` object. Just pass `'Content-Type': 'multipart/form-data'` as shown — axios handles the boundary automatically.

---

## 7. Stream a Lesson Video

Fetching the video URL is a two-step process:

1. Call the stream endpoint — Laravel checks enrollment and returns a **signed, expiring URL**.
2. Embed that URL in an `<iframe>` (Bunny.net player).

The signed URL expires in 2 hours. Do not cache it permanently. Re-fetch when the lesson page loads.

### API endpoint

```
GET /api/lessons/{lessonId}/stream
```

### Response (200 OK — enrolled student)

```json
{
  "stream_url": "https://iframe.mediadelivery.net/embed/123456/xxxxxxxx?token=abc123&expires=1234567890"
}
```

### Response (403 — not enrolled)

```json
{
  "message": "Not enrolled in this course"
}
```

### Response (404 — video not ready yet)

```json
{
  "message": "Video not available yet"
}
```

### JavaScript function

```js
// src/api/lessons.js  (add to the same file)

export async function getLessonStreamUrl(lessonId) {
  const response = await api.get(`/api/lessons/${lessonId}/stream`);
  return response.data.stream_url;
}
```

### Embed the player in React

```jsx
function LessonPlayer({ lessonId }) {
  const [streamUrl, setStreamUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLessonStreamUrl(lessonId)
      .then(setStreamUrl)
      .catch((err) => {
        if (err.response?.status === 403) {
          setError('You are not enrolled in this course.');
        } else if (err.response?.status === 404) {
          setError('This video is still being processed. Check back shortly.');
        } else {
          setError('Could not load video. Please try again.');
        }
      })
      .finally(() => setLoading(false));
  }, [lessonId]);

  if (loading) return <p>Loading video...</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <iframe
      src={streamUrl}
      width="100%"
      height="480"
      frameBorder="0"
      scrolling="no"
      allow="accelerometer; autoplay; encrypted-media; gyroscope"
      allowFullScreen
      title="Lesson video"
    />
  );
}
```

---

## 8. Full React Example — Lesson Creator Page

This is a complete, self-contained component an instructor uses to create a lesson and upload its video in one form.

```jsx
// src/pages/CreateLesson.jsx
import { useState } from 'react';
import { createLesson, uploadLessonVideo } from '../api/lessons';

export default function CreateLesson({ courseId }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    order: 1,
    isFreePreview: false,
  });
  const [videoFile, setVideoFile] = useState(null);

  const [step, setStep] = useState('idle'); // idle | creating | uploading | done | error
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Only MP4, MOV, AVI, and MKV files are supported.');
      return;
    }

    const maxSizeBytes = 2 * 1024 * 1024 * 1024; // 2 GB
    if (file.size > maxSizeBytes) {
      setErrorMessage('File is too large. Maximum size is 2 GB.');
      return;
    }

    setErrorMessage('');
    setVideoFile(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    if (!form.title.trim()) {
      setErrorMessage('Lesson title is required.');
      return;
    }
    if (!videoFile) {
      setErrorMessage('Please select a video file.');
      return;
    }

    try {
      // Step 1: Create the lesson record
      setStep('creating');
      const lesson = await createLesson(courseId, form);

      // Step 2: Upload the video
      setStep('uploading');
      await uploadLessonVideo(lesson.id, videoFile, (percent) => {
        setUploadProgress(percent);
      });

      setStep('done');
    } catch (err) {
      setStep('error');
      if (err.response?.status === 422) {
        // Validation errors from Laravel
        const errors = err.response.data.errors;
        const messages = Object.values(errors).flat().join(' ');
        setErrorMessage(messages);
      } else if (err.response?.status === 403) {
        setErrorMessage('You do not have permission to upload lessons.');
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    }
  }

  // ── Render ──

  if (step === 'done') {
    return (
      <div>
        <h2>Lesson created successfully!</h2>
        <p>Your video is being processed by Bunny.net. It will be available to students shortly.</p>
        <button onClick={() => {
          setStep('idle');
          setForm({ title: '', description: '', order: 1, isFreePreview: false });
          setVideoFile(null);
          setUploadProgress(0);
        }}>
          Create another lesson
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Lesson</h2>

      {/* Error banner */}
      {errorMessage && (
        <div style={{ color: 'red', marginBottom: '12px' }}>
          {errorMessage}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title">Lesson Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleFormChange}
          disabled={step !== 'idle'}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleFormChange}
          disabled={step !== 'idle'}
          rows={4}
        />
      </div>

      {/* Order */}
      <div>
        <label htmlFor="order">Lesson Order</label>
        <input
          id="order"
          name="order"
          type="number"
          min={1}
          value={form.order}
          onChange={handleFormChange}
          disabled={step !== 'idle'}
        />
      </div>

      {/* Free preview toggle */}
      <div>
        <label>
          <input
            name="isFreePreview"
            type="checkbox"
            checked={form.isFreePreview}
            onChange={handleFormChange}
            disabled={step !== 'idle'}
          />
          {' '}Free preview (visible without enrollment)
        </label>
      </div>

      {/* Video file picker */}
      <div>
        <label htmlFor="video">Video File * (MP4, MOV, AVI, MKV — max 2 GB)</label>
        <input
          id="video"
          type="file"
          accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska"
          onChange={handleFileChange}
          disabled={step !== 'idle'}
        />
        {videoFile && (
          <p style={{ fontSize: '13px', color: '#555' }}>
            Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)} MB)
          </p>
        )}
      </div>

      {/* Progress indicator */}
      {step === 'creating' && <p>Creating lesson...</p>}
      {step === 'uploading' && (
        <div>
          <p>Uploading video: {uploadProgress}%</p>
          <progress value={uploadProgress} max={100} style={{ width: '100%' }} />
          <p style={{ fontSize: '12px', color: '#888' }}>
            Do not close this tab while uploading.
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={step !== 'idle'}
        style={{ marginTop: '16px' }}
      >
        {step === 'idle' ? 'Create Lesson & Upload Video' : 'Please wait...'}
      </button>
    </form>
  );
}
```

---

## 9. Error Reference

| HTTP Status | Meaning | What to show the user |
|---|---|---|
| `401` | Not logged in / session expired | Redirect to login page |
| `403` | Not enrolled / wrong role | "You don't have access to this content" |
| `404` | Lesson not found / video not ready | "This lesson is not available yet" |
| `413` | File too large (rejected by server/nginx) | "File exceeds the maximum allowed size" |
| `422` | Validation failed | Show `error.response.data.errors` fields |
| `500` | Server error | "Something went wrong, please try again" |

### Global axios error interceptor (optional but recommended)

```js
// src/lib/axios.js — add after the instance creation

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired — redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 10. Environment Variables

```env
# .env.local
VITE_API_URL=https://api.yourlms.com
```

```env
# .env.production
VITE_API_URL=https://api.yourlms.com
```

> All env variables must be prefixed with `VITE_` to be accessible in the browser via `import.meta.env`.

---

## Quick Checklist

- [ ] `withCredentials: true` is set on the axios instance
- [ ] `X-Requested-With: XMLHttpRequest` header is set
- [ ] `/sanctum/csrf-cookie` is called before the first POST/PUT/DELETE
- [ ] Video upload uses `FormData`, not JSON
- [ ] `Content-Type: multipart/form-data` is set on the upload request
- [ ] Stream URL is fetched fresh on each lesson page load (not cached)
- [ ] 401 responses redirect to the login page

---

*Last updated: April 2025 — matches Laravel Sanctum v3 + Bunny.net Stream API v2*
