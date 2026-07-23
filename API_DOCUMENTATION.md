# FitAI X - Onboarding API Documentation

This backend is built using Node.js + Express and connects directly to your Neon Cloud PostgreSQL database using standard pool configurations.

All request bodies must be sent with `Content-Type: application/json`.

---

## 1. API Endpoint Summary Table

| Method | Endpoint | Description | Query/Body Parameters |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Health Check & Database Status | None |
| **POST** | `/api/onboarding` | Submit or Auto-save Progress (Upsert) | Complete Onboarding JSON Payload |
| **GET** | `/api/onboarding/:email` | Get Onboarding Response by Email | Email parameter in URL path |
| **GET** | `/api/onboarding` | List All Onboarding Submissions | None |
| **DELETE**| `/api/onboarding/:email` | Delete/Reset Onboarding Response | Email parameter in URL path |

---

## 2. Detailed API Specifications & Payloads

### 2.1. Health Check
* **Endpoint:** `GET http://localhost:5000/api/health`
* **Response (Success):**
```json
{
  "status": "healthy",
  "dbConnected": true,
  "timestamp": "2026-07-21T09:00:00.000Z",
  "service": "FitAI X Onboarding Backend (Modular)"
}
```

### 2.2. Submit or Save Onboarding Progress (Upsert)
* **Endpoint:** `POST http://localhost:5000/api/onboarding`
* **Headers:** `Content-Type: application/json`
* **Request Body (Example):**
```json
{
  "email": "arjun.sharma@example.com",
  "first_name": "Arjun",
  "last_name": "Sharma",
  "date_of_birth": "15/08/1995",
  "gender": "Male",
  "weight": "68",
  "weight_unit": "kg",
  "height": "172",
  "height_unit": "cm",
  "main_goal": "Build Muscle",
  "is_event_training": "Yes",
  "event_details": "HYROX, 12 Oct 2026",
  "current_training_freq": "3-4 days per week",
  "days_per_week": "4 days per week",
  "best_days": ["Monday", "Wednesday", "Friday", "Saturday"],
  "session_duration": "60 minutes",
  "training_location": "Gym",
  "equipment_access": ["Dumbbells", "Barbell", "Gym Machines"],
  "has_injury": "No",
  "injury_details": "",
  "has_medical_condition": "No",
  "medical_condition_details": "",
  "sleep_hours": "7-8 hours",
  "dietary_preference": "Non-Vegetarian",
  "has_food_allergies": "No",
  "food_allergies_details": "",
  "is_completed": true,
  "current_step": 23
}
```
* **Response (Success):**
```json
{
  "message": "Onboarding successfully completed!",
  "data": {
    "email": "arjun.sharma@example.com",
    "first_name": "Arjun",
    "last_name": "Sharma",
    ...
    "is_completed": true,
    "current_step": 23,
    "created_at": "2026-07-21T09:05:00.000Z",
    "updated_at": "2026-07-21T09:10:00.000Z"
  }
}
```

### 2.3. Retrieve Response by Email
* **Endpoint:** `GET http://localhost:5000/api/onboarding/arjun.sharma@example.com`
* **Response (Success):**
```json
{
  "data": {
    "email": "arjun.sharma@example.com",
    "first_name": "Arjun",
    "last_name": "Sharma",
    "is_completed": true,
    "current_step": 23,
    ...
  }
}
```
* **Response (404 Not Found):**
```json
{
  "message": "No onboarding profile found for this email address."
}
```

### 2.4. List All Responses
* **Endpoint:** `GET http://localhost:5000/api/onboarding`
* **Response (Success):**
```json
{
  "count": 1,
  "data": [
    {
      "email": "arjun.sharma@example.com",
      "first_name": "Arjun",
      "last_name": "Sharma",
      "is_completed": true
    }
  ]
}
```

### 2.5. Delete Response (Reset Data)
* **Endpoint:** `DELETE http://localhost:5000/api/onboarding/arjun.sharma@example.com`
* **Response (Success):**
```json
{
  "message": "Profile for arjun.sharma@example.com successfully deleted.",
  "deletedRecord": {
    "email": "arjun.sharma@example.com"
  }
}
```

---

## 3. How to Run & Import to Postman
1. Start the application using `npm run dev` at the root folder.
2. In Postman, create a new request or use **Import** with the raw URL endpoints.
3. Add a header `Content-Type: application/json` for the `POST` request.
4. Supply any values inside the body and test the API flow.
