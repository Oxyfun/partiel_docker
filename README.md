# Gestion des notes — Conteneurisation Docker

Application full stack de gestion des notes d'élèves, conteneurisée avec Docker et orchestrée via Docker Compose.

**Repository Git :** https://github.com/Oxyfun/partiel_docker

**Docker Hub :**
- [oxyfun/notes-back](https://hub.docker.com/r/oxyfun/notes-back)
- [oxyfun/notes-front](https://hub.docker.com/r/oxyfun/notes-front)

---

## Services

| Service | Image | Port | Rôle |
|---------|-------|-------------|------|
| `db` | `mysql:9.6.0` | 3306 | Base de données MySQL |
| `back` | build `./back` | 3000 | API REST Node.js |
| `front` | build `./front` | 80 | Interface HTML via Nginx |

## Réseau

Un réseau bridge personnalisé `app-network` connecte les trois services. Le back communique avec la DB via le nom DNS Docker `db` sur le port 3306.

## Volume

`mysql_data` : volume Docker géré pour la persistance des données MySQL (`/var/lib/mysql`).

## Secrets

Les mots de passe sensibles sont stockés dans des fichiers `.secret` montés dans `/run/secrets/` à l'intérieur des conteneurs :
- `db_root_password`
- `db_password`

MySQL les lit via `MYSQL_ROOT_PASSWORD_FILE` et `MYSQL_PASSWORD_FILE`. Le back les lit via le script `start.sh` avant de démarrer Node.js.

---

## Lancer l'application

```bash
docker compose up --build -d
```

## Tester la communication entre conteneurs

**Linux / macOS :**
```bash
# Vérifier que les 3 conteneurs tournent
docker compose ps

# Tester le back → DB (retourne [] si vide)
curl http://localhost:3000/api/notes

# Ajouter une note
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"eleve":"Camille","matiere":"Assambleur","note":0}'

# Vérifier que la note est stockée
curl http://localhost:3000/api/notes
```

**Windows (PowerShell) :**
```powershell
# Vérifier que les 3 conteneurs tournent
docker compose ps

# Tester le back → DB (retourne [] si vide)
Invoke-RestMethod http://localhost:3000/api/notes

# Ajouter une note
Invoke-RestMethod -Uri http://localhost:3000/api/notes -Method Post -ContentType "application/json" -Body '{"eleve":"Camille","matiere":"Assambleur","note":0}'

# Vérifier que la note est stockée
Invoke-RestMethod http://localhost:3000/api/notes
```

---

## Tester la persistance des données

**Linux / macOS :**
```bash
# Arrêter les conteneurs SANS supprimer le volume
docker compose down

# Relancer
docker compose up -d

# Les notes sont toujours présentes
curl http://localhost:3000/api/notes
```

**Windows (PowerShell) :**
```powershell
# Arrêter les conteneurs SANS supprimer le volume
docker compose down

# Relancer
docker compose up -d

# Les notes sont toujours présentes
Invoke-RestMethod http://localhost:3000/api/notes
```

---

## Vérifier les volumes et réseaux

```bash
docker volume ls
docker volume inspect partiel_docker_mysql_data

docker network ls
docker network inspect partiel_docker_app-network
```

---

## Voir les logs

```bash
docker compose logs db
docker compose logs back
docker compose logs front
```

---

## Arrêter et nettoyer

```bash
# Arrêter sans supprimer les données
docker compose down

# Tout supprimer (conteneurs, images, volumes, réseaux)
docker compose down --volumes --rmi all --remove-orphans
```
