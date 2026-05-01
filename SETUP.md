# Guide de setup IT-Fix — pas à pas

Ce guide s'adresse à l'équipe (Rania, Manel, Raghed). Suivez les étapes
dans l'ordre, **ne sautez rien**. Comptez ~30 minutes la première fois.

---

## Étape 0 — Prérequis (une seule fois)

- [Node.js 18+](https://nodejs.org/) installé (`node -v` doit afficher v18 ou plus)
- Un compte GitHub (Rania a déjà créé le repo `raniasss/project-IT-Fix`)
- Un compte [Supabase](https://supabase.com) (gratuit)
- Un compte [Vercel](https://vercel.com) (gratuit, se connecter avec GitHub)

---

## Étape 1 — Récupérer le code sur votre machine

```bash
git clone https://github.com/raniasss/project-IT-Fix.git
cd project-IT-Fix
npm install
```

> ⚠️ Si Rania a déjà poussé le code fourni : bien. Sinon, copiez
> l'ensemble des fichiers du dossier `project-IT-Fix` fourni dans le
> repo vide, puis :
> ```bash
> git add .
> git commit -m "initial scaffold: Next.js + Supabase + RLS"
> git push
> ```

---

## Étape 2 — Créer le projet Supabase

1. Aller sur https://supabase.com/dashboard → **New Project**
2. Nommer le projet `it-fix`, choisir la région (ex: Paris / Frankfurt)
3. Définir un mot de passe DB (notez-le quelque part, on n'en a pas
   besoin pour l'app mais utile pour SQL externe)
4. Attendre 1-2 min que le projet soit prêt

### 2a. Exécuter le schéma SQL

1. Dans le projet Supabase, onglet **SQL Editor** (icône </>)
2. Bouton **New query**
3. Ouvrir `supabase/schema.sql` du repo, **copier tout son contenu**, coller, cliquer **Run**
4. Répéter avec `supabase/seed.sql` (techniciens de démo)
5. Onglet **Table Editor** : vérifier que `employees`, `technicians`, `tickets` existent et que `technicians` contient 6 lignes

### 2b. Vérifier le bucket Storage

Onglet **Storage** : le bucket `bug-screenshots` doit apparaître
(privé). Si ce n'est pas le cas, le script SQL a échoué — relancez-le.

### 2c. Récupérer les clés

Onglet **Settings → API** :

- **Project URL** : `https://xxxxxxx.supabase.co`
- **anon public key** : `eyJhbGciOi...` (la clé publique, pas `service_role`)

---

## Étape 3 — Configurer les variables d'environnement en local

À la racine du projet :

```bash
cp .env.local.example .env.local
```

Éditer `.env.local` :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

⚠️ **Ne jamais commit `.env.local`** — il est déjà dans `.gitignore`.

---

## Étape 4 — Lancer en local

```bash
npm run dev
```

Ouvrir http://localhost:3000 :

1. Créer un compte via `/signup` (ex: `demo@it-fix.dz` / `demoitfix`)
2. Si Supabase demande la confirmation par email :
   - Soit confirmer via l'email reçu
   - Soit désactiver la confirmation : **Supabase → Authentication → Providers → Email → désactiver "Confirm email"**
3. Aller sur `/technicians`, choisir un technicien, ouvrir un ticket avec une image
4. Vérifier que le ticket apparaît dans `/dashboard` et `/tickets`
5. **Test RLS** : créer un 2e compte dans un onglet incognito, créer un ticket, puis revérifier que les deux utilisateurs ne voient **que leurs** tickets. 🎯 Critère éliminatoire validé.

---

## Étape 5 — Déployer sur Vercel

1. Aller sur https://vercel.com/new
2. **Import Git Repository** → sélectionner `raniasss/project-IT-Fix`
3. Framework Preset : **Next.js** (auto-détecté)
4. Section **Environment Variables**, ajouter :
   - `NEXT_PUBLIC_SUPABASE_URL` = (même valeur que local)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (même valeur que local)
5. Cliquer **Deploy**
6. Attendre le build (~1-2 min), récupérer l'URL : `https://project-it-fix.vercel.app`
7. **Autoriser cette URL dans Supabase** :
   - Supabase → **Authentication → URL Configuration**
   - Site URL : `https://project-it-fix.vercel.app`
   - Redirect URLs : ajouter aussi la même URL

À partir de maintenant, chaque `git push` sur `main` redéploie
automatiquement ✨.

---

## Étape 6 — Créer le compte de test pour l'enseignant

1. Sur l'app en prod, `/signup` avec :
   - Nom : `Compte Enseignant`
   - Département : `Évaluation`
   - Email : `demo@it-fix.dz`
   - Mot de passe : `demoitfix`
2. Créer 1 ou 2 tickets de démo pour qu'il y ait du contenu visible
3. Mettre ces identifiants dans le **PDF de rendu** + dans le README

---

## Étape 7 — Collaboration Git (critère 3 — DevOps)

Pour avoir la note de collaboration :

- Chaque fille travaille sur une **branche** (`git checkout -b feature/xxx`)
- Ouvre une **Pull Request** sur GitHub
- Les autres **reviewent** avant merge vers `main`
- Vercel déploie un **preview** par PR automatiquement

Exemples de branches à se répartir pour avoir de vrais commits :
- `feature/ui-polish` (améliorer le design)
- `feature/ticket-filters` (filtrer par statut sur `/tickets`)
- `feature/mark-resolved` (bouton pour passer un ticket en "résolu")
- `docs/readme-diagrams` (ajouter un schéma d'architecture au README)

---

## Checklist finale avant rendu (10/05/2026)

- [ ] Application déployée sur Vercel, URL publique fonctionnelle
- [ ] Inscription + connexion marchent en prod
- [ ] Création de ticket + upload image marche en prod
- [ ] RLS vérifiée avec 2 comptes distincts
- [ ] Compte de test créé et accessible
- [ ] README mis à jour avec l'URL Vercel
- [ ] README contient le mapping + l'analyse 500 mots (déjà fait ✅)
- [ ] Au moins 10 commits répartis entre les 3 membres
- [ ] PDF d'une page envoyé à r_saidi@estin.dz avec :
  - Noms des 3 étudiantes + thème (IT-Fix)
  - URL Vercel
  - URL GitHub
  - Email + mot de passe du compte de test

Bonne chance ! 💪
