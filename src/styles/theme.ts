// src/styles/theme.ts

// Buttons
export const primaryButtonBg = 'bg-gray-800';
export const primaryButtonHoverBg = 'hover:bg-gray-900';
export const primaryButtonText = 'text-white';

export const secondaryButtonBg = 'bg-white';
export const secondaryButtonHoverBg = 'hover:bg-gray-100';
export const secondaryButtonText = 'text-gray-700';
export const secondaryButtonBorder = 'border border-gray-300';

// Semantic States (Background, Border, Text, Icon)
export const infoBg = 'bg-blue-50';
export const infoBorder = 'border-blue-100';
export const infoText = 'text-blue-800';
export const infoIconColor = 'text-blue-600';

export const successBg = 'bg-green-50';
export const successBorder = 'border-green-100';
export const successText = 'text-green-800';
export const successIconColor = 'text-green-600';

export const warningBg = 'bg-orange-50';
export const warningBorder = 'border-orange-100';
export const warningText = 'text-orange-800';
export const warningIconColor = 'text-orange-600';

export const tipBg = 'bg-yellow-50';
export const tipBorder = 'border-yellow-100';
export const tipText = 'text-yellow-800';
export const tipIconColor = 'text-yellow-700';

export const errorBg = 'bg-red-50';
export const errorBorder = 'border-red-200';
export const errorText = 'text-red-700';
export const errorIconColor = 'text-red-500';

// Neutral Palette
export const neutralBgLight = 'bg-gray-50'; // Very light background elements
export const neutralBorderLight = 'border-gray-100'; // Subtle borders
export const neutralBg = 'bg-gray-100'; // Slightly darker neutral bg (e.g., image placeholders)
export const neutralBorder = 'border-gray-200'; // Standard neutral borders
export const neutralText = 'text-gray-800'; // Main text color
export const neutralTextLight = 'text-gray-600'; // Secondary/muted text color
export const neutralIconColor = 'text-gray-600'; // Default icon color

// Layout & Structure
export const sectionPadding = "py-10 md:py-12"; // Consistent vertical padding for sections/page
export const cardBaseStyle = `bg-white rounded-2xl shadow-lg border ${neutralBorderLight} p-6 transition-shadow hover:shadow-xl`; // Base style for cards
export const sectionHeadingStyle = `text-lg font-semibold ${neutralText} mb-3 flex items-center`; // Style for headings within cards/sections

// Composed Button Styles (Apply these directly to button elements)
export const buttonPrimaryStyle = `inline-flex items-center justify-center ${primaryButtonBg} ${primaryButtonHoverBg} ${primaryButtonText} px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800`;
export const buttonSecondaryStyle = `inline-flex items-center justify-center ${secondaryButtonBg} ${secondaryButtonHoverBg} ${secondaryButtonText} ${secondaryButtonBorder} px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm shadow-sm`;
