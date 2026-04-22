Albatta. `Marketplace` ichidagi barcha requestlarni ko‘rib chiqdim va frontendchilar uchun to‘liq Markdown formatda hujjat tayyorlab berdim.

Muhim eslatma:
- Request endpointlari va bodylari aniq ko‘rindi.
- Lekin saqlangan `example response`lar topilmadi, shuning uchun response bo‘limida:
  - aniq tasdiqlangan joylarni yozdim,
  - qolgan joylarda esa `expected/inferred` deb belgiladim.
- Asosiy papka: [Marketplace](folder/50572801-21ed8769-133d-4f84-9212-f4f519ab05e4)

Quyida tayyor `.md` kontent:

```md
# Marketplace API Documentation
Frontend developers uchun to‘liq qo‘llanma

## Base URL
Barcha endpointlar quyidagi base URL bilan ishlaydi:

`{{base_url}}`

Misol:
```http
{{base_url}}/api/marketplace
```

## Authentication

Ba’zi endpointlar `Authorization` header talab qiladi:

```http
Authorization: Bearer {{access_token}}
```

## Ishlatiladigan o‘zgaruvchilar

Quyidagi variablelar requestlarda ishlatilgan:

- `{{base_url}}`
- `{{access_token}}`
- `{{business_id}}`
- `{{branch_id}}`
- `{{client_id}}`
- `{{client_address_id}}`
- `{{product_id}}`
- `{{product_id_2}}`
- `{{order_id}}`
- `{{country_id}}`
- `{{region_id}}`
- `{{business_sales_platform_id}}`

---

# 1. Marketplace Clients

Folder: Marketplace Clients

## 1.1 Register Client

Clientni ro‘yxatdan o‘tkazish.

- Method: `POST`
- Endpoint: `/api/marketplace/clients/register`
- Full URL: `{{base_url}}/api/marketplace/clients/register`

### Headers
```http
Content-Type: application/json
```

### Request Body
```json
{
  "name": "John Doe",
  "phone_number": "998901234567",
  "email": "john@example.com"
}
```

### Body fields
| Field | Type | Required | Description |
|---|---|---:|---|
| name | string | Yes | Client full name |
| phone_number | string | Yes | Telefon raqami |
| email | string | Yes | Email manzil |

### Expected Success Response
Aniq saved response yo‘q, lekin odatda quyidagicha bo‘lishi mumkin:

```json
{
  "success": true,
  "message": "Client registered successfully",
  "data": {
    "id": "client_uuid",
    "name": "John Doe",
    "phone_number": "998901234567",
    "email": "john@example.com"
  }
}
```

### Frontend Notes
- `phone_number` formatini oldindan validatsiya qiling.
- Register’dan keyin login/verify flow boshlanishi mumkin.

---

## 1.2 Login Client

Client login jarayonini boshlash.

- Method: `POST`
- Endpoint: `/api/marketplace/clients/login`
- Full URL: `{{base_url}}/api/marketplace/clients/login`

### Headers
```http
Content-Type: application/json
```

### Request Body
```json
{
  "phone_number": "998901234567"
}
```

### Body fields
| Field | Type | Required | Description |
|---|---|---:|---|
| phone_number | string | Yes | Login uchun telefon raqam |

### Expected Success Response
Aniq saved response topilmadi. Ehtimol verification jarayoni uchun `clientId` qaytadi:

```json
{
  "success": true,
  "message": "Verification code sent",
  "data": {
    "clientId": "client_uuid"
  }
}
```

### Frontend Notes
- Bu endpoint odatda OTP/code yuborish uchun ishlatiladi.
- Keyingi qadam: `Verify Client`.

---

## 1.3 Verify Client

Clientni OTP/kod orqali tasdiqlash.

- Method: `POST`
- Endpoint: `/api/marketplace/clients/verify`
- Full URL: `{{base_url}}/api/marketplace/clients/verify`

### Headers
```http
Content-Type: application/json
```

### Request Body
```json
{
  "clientId": "{{client_id}}",
  "code": 123456
}
```

### Body fields
| Field | Type | Required | Description |
|---|---|---:|---|
| clientId | string | Yes | Login/registerdan qaytgan client ID |
| code | number | Yes | SMS/OTP verification code |

### Expected Success Response
Saved example yo‘q. Odatda token yoki client ma’lumoti qaytishi mumkin:

```json
{
  "success": true,
  "message": "Client verified successfully",
  "data": {
    "access_token": "jwt_or_session_token",
    "client": {
      "id": "client_uuid",
      "name": "John Doe",
      "phone_number": "998901234567"
    }
  }
}
```

### Frontend Notes
- `code` maydoni 6 xonali formatda bo‘lishi mumkin.
- Verify muvaffaqiyatli bo‘lsa auth state yangilanadi.

---

## 1.4 Resend Code

Tasdiqlash kodini qayta yuborish.

- Method: `POST`
- Endpoint: `/api/marketplace/clients/resend-code`
- Full URL: `{{base_url}}/api/marketplace/clients/resend-code`

### Headers
```http
Content-Type: application/json
```

### Request Body
```json
{
  "clientId": "{{client_id}}"
}
```

### Body fields
| Field | Type | Required | Description |
|---|---|---:|---|
| clientId | string | Yes | Client ID |

### Expected Success Response
```json
{
  "success": true,
  "message": "Code resent successfully"
}
```

### Frontend Notes
- Resend tugmasiga timer qo‘ying.
- Spamni oldini olish uchun cooldown UI ishlating.

---

## 1.5 Get Client by ID

Client ma’lumotlarini olish.

- Method: `GET`
- Endpoint: `/api/marketplace/clients/{{client_id}}`
- Full URL: `{{base_url}}/api/marketplace/clients/{{client_id}}`

### Headers
```http
Authorization: Bearer {{access_token}}
```

### Path Params
| Param | Type | Required | Description |
|---|---|---:|---|
| client_id | string | Yes | Client ID |

### Expected Success Response
```json
{
  "success": true,
  "data": {
    "id": "client_uuid",
    "name": "John Doe",
    "phone_number": "998901234567",
    "email": "john@example.com"
  }
}
```

### Frontend Notes
- Profil sahifasi uchun ishlatish mumkin.
- 401 holatda userni qayta login flowga yuborish kerak.

---

# 2. Marketplace Orders

Folder: Marketplace Orders

## 2.1 Create Order

Yangi marketplace order yaratish.

- Method: `POST`
- Endpoint: `/api/marketplace/orders`
- Full URL: `{{base_url}}/api/marketplace/orders`

### Headers
```http
Content-Type: application/json
Authorization: Bearer {{access_token}}
```

### Request Body
```json
{
  "business_id": "{{business_id}}",
  "branch_id": "{{branch_id}}",
  "client_id": "{{client_id}}",
  "client_address_id": "{{client_address_id}}",
  "channel_order_id": "ORD-12345",
  "delivery_address": "123 Main Street, Tashkent",
  "payment_type": "CARD",
  "order_type": "DELIVERY",
  "comment": "Extra napkins please",
  "delivery_fee": 15000,
  "total_discount": 5000,
  "total_amount": 85000,
  "items": [
    {
      "product_id": "{{product_id}}",
      "quantity": 2,
      "unit_price": 35000,
      "discount_amount": 2000,
      "title": "Lagman Soup"
    },
    {
      "product_id": "{{product_id_2}}",
      "quantity": 1,
      "unit_price": 25000,
      "title": "Manti"
    }
  ]
}
```

### Body fields
| Field | Type | Required | Description |
|---|---|---:|---|
| business_id | string | Yes | Business ID |
| branch_id | string | Yes | Branch ID |
| client_id | string | Yes | Client ID |
| client_address_id | string | Yes | Client address ID |
| channel_order_id | string | Yes | Tashqi yoki custom order ID |
| delivery_address | string | Yes | Yetkazib berish manzili |
| payment_type | string | Yes | To‘lov turi, masalan `CARD` |
| order_type | string | Yes | Buyurtma turi, masalan `DELIVERY` |
| comment | string | No | Qo‘shimcha izoh |
| delivery_fee | number | Yes | Yetkazib berish narxi |
| total_discount | number | No | Umumiy chegirma |
| total_amount | number | Yes | Yakuniy summa |
| items | array | Yes | Order itemlar ro‘yxati |

### Items object
| Field | Type | Required | Description |
|---|---|---:|---|
| product_id | string | Yes | Mahsulot ID |
| quantity | number | Yes | Soni |
| unit_price | number | Yes | Bitta mahsulot narxi |
| discount_amount | number | No | Item bo‘yicha chegirma |
| title | string | Yes | Mahsulot nomi |

### Expected Success Response
Aniq response yo‘q. Kutiladigan javob:

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "order_uuid",
    "status": "CREATED",
    "total_amount": 85000,
    "delivery_fee": 15000,
    "items": [
      {
        "product_id": "product_uuid",
        "quantity": 2,
        "unit_price": 35000
      }
    ]
  }
}
```

