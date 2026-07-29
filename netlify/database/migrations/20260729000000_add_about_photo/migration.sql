-- Add editable About page photo field
ALTER TABLE "SiteSettings" ADD COLUMN "aboutPhotoUrl" TEXT NOT NULL DEFAULT '/about-portrait.jpg';
