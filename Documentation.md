# 📑 Documentation API Authentification

## 1️⃣ Register (Inscription)

- **URL** : `/api/auth/register`
- **Méthode** : `POST`
- **Description** : Crée un nouvel utilisateur (chauffeur ou admin).

### Body (JSON)
```json
{
  "nom": "baalla",
  "prenom": "abdelhakim",
  "email": "baalla@example.com",
  "password": "password123",
  "role": "chauffeur" // ou "admin"
}
```

### Réponse (succès)
```json
{
  "message": "Utilisateur créé avec succès",
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "user": {
    "id": "id_utilisateur",
    "nom": "baalla",
    "prenom": "abdelhakim",
    "email": "baalla@example.com",
    "role": "chauffeur"
  }
}
```

---

## 2️⃣ Login (Connexion)

- **URL** : `/api/auth/login`
- **Méthode** : `POST`
- **Description** : Authentifie un utilisateur et retourne les tokens JWT.

### Body (JSON)
```json
{
  "email": "baalla@example.com",
  "password": "password123"
}
```

### Réponse (succès)
```json
{
  "message": "Connexion réussie",
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "user": {
    "id": "id_utilisateur",
    "nom": "baalla",
    "prenom": "abdelhakim",
    "email": "baalla@example.com",
    "role": "chauffeur"
  }
}
```

---

## 🛑 Erreurs possibles

- Email déjà utilisé (register)
- Email ou mot de passe incorrect (login)
- Champs manquants

---

## 🔒 Sécurité

- Les tokens JWT doivent être stockés côté client (localStorage ou cookie sécurisé).
- Utiliser le `refreshToken` pour renouveler l'accessToken via `/api/auth/refresh`.

---


# 🚛 Documentation API Camions

## 📋 Endpoints Camions

### 1. Obtenir tous les camions

- **URL** : `/api/camions`
- **Méthode** : `GET`
- **Authentification** : ✅ Requise (Admin)
- **Description** : Récupère la liste de tous les camions.

**Headers** :
```
Authorization: Bearer {accessToken}
```