### Frontend Notes
- `items.length > 0` bo‘lishi kerak.
- `total_amount`ni frontendda ham hisoblab tekshirish foydali.
- `payment_type` va `order_type` enum sifatida saqlansin.

---

## 2.2 Get Order by ID

Order detailni olish.

- Method: `GET`
- Endpoint: `/api/marketplace/orders/{{order_id}}`
- Full URL: `{{base_url}}/api/marketplace/orders/{{order_id}}`

### Headers
```http
Authorization: Bearer {{access_token}}
```

### Path Params
| Param | Type | Required | Description |
|---|---|---:|---|
| order_id | string | Yes | Order ID |

### Expected Success Response
```json
{
  "success": true,
  "data": {
    "id": "order_uuid",
    "status": "CREATED",
    "business_id": "business_uuid",
    "branch_id": "branch_uuid",
    "client_id": "client_uuid",
    "delivery_address": "123 Main Street, Tashkent",
    "payment_type": "CARD",
    "order_type": "DELIVERY",
    "delivery_fee": 15000,
    "total_discount": 5000,
    "total_amount": 85000,
    "items": [
      {
        "product_id": "product_uuid",
        "quantity": 2,
        "unit_price": 35000,
        "discount_amount": 2000,
        "title": "Lagman Soup"
      }
    ]
  }
}
```

