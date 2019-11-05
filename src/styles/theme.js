
export const BREAKPOINTS_VALUES = {
    XXSmall: 321,
    XSmall: 460,
    Drawer: 540,
    mobileMenu: 710,
    tabletMenu: 1260,
    SmallMedium: 610,
    Small: 768,
    Medium: 960,
    Large: 1160,
    XLarge: 1260,
    siteMaxWidth: 1280
};

export const FONTS = {
    primaryFont: 'Amiri, serif',
    secondaryFont: 'Open Sans, sans-serif'
};

export const COLORS = {
    grey: '#FBFBFB',
    blue: '#3559A1',
    green: '#BED8D4',
    darkGrey: '#80859E',
    orange: '#FF7847',
    white: '#FFFFFF',
    lightBlue: '#D1CCDC',
    crimson: '#DB2955',
    pink: '#D0878E'
};

export const BREAKPOINTS = {
    breakpointXSmall: `(min-width: ${BREAKPOINTS_VALUES.XSmall}px)`,
    breakpointSmall: `(min-width: ${BREAKPOINTS_VALUES.Small}px)`,
    breakpointMedium: `(min-width: ${BREAKPOINTS_VALUES.Medium}px)`,
    breakpointLarge: `(min-width: ${BREAKPOINTS_VALUES.Large}px)`,
    breakpointXLarge: `(min-width: ${BREAKPOINTS_VALUES.XLarge}px)`
};

export const THEME_SETTINGS = {
    ...COLORS,
    ...BREAKPOINTS,
    ...FONTS
};
