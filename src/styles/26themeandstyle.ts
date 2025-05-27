// src/styles/26themeandstyle.ts

// Theme: Neutral with Contextual Background Colors (Inspired by Baratang and Diglipur samples)

// Common Structural Patterns Documentation:
// -----------------------------------------
// 1. Hero Section:
//    - Relative container with height (e.g., h-[70vh]).
//    - Next.js Image component with fill, priority, and object-cover.
//    - Gradient overlay (e.g., absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent).
//    - Text content container (absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white).
//    - Breadcrumbs (nav > ol > li with Link and ChevronRight).
//    - Main heading (h1, text-4xl md:text-6xl font-bold).
//    - Subtitle paragraph (p, text-xl md:text-2xl).
//    - Action buttons (flex flex-wrap gap-4).

// 2. Main Content Container:
//    - Standard container (e.g., container mx-auto px-4).
//    - Consistent section padding (e.g., py-10 md:py-12).

// 3. Section Structure:
//    - Optional section heading (h2, text-2xl font-bold mb-6 flex items-center, with optional icon).
//    - Content wrapper (e.g., div or section).
//    - Often uses cardBaseStyle for content blocks or grids of cards.

// 4. Card Structure (General - cardBaseStyle):
//    - Background (bg-white).
//    - Rounded corners (rounded-2xl).
//    - Shadow (shadow-sm).
//    - Border (border neutralBorderLight).
//    - Padding (p-6).
//    - Hover effect (transition-shadow hover:shadow-md).

// 5. Contextual Color Cards (e.g., Quick Facts, Safety, Eco-Tips):
//    - Base background and border (e.g., infoBg, infoBorder).
//    - Rounded corners (rounded-2xl or rounded-lg).
//    - Padding (p-6 or p-4).
//    - Shadow (shadow-sm).
//    - Heading (h2 or h3, with specific contextual text color and icon).
//    - Content (text with neutralTextLight or specific contextual text).
//    - Icons often use specific contextual color (e.g., infoIconColor).

// 6. Toggle Switch:
//    - Wrapper div (flex flex-col items-center mb-10).
//    - Title and description.
//    - Button container (e.g., neutralBg p-1 rounded-full inline-flex border neutralBorder).
//    - Two buttons with conditional styling for active/inactive states (using primaryButtonBg, primaryButtonText for active).

// 7. Image Gallery:
//    - Main image wrapper (relative h-[50vh] w-full rounded-2xl overflow-hidden shadow-lg mb-4 border neutralBorderLight).
//    - Next.js Image with fill, object-cover.
//    - Caption overlay (absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white).
//    - Thumbnail strip (flex gap-2 overflow-x-auto pb-2).
//    - Thumbnail items (relative h-20 w-32 rounded-lg overflow-hidden cursor-pointer transition-all).
//    - Active thumbnail styling (ring-4 primaryButtonBg).

// 8. List Structure (e.g., Getting There, Accommodation Details):
//    - Unordered list (ul space-y-4 or space-y-3).
//    - List items (li flex items-start).
//    - Optional icon wrapper (e.g., neutralBg p-2 rounded-full mr-3 mt-1 border neutralBorder).
//    - Icon (e.g., Car, Ship, Check with neutralIconColor or contextual color).
//    - Text content (span font-medium neutralText for title, span neutralTextLight for description).

// 9. CTA Section:
//    - Background (e.g., infoBg).
//    - Rounded corners (rounded-2xl).
//    - Padding (p-8).
//    - Border (infoBorder).
//    - Text alignment (text-center).
//    - Heading (text-2xl font-bold infoText).
//    - Description paragraph (neutralTextLight max-w-xl mx-auto mb-6).
//    - Action buttons (flex flex-wrap justify-center gap-4).

// --- Color Palette & General Styles ---

// Primary Button Styles
export const primaryButtonBg = 'bg-gray-800';
export const primaryButtonHoverBg = 'hover:bg-gray-900';
export const primaryButtonText = 'text-white';

// Secondary Button Styles (used in Hero)
export const secondaryButtonBg = 'bg-white/20 backdrop-blur-sm';
export const secondaryButtonHoverBg = 'hover:bg-white/30';
export const secondaryButtonText = 'text-white';
export const secondaryButtonBorder = 'border border-white/40';

// Informational Contextual Colors (Blue)
export const infoBg = 'bg-blue-50';
export const infoBorder = 'border-blue-100';
export const infoText = 'text-blue-800';
export const infoIconColor = 'text-blue-600';

// Success Contextual Colors (Green)
export const successBg = 'bg-green-50';
export const successBorder = 'border-green-100';
export const successText = 'text-green-800';
export const successIconColor = 'text-green-600';

// Warning Contextual Colors (Orange)
export const warningBg = 'bg-orange-50';
export const warningBorder = 'border-orange-100';
export const warningText = 'text-orange-800';
export const warningIconColor = 'text-orange-600';