### Frontend Notes
- Order detail page uchun asosiy endpoint.
- `status` bo‘yicha UI badge/rang ishlatish kerak.

---

# 3. Business

Folder: Business

## 3.1 Get Businesses

Marketplace businesslar ro‘yxatini olish.

- Method: `GET`
- Endpoint: `/api/marketplace`
- Full URL: `{{base_url}}/api/marketplace?page=1&limit=20`

### Query Params
| Param | Type | Required | Description |
|---|---|---:|---|
| page | number | No | Sahifa raqami |
| limit | number | No | Sahifadagi elementlar soni |
| countryId | string | No | Country filter |
| regionId | string | No | Region filter |

### Description
Get all marketplace businesses

### Expected Success Response
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "business_uuid",
        "name": "Demo Business",
        "logo": "https://cdn.example.com/logo.png",
        "address": "Tashkent"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100
    }
  }
}
```

### Frontend Notes
- Listing page uchun ishlatiladi.
- `countryId` va `regionId` optional filter sifatida qo‘shilishi mumkin.
- Infinite scroll yoki pagination UI qilish mumkin.

---

## 3.2 Get Banners

Bannerlarni olish.

- Method: `GET`
- Endpoint: `/api/business-banners`
- Full URL: `{{base_url}}/api/business-banners?businessSalesPlatformId={{business_sales_platform_id}}&page=1&limit=20`

### Query Params
| Param | Type | Required | Description |
|---|---|---:|---|
| businessSalesPlatformId | string | Yes | Business Sales Platform ID |
| businessId | string | No | Business ID |
| page | number | No | Sahifa raqami |
| limit | number | No | Sahifadagi elementlar soni |

### Description
List all banners (public)

### Expected Success Response
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "banner_uuid",
        "title": "Big Sale",
        "image": "https://cdn.example.com/banner.jpg",
        "link": "/business/demo"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 10
    }
  }
}
```

