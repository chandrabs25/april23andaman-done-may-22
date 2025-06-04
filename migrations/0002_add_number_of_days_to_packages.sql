

ALTER TABLE packages ADD COLUMN number_of_days INTEGER DEFAULT 1;


UPDATE packages SET number_of_days = 1 WHERE number_of_days IS NULL;