**Réponse (succès)** :
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "675a1b2c3d4e5f6g7h8i",
      "matricule": "AA-123-BB",
      "marque": "Volvo",
      "modele": "FH16",
      "kilometrage": 150000,
      "etatPneu": "bon",
      "capaciteCharge": 25000,
      "anneeFabrication": 2020,
      "carburantRestant": 450,
      "etatGeneral": "bon",
      "estActif": true,
      "derniereMaintenanceDate": "2024-10-15T10:30:00Z",
      "prochainEntretien": "2025-01-15T00:00:00Z",
      "remarques": "Contrôle OK",
      "createdAt": "2024-12-09T15:20:00Z",
      "updatedAt": "2024-12-09T15:20:00Z"
    }
  ]
}
```

---

### 2. Obtenir un camion par ID

- **URL** : `/api/camions/:id`
- **Méthode** : `GET`
- **Authentification** : ✅ Requise (Admin)

**Paramètres** :
- `id` (string) : ID du camion

**Headers** :
```
Authorization: Bearer {accessToken}
```

**Réponse (succès)** :
```json
{
  "success": true,
  "data": {
    "_id": "675a1b2c3d4e5f6g7h8i",
    "matricule": "AA-123-BB",
    "marque": "Volvo",
    "modele": "FH16",
    ...
  }
}
```

---

### 3. Créer un nouveau camion

- **URL** : `/api/camions`
- **Méthode** : `POST`
- **Authentification** : ✅ Requise (Admin)
- **Description** : Ajoute un nouveau camion à la flotte.

**Headers** :
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Body (JSON)** :
```json
{
  "matricule": "AA-123-BB",
  "marque": "Volvo",
  "modele": "FH16",
  "capaciteCharge": 25000,
  "anneeFabrication": 2020,
  "etatGeneral": "bon",
  "remarques": "Camion en bon état"
}
```

**Réponse (succès - 201)** :
```json
{
  "success": true,
  "message": "Camion créé avec succès",
  "data": {
    "_id": "675a1b2c3d4e5f6g7h8i",
    "matricule": "AA-123-BB",
    "marque": "Volvo",
    "modele": "FH16",
    "kilometrage": 0,
    "etatPneu": "bon",
    "capaciteCharge": 25000,
    "anneeFabrication": 2020,
    "carburantRestant": 0,
    "etatGeneral": "bon",
    "estActif": true,
    ...
  }
}
```

**Erreurs possibles** :
- `400` : Champs manquants ou matricule déjà existant
- `401` : Non authentifié
- `403` : Non autorisé (pas admin)

---

### 4. Modifier un camion

- **URL** : `/api/camions/:id`
- **Méthode** : `PUT`
- **Authentification** : ✅ Requise (Admin)

**Paramètres** :
- `id` (string) : ID du camion à modifier

**Headers** :
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Body (JSON)** - Tous les champs sont optionnels :
```json
{
  "matricule": "AA-123-BB",
  "marque": "Volvo",
  "modele": "FH16",
  "kilometrage": 155000,
  "etatPneu": "moyen",
  "capaciteCharge": 25000,
  "anneeFabrication": 2020,
  "carburantRestant": 400,
  "etatGeneral": "bon",
  "estActif": true,
  "remarques": "Vidange effectuée"
}
```

**Réponse (succès)** :
```json
{
  "success": true,
  "message": "Camion modifié avec succès",
  "data": { ... }
}
```

---

### 5. Supprimer un camion

- **URL** : `/api/camions/:id`
- **Méthode** : `DELETE`
- **Authentification** : ✅ Requise (Admin)

**Headers** :
```
Authorization: Bearer {accessToken}
```

**Réponse (succès)** :
```json
{
  "success": true,
  "message": "Camion supprimé avec succès",
  "data": { ... }
}
```

---

### 6. Obtenir les camions actifs

- **URL** : `/api/camions/actifs`
- **Méthode** : `GET`
- **Authentification** : ✅ Requise (Admin)

**Réponse (succès)** :
```json
{
  "success": true,
  "count": 1,
  "data": [ ... ]
}
```

---

### 7. Mettre à jour le kilométrage

- **URL** : `/api/camions/:id/kilometrage`
- **Méthode** : `PATCH`
- **Authentification** : ✅ Requise (Chauffeur ou Admin)
- **Description** : Met à jour le kilométrage après un trajet.

**Headers** :
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Body (JSON)** :
```json
{
  "kilometrage": 155000
}
```

**Réponse (succès)** :
```json
{
  "success": true,
  "message": "Kilométrage mis à jour",
  "data": { ... }
}
```

---

## 🧪 Tests avec Postman

### Collection Camions
Créer une collection "TrackFlow - Camions" avec les requêtes suivantes :

**1. Create Camion**
```
POST http://localhost:5000/api/camions
Headers: Authorization: Bearer {token}
Body: JSON (voir exemple ci-dessus)
```

**2. Get All Camions**
```
GET http://localhost:5000/api/camions
Headers: Authorization: Bearer {token}
```

**3. Get Camion by ID**
```
GET http://localhost:5000/api/camions/675a1b2c3d4e5f6g7h8i
Headers: Authorization: Bearer {token}
```

**4. Update Camion**
```
PUT http://localhost:5000/api/camions/675a1b2c3d4e5f6g7h8i
Headers: Authorization: Bearer {token}
Body: JSON (champs à modifier)
```

**5. Delete Camion**
```
DELETE http://localhost:5000/api/camions/675a1b2c3d4e5f6g7h8i
Headers: Authorization: Bearer {token}
```

**6. Update Kilométrage**
```
PATCH http://localhost:5000/api/camions/675a1b2c3d4e5f6g7h8i/kilometrage
Headers: Authorization: Bearer {token}
Body: { "kilometrage": 155000 }
```

---

## 📊 Codes d'erreur

| Code | Signification |
|------|---------------|
| 200 | OK (succès) |
| 201 | Created (création réussie) |
| 400 | Bad Request (données invalides) |
| 401 | Unauthorized (pas d'authentification) |
| 403 | Forbidden (accès refusé - pas admin) |
| 404 | Not Found (camion non trouvé) |
| 500 | Internal Server Error |

---

## 🔐 Sécurité

- ✅ Authentification JWT requise
- ✅ Autorisation par rôle (Admin pour CRUD)
- ✅ Validation des données entrantes
- ✅ Matricule unique