### Frontend Notes
- Home page carousel/banner section uchun mos.
- `businessSalesPlatformId` bo‘lmasa request yubormang.

---

## 3.3 Get Business with Locations

Business/location ma’lumotlarini olish.

- Method: `GET`
- Endpoint: `/api/marketplace/locations`
- Full URL: `{{base_url}}/api/marketplace/locations`

### Headers
Header ko‘rsatilmagan.

### Query Params
Yo‘q.

### Expected Success Response
Aniq response yo‘q, ehtimol location-based business list:

```json
{
  "success": true,
  "data": [
    {
      "business_id": "business_uuid",
      "business_name": "Demo Business",
      "locations": [
        {
          "id": "location_uuid",
          "name": "Chilonzor Branch",
          "address": "Tashkent, Chilonzor",
          "lat": 41.2995,
          "lng": 69.2401
        }
      ]
    }
  ]
}
```

### Frontend Notes
- Map view yoki nearest branch UI uchun foydali bo‘lishi mumkin.
- Response shape backenddan tasdiqlanishi kerak.

---

# 4. Error Handling

Aniq response examplelar bo‘lmagani uchun umumiy pattern tavsiya qilinadi.

## 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "phone_number": ["phone_number is required"]
  }
}
```

## 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

## 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

# 5. Frontend Integration Recommendations

## Client auth flow
Tavsiya etilgan flow:

1. `Register Client` yoki `Login Client`
2. `Verify Client`
3. Token qaytsa local auth statega saqlash
4. `Get Client by ID` bilan profilni olish

## Order flow
1. Businesslarni olish
2. Mahsulot/branch/address tanlash
3. `Create Order`
4. `Get Order by ID` orqali detail/status ko‘rish

## Loading states
Har bir request uchun:
- `idle`
- `loading`
- `success`
- `error`

state management ishlatish tavsiya qilinadi.

## Enumlarni frontendda constant qiling
Quyidagilar enum bo‘lishi mumkin:
- `payment_type`: `CARD`, `CASH`, ...
- `order_type`: `DELIVERY`, `PICKUP`, ...
- `status`: `CREATED`, `PENDING`, `COMPLETED`, `CANCELLED`, ...

---

# 6. Documentation Gaps

Hozirgi requestlardan quyidagi narsalar topilmadi:

- saved example response lar
- real response schema
- aniq status code hujjatlari
- field-level validation qoidalari
- enumlarning to‘liq ro‘yxati

Shuning uchun response bo‘limlarining bir qismi `expected/inferred` ko‘rinishda yozildi.

---

# 7. Source Requests

Quyidagi requestlar asosida yozildi:

## Marketplace Orders
- Create Order
- Get Order by ID

## Marketplace Clients
- Register Client
- Login Client
- Verify Client
- Resend Code
- Get Client by ID

## Business
- Get Businesses
- Get Banners
- get business with locations
```

Agar xohlasangiz, keyingi qadamda men buni yana qulayroq formatga ham o‘tkazib beraman:

1. `README.md` ko‘rinishida silliq, production-ready variant
2. har bir endpoint uchun alohida `.md` section
3. frontend uchun `TypeScript interface`lar bilan birga
4. `request/response`larni jadval bilan yanada professional ko‘rinishda
5. real response yo‘qligi sabab `mock JSON`lar ham tayyorlab beraman

Agar xohlasangiz, hozirning o‘zida men buni:
- `frontend-ready README.md`
- `TypeScript types`
- `Axios service examples`

ko‘rinishida davom ettirib beraman.

