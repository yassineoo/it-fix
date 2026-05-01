# IT-Fix — Support Informatique

> Projet de fin de module **Build & Ship — Architecture Cloud & Vibe Programming**
> Binôme / trinôme : **Rania Saidi · Manel Khouni · Raghed Nesrine Arif**
> Stack : **Next.js 14 (App Router) · Supabase · Vercel · TypeScript · Tailwind**

Application extranet qui permet à un employé de déclarer une panne
informatique, de joindre la capture d'écran du bug et de suivre la
résolution par un technicien.

- 🚀 **Production** : https://project-it-fix.vercel.app _(à renseigner)_
- 📦 **Repo** : https://github.com/raniasss/project-IT-Fix
- 🧪 **Compte de test** : `demo@it-fix.dz` / `demoitfix` _(à créer après setup)_

---

## 1. Mapping du thème (Règle d'Or du sujet)

| Obligation du sujet | Notre implémentation | Fichier concerné |
|---|---|---|
| **Table A — Utilisateurs** | `public.employees` — employés d'une entreprise fictive, gérés via Supabase Auth | `supabase/schema.sql` |
| **Table B — Ressources** | `public.technicians` — catalogue de techniciens IT (Hardware, Network, Software, Cybersecurity, DB, Printers) | `supabase/schema.sql`, `supabase/seed.sql` |
| **Table C — Interactions** | `public.tickets` — tickets de panne reliant un employé à un technicien, avec statut + priorité + date | `supabase/schema.sql` |
| **Storage — Fichier** | Bucket **`bug-screenshots`** (privé, RLS par uid) — capture d'écran du bug attachée au ticket | `supabase/schema.sql` (section Storage) |

**Flux utilisateur complet :** Inscription employé → Consultation des
techniciens → Création d'un ticket avec upload d'une capture → Tableau de
bord personnel listant uniquement **ses** tickets (RLS).

---

## 2. Analyse d'architecture (≈ 490 mots)

### 2.1 Pourquoi Vercel + Supabase est financièrement plus logique (OPEX vs CAPEX)

Un déploiement "classique" sur serveur physique exige un investissement
initial lourd — **CAPEX** (*Capital Expenditure*) : achat d'une baie
serveur, licences OS/SGBD, onduleur, climatisation, câblage, local
technique. À l'échelle d'un projet étudiant ou d'une startup, ces
dépenses sont immobilisées pendant 3 à 5 ans et doivent être amorties
comptablement, quel que soit l'usage réel de la machine.

Vercel et Supabase, à l'inverse, facturent à la consommation
(bande passante, exécutions de fonctions, stockage Postgres, stockage
objet). C'est de l'**OPEX** (*Operational Expenditure*) : une dépense
mensuelle, variable, directement imputable au compte de résultat. Nos
tiers gratuits (Hobby Vercel + Free Supabase) couvrent largement le MVP,
et la facture ne monte que si l'usage monte. Cela supprime la barrière
d'entrée pour un trinôme d'étudiants : **0 DA de CAPEX**, 0 DA d'OPEX
tant que l'application reste en dessous des quotas gratuits. Le cash
dépensé suit la courbe de la valeur créée, pas l'inverse.

### 2.2 Scalabilité Vercel vs Data Center physique

Un data center physique "rack" encaisse un pic de charge en ajoutant de
nouvelles machines — ce qui suppose d'avoir **pré-acheté** ces machines,
d'avoir prévu la puissance électrique, la climatisation supplémentaire,
l'espace au sol, et de disposer d'un technicien pour le montage. Le
temps de mise en ligne se compte en jours ou semaines, le surcoût est
permanent même une fois le pic retombé.

Vercel exécute notre frontend Next.js sur un **modèle serverless** :
chaque requête entrante est routée vers l'instance Edge la plus proche
du visiteur (CDN mondial), et les API routes sont exécutées dans des
conteneurs Lambda éphémères qui se multiplient automatiquement en
parallèle. Passer de 10 à 10 000 requêtes/seconde ne demande **aucune
action** de notre part — ni montage de rack, ni climatiseur, ni ticket
d'infogérance. Quand le trafic retombe, les instances s'éteignent et la
facture redescend. C'est la scalabilité **horizontale élastique**,
impossible à reproduire sur un serveur rack local sans surprovisionner.

### 2.3 Donnée structurée vs donnée non structurée dans IT-Fix