// Tip Contextual Colors (Yellow)
export const tipBg = 'bg-yellow-50';
export const tipBorder = 'border-yellow-100';
export const tipText = 'text-yellow-800';
export const tipIconColor = 'text-yellow-700';

// Error Contextual Colors (Red)
export const errorBg = 'bg-red-50';
export const errorBorder = 'border-red-200';
export const errorText = 'text-red-700';
export const errorIconColor = 'text-red-500';

// Neutral Theme Colors (Grays)
export const neutralBgLight = 'bg-gray-50'; // Very light gray, for subtle backgrounds or highlights
export const neutralBorderLight = 'border-gray-100'; // Lightest border
export const neutralBg = 'bg-gray-100';       // Light gray, common for card backgrounds or sections
export const neutralBorder = 'border-gray-200'; // Standard neutral border
export const neutralText = 'text-gray-800';     // Dark gray for primary text
export const neutralTextLight = 'text-gray-600'; // Lighter gray for secondary text, captions
export const neutralIconColor = 'text-gray-600'; // For icons in neutral contexts

// --- Component Style Compositions ---

// Section Styles
export const sectionPadding = "py-10 md:py-12";
export const sectionHeadingStyle = `text-2xl font-bold ${neutralText} mb-6 flex items-center`;

// Card Base Style
export const cardBaseStyle = `bg-white rounded-2xl shadow-sm border ${neutralBorderLight} p-6 transition-shadow hover:shadow-md`;

// Button Styles
export const buttonPrimaryStyle = `inline-flex items-center justify-center ${primaryButtonBg} ${primaryButtonHoverBg} ${primaryButtonText} px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md`;
export const buttonSecondaryStyleHero = `inline-flex items-center justify-center ${secondaryButtonBg} ${secondaryButtonHoverBg} ${secondaryButtonText} ${secondaryButtonBorder} px-6 py-3 rounded-full font-medium transition-all duration-300`;

// Example of a contextual card style composition (Informational)
export const infoCardStyle = `${infoBg} rounded-2xl p-6 shadow-sm border ${infoBorder}`;
export const infoCardHeadingStyle = `text-xl font-semibold ${infoText} mb-4 flex items-center`;

// Example of a contextual card style composition (Warning)
export const warningCardStyle = `${warningBg} rounded-2xl p-6 shadow-sm border ${warningBorder}`;
export const warningCardHeadingStyle = `text-lg font-semibold ${warningText} mb-4 flex items-center`;

// Example of a contextual card style composition (Success)
export const successCardStyle = `${successBg} rounded-2xl p-6 shadow-sm border ${successBorder}`;
export const successCardHeadingStyle = `text-lg font-semibold ${successText} mb-4 flex items-center`;

// Example of a contextual card style composition (Tip)
export const tipCardStyle = `${tipBg} rounded-2xl p-6 shadow-sm border ${tipBorder}`;
export const tipCardHeadingStyle = `text-lg font-semibold ${tipText} mb-4 flex items-center`;

// Icon wrapper style for lists (as seen in Quick Facts, Getting There)
export const listIconWrapperStyle = `bg-white p-2 rounded-full shadow-sm mr-3 border ${neutralBorderLight}`; // Neutral background for icon circle
export const listIconWrapperContextualStyle = (bgColor: string, borderColor: string) => `${bgColor} p-2 rounded-full mr-3 border ${borderColor}`; // For contextual bg

// Breadcrumb item style
export const breadcrumbItemStyle = "flex items-center";
export const breadcrumbLinkStyle = "hover:text-white"; // Assuming white text on dark hero, adjust if context changes
export const breadcrumbSeparatorStyle = "mx-1"; // For the ChevronRight or any separator

// Toggle Switch Styles
export const toggleButtonContainerStyle = `${neutralBg} p-1 rounded-full inline-flex border ${neutralBorder}`;
export const toggleButtonBaseStyle = `px-6 py-2 rounded-full font-medium transition-all duration-300`;
export const toggleButtonActiveStyle = `${primaryButtonBg} ${primaryButtonText} shadow-sm`;
export const toggleButtonInactiveStyle = `bg-transparent text-gray-700 hover:${neutralBg}`; // Neutral hover for inactive

// Image Gallery Styles
export const galleryMainImageContainerStyle = `relative h-[50vh] w-full rounded-2xl overflow-hidden shadow-lg mb-4 border ${neutralBorderLight}`;
export const galleryCaptionOverlayStyle = "absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent";
export const galleryThumbnailContainerStyle = "flex gap-2 overflow-x-auto pb-2";
export const galleryThumbnailItemBaseStyle = "relative h-20 w-32 rounded-lg overflow-hidden cursor-pointer transition-all";
export const galleryThumbnailActiveRingStyle = `ring-4 ${primaryButtonBg}`; // Uses primary button bg for active state ring
export const galleryThumbnailOpacityStyle = "opacity-70 hover:opacity-100";