Albatta. `Marketplace` ichidagi barcha requestlarni ko‘rib chiqdim va frontendchilar uchun to‘liq Markdown formatda hujjat tayyorlab berdim.

Muhim eslatma:
- Request endpointlari va bodylari aniq ko‘rindi.
- Lekin saqlangan `example response`lar topilmadi, shuning uchun response bo‘limida:
  - aniq tasdiqlangan joylarni yozdim,
  - qolgan joylarda esa `expected/inferred` deb belgiladim.
- Asosiy papka: [Marketplace](folder/50572801-21ed8769-133d-4f84-9212-f4f519ab05e4)

Quyida tayyor `.md` kontent:

```md
# Marketplace API Documentation
Frontend developers uchun to‘liq qo‘llanma

## Base URL
Barcha endpointlar quyidagi base URL bilan ishlaydi:

`{{base_url}}`

Misol:
```http
{{base_url}}/api/marketplace
```

## Authentication

Ba’zi endpointlar `Authorization` header talab qiladi:

```http
Authorization: Bearer {{access_token}}
```

## Ishlatiladigan o‘zgaruvchilar

Quyidagi variablelar requestlarda ishlatilgan:

- `{{base_url}}`
- `{{access_token}}`
- `{{business_id}}`
- `{{branch_id}}`
- `{{client_id}}`
- `{{client_address_id}}`
- `{{product_id}}`
- `{{product_id_2}}`
- `{{order_id}}`
- `{{country_id}}`
- `{{region_id}}`
- `{{business_sales_platform_id}}`

---

# 1. Marketplace Clients

Folder: Marketplace Clients

## 1.1 Register Client

Clientni ro‘yxatdan o‘tkazish.

- Method: `POST`
- Endpoint: `/api/marketplace/clients/register`
- Full URL: `{{base_url}}/api/marketplace/clients/register`

### Headers
```http
Content-Type: application/json
```

### Request Body
```json
{
  "name": "John Doe",
  "phone_number": "998901234567",
  "email": "john@example.com"
}
```

### Body fields
| Field | Type | Required | Description |
|---|---|---:|---|
| name | string | Yes | Client full name |
| phone_number | string | Yes | Telefon raqami |
| email | string | Yes | Email manzil |

### Expected Success Response
Aniq saved response yo‘q, lekin odatda quyidagicha bo‘lishi mumkin:

```json
{
  "success": true,
  "message": "Client registered successfully",
  "data": {
    "id": "client_uuid",
    "name": "John Doe",
    "phone_number": "998901234567",
    "email": "john@example.com"
  }
}
```

### Frontend Notes
- `phone_number` formatini oldindan validatsiya qiling.
- Register’dan keyin login/verify flow boshlanishi mumkin.

---

## 1.2 Login Client

Client login jarayonini boshlash.

- Method: `POST`
- Endpoint: `/api/marketplace/clients/login`
- Full URL: `{{base_url}}/api/marketplace/clients/login`

### Headers
```http
Content-Type: application/json
```

### Request Body
```json
{
  "phone_number": "998901234567"
}
```

### Body fields
| Field | Type | Required | Description |
|---|---|---:|---|
| phone_number | string | Yes | Login uchun telefon raqam |

### Expected Success Response
Aniq saved response topilmadi. Ehtimol verification jarayoni uchun `clientId` qaytadi:

```json
{
  "success": true,
  "message": "Verification code sent",
  "data": {
    "clientId": "client_uuid"
  }
}
```

### Frontend Notes
- Bu endpoint odatda OTP/code yuborish uchun ishlatiladi.
- Keyingi qadam: `Verify Client`.

---

## 1.3 Verify Client

Clientni OTP/kod orqali tasdiqlash.

- Method: `POST`
- Endpoint: `/api/marketplace/clients/verify`
- Full URL: `{{base_url}}/api/marketplace/clients/verify`

### Headers
```http
Content-Type: application/json
```

### Request Body
```json
{
  "clientId": "{{client_id}}",
  "code": 123456
}
```

### Body fields
| Field | Type | Required | Description |
|---|---|---:|---|
| clientId | string | Yes | Login/registerdan qaytgan client ID |
| code | number | Yes | SMS/OTP verification code |

### Expected Success Response
Saved example yo‘q. Odatda token yoki client ma’lumoti qaytishi mumkin:

```json
{
  "success": true,
  "message": "Client verified successfully",
  "data": {
    "access_token": "jwt_or_session_token",
    "client": {
      "id": "client_uuid",
      "name": "John Doe",
      "phone_number": "998901234567"
    }
  }
}
```

### Frontend Notes
- `code` maydoni 6 xonali formatda bo‘lishi mumkin.
- Verify muvaffaqiyatli bo‘lsa auth state yangilanadi.

---

## 1.4 Resend Code

Tasdiqlash kodini qayta yuborish.

- Method: `POST`
- Endpoint: `/api/marketplace/clients/resend-code`
- Full URL: `{{base_url}}/api/marketplace/clients/resend-code`

### Headers
```http
Content-Type: application/json
```

### Request Body
```json
{
  "clientId": "{{client_id}}"
}
```

### Body fields
| Field | Type | Required | Description |
|---|---|---:|---|
| clientId | string | Yes | Client ID |

### Expected Success Response
```json
{
  "success": true,
  "message": "Code resent successfully"
}
```

### Frontend Notes
- Resend tugmasiga timer qo‘ying.
- Spamni oldini olish uchun cooldown UI ishlating.

---

## 1.5 Get Client by ID

Client ma’lumotlarini olish.

- Method: `GET`
- Endpoint: `/api/marketplace/clients/{{client_id}}`
- Full URL: `{{base_url}}/api/marketplace/clients/{{client_id}}`

### Headers
```http
Authorization: Bearer {{access_token}}
```

### Path Params
| Param | Type | Required | Description |
|---|---|---:|---|
| client_id | string | Yes | Client ID |

### Expected Success Response
```json
{
  "success": true,
  "data": {
    "id": "client_uuid",
    "name": "John Doe",
    "phone_number": "998901234567",
    "email": "john@example.com"
  }
}
```

### Frontend Notes
- Profil sahifasi uchun ishlatish mumkin.
- 401 holatda userni qayta login flowga yuborish kerak.

---

# 2. Marketplace Orders

Folder: Marketplace Orders

## 2.1 Create Order

Yangi marketplace order yaratish.

- Method: `POST`
- Endpoint: `/api/marketplace/orders`
- Full URL: `{{base_url}}/api/marketplace/orders`

### Headers
```http
Content-Type: application/json
Authorization: Bearer {{access_token}}
```

### Request Body
```json
{
  "business_id": "{{business_id}}",
  "branch_id": "{{branch_id}}",
  "client_id": "{{client_id}}",
  "client_address_id": "{{client_address_id}}",
  "channel_order_id": "ORD-12345",
  "delivery_address": "123 Main Street, Tashkent",
  "payment_type": "CARD",
  "order_type": "DELIVERY",
  "comment": "Extra napkins please",
  "delivery_fee": 15000,
  "total_discount": 5000,
  "total_amount": 85000,
  "items": [
    {
      "product_id": "{{product_id}}",
      "quantity": 2,
      "unit_price": 35000,
      "discount_amount": 2000,
      "title": "Lagman Soup"
    },
    {
      "product_id": "{{product_id_2}}",
      "quantity": 1,
      "unit_price": 25000,
      "title": "Manti"
    }
  ]
}
```

### Body fields
| Field | Type | Required | Description |
|---|---|---:|---|
| business_id | string | Yes | Business ID |
| branch_id | string | Yes | Branch ID |
| client_id | string | Yes | Client ID |
| client_address_id | string | Yes | Client address ID |
| channel_order_id | string | Yes | Tashqi yoki custom order ID |
| delivery_address | string | Yes | Yetkazib berish manzili |
| payment_type | string | Yes | To‘lov turi, masalan `CARD` |
| order_type | string | Yes | Buyurtma turi, masalan `DELIVERY` |
| comment | string | No | Qo‘shimcha izoh |
| delivery_fee | number | Yes | Yetkazib berish narxi |
| total_discount | number | No | Umumiy chegirma |
| total_amount | number | Yes | Yakuniy summa |
| items | array | Yes | Order itemlar ro‘yxati |

### Items object
| Field | Type | Required | Description |
|---|---|---:|---|
| product_id | string | Yes | Mahsulot ID |
| quantity | number | Yes | Soni |
| unit_price | number | Yes | Bitta mahsulot narxi |
| discount_amount | number | No | Item bo‘yicha chegirma |
| title | string | Yes | Mahsulot nomi |

### Expected Success Response
Aniq response yo‘q. Kutiladigan javob:

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "order_uuid",
    "status": "CREATED",
    "total_amount": 85000,
    "delivery_fee": 15000,
    "items": [
      {
        "product_id": "product_uuid",
        "quantity": 2,
        "unit_price": 35000
      }
    ]
  }
}
```