- **Structurée** : tout ce qui vit dans PostgreSQL (Supabase).
  Colonnes typées, contraintes FK, index, RLS. Nos tables `employees`,
  `technicians` et `tickets` en sont l'exemple : chaque champ a un type
  (`uuid`, `text`, `timestamptz`, `text CHECK IN (...)`). On peut faire
  des jointures, des agrégations, imposer l'intégrité référentielle.

- **Non structurée** : les **captures d'écran de bugs** uploadées dans
  **Supabase Storage** (bucket `bug-screenshots`). Ce sont des objets
  binaires (PNG/JPG) dont le contenu n'est pas interrogeable en SQL ;
  on ne stocke en base que leur **chemin** (`screenshot_path`). Le
  fichier lui-même est servi via une URL signée à durée limitée.

Cette dualité **relationnel + objet** est le cœur de l'architecture
Supabase et illustre exactement la distinction vue en cours.

---

## 3. Architecture (diagramme)

```mermaid
flowchart LR
  User([👤 Employé<br/>navigateur]) -->|HTTPS| Edge

  subgraph Vercel["☁️ Vercel (Serverless)"]
    Edge[Edge Network / CDN<br/>mondial]
    SSR[Next.js 14<br/>App Router · RSC]
    MW[Middleware<br/>refresh session + redirect]
    Edge --> MW --> SSR
  end

  subgraph Supabase["🟢 Supabase (BaaS)"]
    Auth[Auth<br/>JWT · email/password]
    DB[(PostgreSQL<br/>employees · technicians · tickets<br/>RLS activé)]
    Storage[(Object Storage<br/>bucket bug-screenshots<br/>policies par uid)]
    Auth -.uid.-> DB
    Auth -.uid.-> Storage
  end

  SSR -->|@supabase/ssr<br/>cookies JWT| Auth
  SSR -->|SELECT / INSERT<br/>filtré RLS| DB
  SSR -->|upload / signed URL| Storage

  GH[GitHub repo<br/>raniasss/project-IT-Fix] -.git push.-> Vercel

  classDef cloud fill:#eef4ff,stroke:#3b6cf6,color:#0f172a
  classDef data fill:#e6fbe9,stroke:#16a34a,color:#0f172a
  class Vercel cloud
  class Supabase data
```

Flux d'une requête : le navigateur tape l'URL Vercel, qui sert le
bundle via son CDN Edge ; le middleware rafraîchit la session JWT
Supabase (via cookies) ; le Server Component appelle Supabase en tant
qu'utilisateur authentifié ; la RLS PostgreSQL filtre les lignes à la
source ; l'image du bug est récupérée par URL signée Storage (expire
en 1h).

---

## 4. Stack & composants

| Couche | Choix | Rôle |
|---|---|---|
| Frontend | Next.js 14 (App Router, RSC) + Tailwind | UI + rendu serveur |
| Auth | Supabase Auth (email + password) | Inscription, sessions, JWT |
| Base de données | Supabase Postgres + RLS | Données structurées + sécurité par ligne |
| Storage | Supabase Storage (bucket privé) | Captures d'écran |
| CI/CD | Vercel + GitHub | Déploiement auto sur `git push` |

---

## 5. Sécurité — Row Level Security

RLS est activée sur les 3 tables :

- `employees` : l'utilisateur ne lit/modifie que sa propre ligne (`auth.uid() = id`).
- `technicians` : lecture ouverte à tout utilisateur authentifié (catalogue public).
- `tickets` : **isolation stricte** — `auth.uid() = employee_id` sur SELECT, INSERT, UPDATE, DELETE. Un employé ne peut jamais voir/modifier les tickets des autres.
- `storage.objects` bucket `bug-screenshots` : le chemin doit commencer par l'uid de l'utilisateur (`(storage.foldername(name))[1] = auth.uid()::text`).

Voir [supabase/schema.sql](supabase/schema.sql).

---

## 6. Comment lancer le projet

Voir le guide détaillé : [SETUP.md](SETUP.md).

En résumé :

```bash
git clone https://github.com/raniasss/project-IT-Fix.git
cd project-IT-Fix
npm install
cp .env.local.example .env.local   # remplir les 2 variables Supabase
npm run dev
```

Puis ouvrir http://localhost:3000.

---

## 7. Auteurs

- **Rania Saidi** — `r_saidi@estin.dz`
- **Manel Khouni**
- **Raghed Nesrine Arif**

École Supérieure en Sciences et Technologies de l'Informatique et du
Numérique (ESTIN). Module _Build & Ship — Architecture Cloud & Vibe
Programming_, année 2025-2026. Enseignante : Rania SAIDI.
