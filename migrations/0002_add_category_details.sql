-- Migration: Add category-specific details to package_categories table
-- This migration adds support for storing activities, meals, and accommodation details
-- for each package category, allowing different tiers to have unique offerings.

-- Add new columns to package_categories table
ALTER TABLE package_categories ADD COLUMN activities TEXT;
ALTER TABLE package_categories ADD COLUMN meals TEXT;
ALTER TABLE package_categories ADD COLUMN accommodation TEXT;

-- Create indexes for better query performance (optional but recommended)
CREATE INDEX idx_package_categories_activities ON package_categories(activities);
CREATE INDEX idx_package_categories_meals ON package_categories(meals);
CREATE INDEX idx_package_categories_accommodation ON package_categories(accommodation); 