### Frontend Notes
- `items.length > 0` bo‘lishi kerak.
- `total_amount`ni frontendda ham hisoblab tekshirish foydali.
- `payment_type` va `order_type` enum sifatida saqlansin.

---

## 2.2 Get Order by ID

Order detailni olish.

- Method: `GET`
- Endpoint: `/api/marketplace/orders/{{order_id}}`
- Full URL: `{{base_url}}/api/marketplace/orders/{{order_id}}`

### Headers
```http
Authorization: Bearer {{access_token}}
```

### Path Params
| Param | Type | Required | Description |
|---|---|---:|---|
| order_id | string | Yes | Order ID |

### Expected Success Response
```json
{
  "success": true,
  "data": {
    "id": "order_uuid",
    "status": "CREATED",
    "business_id": "business_uuid",
    "branch_id": "branch_uuid",
    "client_id": "client_uuid",
    "delivery_address": "123 Main Street, Tashkent",
    "payment_type": "CARD",
    "order_type": "DELIVERY",
    "delivery_fee": 15000,
    "total_discount": 5000,
    "total_amount": 85000,
    "items": [
      {
        "product_id": "product_uuid",
        "quantity": 2,
        "unit_price": 35000,
        "discount_amount": 2000,
        "title": "Lagman Soup"
      }
    ]
  }
}
```

