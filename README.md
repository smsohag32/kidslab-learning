# 🩸 Dare To Donate - Blood Donation Application (Backend)

Dare To Donate is a backend service that enables users to **donate blood**, **request blood**, and **manage donor information**. This backend provides RESTful APIs for a seamless blood donation process.

## 📖 API Base URL

🔗 **Live API**: [https://dare-to-donate-server.vercel.app](https://dare-to-donate-server.vercel.app)
🔧 **Local Development**: `http://localhost:4500`

## 🚀 Features

-  User authentication (Register/Login)
-  Donor management (Create, Read, Update, Delete)
-  Blood request system
-  Search for donors based on location & blood type
-  Admin dashboard support (Optional)

---

#### 📌 Api Documentation

**POST** `/api/v1/auth/sign-up`

#### 📤 Example Request

```json
{
   "email": "sohag@gmail.com",
   "password": "11223344",
   "first_name": "Sohag",
   "last_name": "Sheik",
   "phone": "01922026932",
   "blood_group": "A+",
   "address": "Dhaka"
}
```

#### 📤 Example response

```json
{
   "message": "User registered successfully",
   "user": {
      "_id": "67bb215d7b4ee4c3745f42cd",
      "email": "sohag@gmail.com",
      "is_active": true,
      "phone": "01922026932",
      "blood_group": "A+"
   }
}
```

**POST** `/api/v1/auth/sign-up`

#### 📤 Example Request

```json
{
   "email": "sohag@gmail.com",
   "password": "11223344"
}
```

## 📤 Example response

```json
{
   "message": "User logged in successfully",
   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2JiMjE1ZDdiNGVlNGMzNzQ1ZjQyY2QiLCJlbWFpbCI6InNvaGFnQGdtYWlsLmNvbSIsImlhdCI6MTc0MDMxNzA5NiwiZXhwIjoxNzQwNDAzNDk2fQ.GEYUP28R4_2OK5wsGO0ClSPf-jAsFFuQKqbxP_0Y1Ak",
   "user": {
      "_id": "67bb215d7b4ee4c3745f42cd",
      "email": "sohag@gmail.com",
      "is_active": true,
      "phone": "01922026932",
      "blood_group": "A+"
   }
}
```

**POST** `/api/v1/auth/otp-verify`

#### 📤 Example Request

```json
{
   "email": "sohag@gmail.com",
   "otp": "123456"
}
```

## 📤 Example response

```json
{
   "message": "User otp verified in successfully",
   "httpStatusCode": 200,
   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
   "user": {
      "_id": "65f123456789abcd12345678",
      "email": "sohag@gmail.com",
      "is_active": true,
      "is_verified": true,
      "phone": "+1234567890",
      "blood_group": "O+"
   }
}
```

## 📤 Example response (Failed)

```json
{
   "message": "Invalid OTP."
}
```

```json
{
   "message": "OTP has expired. Please request a new OTP."
}
```

### resend otp

**POST** `/api/v1/auth/send-otp`

#### 📤 Example Request

```json
{
   "email": "sohag@gmail.com"
}
```

## 📤 Example response

```json
{
   "message": "Otp send successfully.",
   "httpStatusCode": 200
}
```

## Edit profile

**PUT** `/api/v1/user/{userId}`

#### 📤 Example Request (MULTIPART FORM DATA)

### content key

```json
{
   "first_name": "Sohag",
   "last_name": "Sheik",
   "phone": "01922026932",
   "blood_group": "A+",
   "address": "Dhaka"
}
```

### image key

```json
file
binary data
```

## 📤 Example response

```json
{
   "message": "User profile updated successfully",
   "httpStatusCode": 200,
   "data": {
      "address": "Dhaka",
      "_id": "67bb5617f20e34dc23d70d29",
      "first_name": "Mohammad Sohag",
      "last_name": "Sheik",
      "user_id": "67bb5616f20e34dc23d70d26",
      "blood_group": "A+",
      "profile_image": "",
      "phone": "01922016032",
      "available_donate": true,
      "createdAt": "2025-02-23T17:08:39.016Z",
      "updatedAt": "2025-02-23T17:57:52.816Z",
      "__v": 0
   }
}
```

# Get User Details by ID

**GET** `/api/v1/user/{userId}`
