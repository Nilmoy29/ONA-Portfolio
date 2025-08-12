-- Adds Architecture Consultant and Engineering Consultant fields to projects
-- Safe to re-run: uses IF NOT EXISTS

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS architecture_consultant text;

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS engineering_consultant text;