### Frontend Notes
- Order detail page uchun asosiy endpoint.
- `status` bo‘yicha UI badge/rang ishlatish kerak.

---

# 3. Business

Folder: Business

## 3.1 Get Businesses

Marketplace businesslar ro‘yxatini olish.

- Method: `GET`
- Endpoint: `/api/marketplace`
- Full URL: `{{base_url}}/api/marketplace?page=1&limit=20`

### Query Params
| Param | Type | Required | Description |
|---|---|---:|---|
| page | number | No | Sahifa raqami |
| limit | number | No | Sahifadagi elementlar soni |
| countryId | string | No | Country filter |
| regionId | string | No | Region filter |

### Description
Get all marketplace businesses

### Expected Success Response
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "business_uuid",
        "name": "Demo Business",
        "logo": "https://cdn.example.com/logo.png",
        "address": "Tashkent"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100
    }
  }
}
```

### Frontend Notes
- Listing page uchun ishlatiladi.
- `countryId` va `regionId` optional filter sifatida qo‘shilishi mumkin.
- Infinite scroll yoki pagination UI qilish mumkin.

---

## 3.2 Get Banners

Bannerlarni olish.

- Method: `GET`
- Endpoint: `/api/business-banners`
- Full URL: `{{base_url}}/api/business-banners?businessSalesPlatformId={{business_sales_platform_id}}&page=1&limit=20`

### Query Params
| Param | Type | Required | Description |
|---|---|---:|---|
| businessSalesPlatformId | string | Yes | Business Sales Platform ID |
| businessId | string | No | Business ID |
| page | number | No | Sahifa raqami |
| limit | number | No | Sahifadagi elementlar soni |

### Description
List all banners (public)

### Expected Success Response
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "banner_uuid",
        "title": "Big Sale",
        "image": "https://cdn.example.com/banner.jpg",
        "link": "/business/demo"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 10
    }
  }
}
```

