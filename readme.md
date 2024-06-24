# FormSmith

It is a Dynamic Form Builder. Here you can create forms.


## How to run
### Server-Side
1. First make an virtual enviroment
    ```bash
    python -m venv venv
    ```
2. Activate enviroment
   - Windows cmd
    ```bash
    "venv/Scripts/activate"
    ```
    - Linux Terminal
    ```bash
    ./venv/Scripts/activate
    ```
2. Install Python Packages
    ```bash
    pip install -r requirements.txt
    ```
3. Start Server
    ```bash
    uvicorn server.main:app --reload
    ```
### Client
1. Change directory to client
   ```bash
   cd client
   ```
2. Run React application
   ```bash
   npm run dev
   ```
## Roadmap
### Features
It would have the following features:
| #  | Feature                     | Status                |
| :-:| :-------------------------- | :-------------------- |
| 1. | User login and registration | :construction:        |
| 2. | Creating of Form            | :construction:        |
| 3. | Updating of Form            | :construction:        |
| 4. | Deleting of Form            | :construction:        |


![img](./images/features.png)

## Backend
### `/auth` Endpoints
#### `/register` endpoint
A api endpoint to register a user with the provided form data. The method is `POST`
**Request body:**
```json
{
  "username": "hariskhan",
  "password": "password"
}
```
**Response:**
1. User registered successfully
```json
{
  "access_token": "token",
  "token_type": "bearer"
}
```
2. User already exists
```json
{
  "detail": "User already exists"
}
```
3. And, default validation errors that caused due to `pydantic` models
#### `/login` endpoint
A api endpoint to authenticate a user based on the provided username and password. The method is `POST`
**Request body:**
```json
{
  "username": "hariskhan",
  "password": "password"
}
```
**Response:**
1. User authenticated successfully
```json
{
  "access_token": "token",
  "token_type": "bearer"
}
```
2. Incorrect username or password
```json
{
  "detail": "Incorrect username or password"
}
```
3. And, default validation errors that caused due to `pydantic` models

 

### `/forms` Endpoints
#### `/all` endpoint

This endpoint returns a list of all forms in the database of the authenticated user. The method used is `GET`.

**Request:**
 - **Headers:** 
   `Authorization: Bearer <token>`

**Response:**
1. **List of forms**
   ```json
   {
     "data": [
       {
         "_id": "form_id",
         "user_id": "user_id",
         "field1": "value1",
         "field2": "value2"
       },
       ...
     ]
   }
2. Not authenticated
    ```json
    {
    "detail": "Not authenticated"
    }
    ```
#### `/create` endpoint
This endpoint creates a new form in the database. The method used is `POST`.

**Request:**

- **Headers:**
    ``Authorization: Bearer <token>``
- **Body:**
    ```json
    {
    "title": "My Form",
    "description": "This is my form",
    "fields": [
            {
            "type": "string",
            "label": "Name",
            "required": true,
            "placeholder": "Enter your name"
            }
            ...
        ]
    }
    ```
**Response:**

1. Form created successfully
    ```json
    {
    "message": "Form created successfully",
    "data": {
        "_id": "form_id",
        "user_id": "user_id",
        "description": "This is my form",
        "fields": [
                {
                "type": "string",
                "label": "Name",
                "required": true,
                "placeholder": "Enter your name"
                }
                ...
            ]
        }
    }
    ```
1. Not authenticated
    ```json
        {
        "detail": "Not authenticated"
        }
    ```

#### `/delete/{form_id}` endpoint
This endpoint deletes a form from the database. The method used is DELETE.

**Request:**

- **Headers:**
`Authorization: Bearer <token>`

**Response:**

1. Form deleted successfully
    ```json
    {
    "message": "Form deleted successfully"
    }
    ```
1. Not authenticated
    ```json
    {
    "detail": "Not authenticated"
    }
    ```
#### `/{form_id}` endpoint
This endpoint retrieves a form from the database. The method used is `GET`.

**Request:**

- **Path Parameter:**
`form_id`: The ID of the form to be retrieved.
**Response:**
    ```json
    {
    "title": "My Form",
    "user_id":"string"
    "description": "This is my form",
    "fields": [
            {
            "type": "string",
            "label": "Name",
            "required": true,
            "placeholder": "Enter your name"
            }
        ]
    }
    ```
#### `/update/{form_id}` endpoint (GET)
This endpoint retrieves a form for updating. The method used is `GET`.

**Request:**

- **Headers:**
`Authorization: Bearer <token>`

**Response:**
1. Form Found
    ```json
    {
    "title": "My Form",
    "user_id":"string"
    "description": "This is my form",
    "fields": [
            {
            "type": "string",
            "label": "Name",
            "required": true,
            "placeholder": "Enter your name"
            },
            ...
        ]
    }
2. Form not found
    ```json
    {
    "detail": "Form not found"
    }
    ```
#### `/update/{form_id}` endpoint (PUT)
This endpoint updates a form in the database. The method used is `PUT`.

**Request:**

- **Headers:**
`Authorization: Bearer <token>`

- **Body:**
    ```json
    {
    "field1": "value1",
    "field2": "value2"
    }
    ```
**Response:**

1. Form updated successfully
    ```json
    {
    "message": "Form updated successfully"
    }
    ```
2. Not authenticated
    ```json
    {
    "detail": "Not authenticated"
    }
    ```
#### `/submit/{form_id}` endpoint
This endpoint submits a form in the database. The method used is `POST`.

**Request:**

- **Body:**
    ```json
    {
    "response_field1": "response_value1",
    "response_field2": "response_value2"
    }
    ```
**Response:**

1. Form submitted successfully
    ```json
    {
    "message": "Form submitted successfully"
    }
    ```
2. Form not found
    ```json
    {
    "detail": "Form not found"
    }
    ```
#### `/responses/{form_id}` endpoint
This endpoint retrieves responses for a specific form. The method used is `GET`.

**Request:**

- **Path Parameter:**
`form_id`: The ID of the form to get responses for.

**Response:**

1. List of responses
    ```json
    [
        {
            "response_field1": "response_value1",
            "response_field2": "response_value2"
        },
       ...
    ]
    ```
`/responses/{form_id}/{response_id}` endpoint
This endpoint retrieves a specific response for a form. The method used is `GET`.

**Request:**

- **Path Parameters:**
    - `form_id`: The ID of the form.
    - `response_id`: The ID of the response.

**Response:**

1. Form Response data
    ```json
    {
    "response_field1": "response_value1",
    "response_field2": "response_value2"
    }
    ```


## Frontend
1. Login page
2. Signup page
2. Dashboard (old forms and new form)
    - if new user enter only new button
3. Individual form page
4. Update form page
5. Form Single Responses page 
6. Form response data in tabular
---
