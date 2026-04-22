# MyBank API - Testing Guide with Postman

This guide explains how to test the **Gestion des dépenses** REST API using Postman.

## 🚀 Getting Started

- **Base URL**: `http://localhost:8000`
- **Content-Type**: `application/json` (Must be set for all POST/PUT requests)

---

## 1. Authentication Flow

### A. Register a New User
Create your user account first.

- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/register`
- **Body** (Raw JSON):
```json
{
    "email": "user@example.com",
    "password": "Password123!",
    "name": "John Doe"
}
```

### B. Login (Standard JWT)
Obtain your access token.

- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/login_check`
- **Body** (Raw JSON):
```json
{
    "username": "user@example.com",
    "password": "Password123!"
}
```
> [!IMPORTANT]
> Use `"username"` instead of `"email"` in the body for the login check, as required by the LexikJWT configuration.

- **Response**: You will receive a `token`. Copy this token.

---

## 2. Using the JWT Token in Postman

For all subsequent requests, you must include the token:
1. In Postman, go to the **Auth** tab of your request.
2. Select **Type**: `Bearer Token`.
3. Paste your token into the **Token** field.

---

## 3. Categories Management

### List Categories
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/categories`

### Create a Category
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/categories`
- **Body**:
```json
{
    "title": "Alimentation"
}
```

---

## 4. Operations Management

### List My Operations
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/operations`

### Create an Operation
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/operations`
- **Body**:
```json
{
    "wording": "Courses au supermarché",
    "amount": 45.50,
    "date": "2024-03-22T10:00:00Z",
    "categoryId": 1
}
```

### Update an Operation
- **Method**: `PUT`
- **URL**: `{{baseUrl}}/api/operations/{id}`
- **Body**:
```json
{
    "wording": "Petit déjeuner",
    "amount": 12.00,
    "date": "2024-03-22T08:30:00Z",
    "categoryId": 1
}
```

### Delete an Operation
- **Method**: `DELETE`
- **URL**: `{{baseUrl}}/api/operations/{id}`

---

## 5. Account Info
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/me`