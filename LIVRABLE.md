# Livrable — Projet de Fin de Module "Build & Ship"

**Module :** Architecture Cloud & Vibe Programming — ESTIN 2025-2026
**Enseignante :** Mme Rania SAIDI — `r_saidi@estin.dz`
**Rendu :** 10 mai 2026

---

## Équipe

| | |
|---|---|
| **Thème** | Support Informatique — **IT-Fix** |
| **Mapping** | A = Employés · B = Techniciens · C = Tickets de panne · Fichier = Capture d'écran du bug |
| **Membres** | Rania SAIDI · Manel KHOUNI · Raghed Nesrine ARIF |

---

## Liens du projet

| Ressource | URL |
|---|---|
| 🚀 **Application en production** (Vercel) | https://project-it-fix.vercel.app |
| 📦 **Dépôt GitHub** | https://github.com/raniasss/project-IT-Fix |
| 🗄️ Base de données | Supabase PostgreSQL (infra managée) |

---

## Compte de test pour l'évaluation

- **Email :** `demo@it-fix.dz`
- **Mot de passe :** `demoitfix`

Ce compte contient des tickets de démonstration. Il permet à l'enseignant de tester le flux complet : **Connexion → Consultation des techniciens → Création d'un ticket avec capture d'écran → Dashboard personnel** — ainsi que la vérification de l'isolation RLS (un 2e compte créé ne verra jamais les tickets du premier).

---

## Stack technologique

| Couche | Technologie | Rôle |
|---|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind | UI, rendu serveur |
| Auth | Supabase Auth (email/password) | Inscription, sessions |
| Base de données | Supabase Postgres + **Row Level Security** | Tables A/B/C, isolation |
| Stockage | Supabase Storage (bucket privé) | Captures d'écran des bugs |
| Hébergement & CI/CD | Vercel + GitHub | Déploiement automatique sur `git push` |

---

> Document d'une page. Détails d'implémentation et analyse d'architecture (CAPEX/OPEX, scalabilité serverless, données structurées/non-structurées) dans le fichier `README.md` du dépôt.
