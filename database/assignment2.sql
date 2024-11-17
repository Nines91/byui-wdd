--1 Insert into the table account one record
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
--2 Update the table account, change account_type
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;
--3 Deleting the Tony Stark record
DELETE FROM account
WHERE account_id = 1;
--4 Updating the description column from the inventory table using the replace() function
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'the small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
--5 Using the INNER JOIN statement
SELECT inv_make,
    inv_model,
    classification_name
FROM inventory
    INNER JOIN classification ON inv_model = classification_name;
--6 Updating the file path of the images using the REPLACE() function
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');