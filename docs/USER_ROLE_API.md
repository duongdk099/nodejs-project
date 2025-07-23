# User Role Management API

## Set User Role

**Endpoint:** `PUT /api/v1/users/:id/role`

**Description:** Allows super_admin users to change the role of other users.

**Authorization:** Requires authentication and super_admin role.

**Request Body:**
```json
{
  "role": "proprietaire_salle"
}
```

**Valid Roles:**
- `super_admin`
- `proprietaire_salle` 
- `client`

**Response (Success):**
```json
{
  "message": "User role updated successfully",
  "user": {
    "id": "64a7b8c9d1e2f3g4h5i6j7k8",
    "nom": "John Doe",
    "email": "john.doe@example.com",
    "role": "proprietaire_salle",
    "statut": true
  }
}
```

**Error Responses:**

**400 Bad Request - Invalid Role:**
```json
{
  "message": "Invalid role. Must be one of: super_admin, proprietaire_salle, client"
}
```

**403 Forbidden - Self Role Change:**
```json
{
  "message": "Cannot change your own role"
}
```

**404 Not Found:**
```json
{
  "message": "User not found"
}
```

## Example Usage

```bash
# Set user role to proprietaire_salle
curl -X PUT http://localhost:3000/api/v1/users/64a7b8c9d1e2f3g4h5i6j7k8/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-super-admin-jwt-token" \
  -d '{"role": "proprietaire_salle"}'

# Set user role to client
curl -X PUT http://localhost:3000/api/v1/users/64a7b8c9d1e2f3g4h5i6j7k8/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-super-admin-jwt-token" \
  -d '{"role": "client"}'
```

## Security Features

1. **Role Validation:** Only accepts valid roles from the predefined list
2. **Self-Protection:** Prevents administrators from changing their own role
3. **Authorization:** Only super_admin users can change roles
4. **Password Exclusion:** Response excludes sensitive password data
5. **Database Validation:** Uses MongoDB validation for role constraints