### Frontend Notes
- Home page carousel/banner section uchun mos.
- `businessSalesPlatformId` bo‘lmasa request yubormang.

---

## 3.3 Get Business with Locations

Business/location ma’lumotlarini olish.

- Method: `GET`
- Endpoint: `/api/marketplace/locations`
- Full URL: `{{base_url}}/api/marketplace/locations`

### Headers
Header ko‘rsatilmagan.

### Query Params
Yo‘q.

### Expected Success Response
Aniq response yo‘q, ehtimol location-based business list:

```json
{
  "success": true,
  "data": [
    {
      "business_id": "business_uuid",
      "business_name": "Demo Business",
      "locations": [
        {
          "id": "location_uuid",
          "name": "Chilonzor Branch",
          "address": "Tashkent, Chilonzor",
          "lat": 41.2995,
          "lng": 69.2401
        }
      ]
    }
  ]
}
```

### Frontend Notes
- Map view yoki nearest branch UI uchun foydali bo‘lishi mumkin.
- Response shape backenddan tasdiqlanishi kerak.

---

# 4. Error Handling

Aniq response examplelar bo‘lmagani uchun umumiy pattern tavsiya qilinadi.

## 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "phone_number": ["phone_number is required"]
  }
}
```

## 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

## 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

# 5. Frontend Integration Recommendations

## Client auth flow
Tavsiya etilgan flow:

1. `Register Client` yoki `Login Client`
2. `Verify Client`
3. Token qaytsa local auth statega saqlash
4. `Get Client by ID` bilan profilni olish

## Order flow
1. Businesslarni olish
2. Mahsulot/branch/address tanlash
3. `Create Order`
4. `Get Order by ID` orqali detail/status ko‘rish

## Loading states
Har bir request uchun:
- `idle`
- `loading`
- `success`
- `error`

state management ishlatish tavsiya qilinadi.

## Enumlarni frontendda constant qiling
Quyidagilar enum bo‘lishi mumkin:
- `payment_type`: `CARD`, `CASH`, ...
- `order_type`: `DELIVERY`, `PICKUP`, ...
- `status`: `CREATED`, `PENDING`, `COMPLETED`, `CANCELLED`, ...

---

# 6. Documentation Gaps

Hozirgi requestlardan quyidagi narsalar topilmadi:

- saved example response lar
- real response schema
- aniq status code hujjatlari
- field-level validation qoidalari
- enumlarning to‘liq ro‘yxati

Shuning uchun response bo‘limlarining bir qismi `expected/inferred` ko‘rinishda yozildi.

---

# 7. Source Requests

Quyidagi requestlar asosida yozildi:

## Marketplace Orders
- Create Order
- Get Order by ID

## Marketplace Clients
- Register Client
- Login Client
- Verify Client
- Resend Code
- Get Client by ID

## Business
- Get Businesses
- Get Banners
- get business with locations
```

Agar xohlasangiz, keyingi qadamda men buni yana qulayroq formatga ham o‘tkazib beraman:

1. `README.md` ko‘rinishida silliq, production-ready variant
2. har bir endpoint uchun alohida `.md` section
3. frontend uchun `TypeScript interface`lar bilan birga
4. `request/response`larni jadval bilan yanada professional ko‘rinishda
5. real response yo‘qligi sabab `mock JSON`lar ham tayyorlab beraman

Agar xohlasangiz, hozirning o‘zida men buni:
- `frontend-ready README.md`
- `TypeScript types`
- `Axios service examples`

ko‘rinishida davom ettirib beraman.

