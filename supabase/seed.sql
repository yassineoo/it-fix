-- =====================================================================
-- IT-Fix : données de démo pour la Table B (technicians)
-- Exécute ce fichier APRÈS schema.sql dans le SQL Editor Supabase.
-- =====================================================================

insert into public.technicians (full_name, speciality, email, phone, available) values
  ('Yacine Hamidi',     'Hardware',         'y.hamidi@it-fix.dz',     '+213 550 11 22 33', true),
  ('Sonia Benali',      'Network',          's.benali@it-fix.dz',     '+213 661 44 55 66', true),
  ('Karim Mebarki',     'Software',         'k.mebarki@it-fix.dz',    '+213 770 77 88 99', true),
  ('Amina Cherifi',     'Cybersecurity',    'a.cherifi@it-fix.dz',    '+213 550 12 34 56', true),
  ('Walid Bouzidi',     'Database',         'w.bouzidi@it-fix.dz',    '+213 661 98 76 54', false),
  ('Lina Azzoug',       'Printers & Office','l.azzoug@it-fix.dz',     '+213 770 22 33 44', true)
on conflict do nothing;
