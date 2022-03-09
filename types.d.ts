export interface IBrowserNavigator {
    browser: Browser;
    activePage: Page;
    navigateToURL: (url: string) => Promise<void>;
    close: () => Promise<void>;
    init?: (starterURL: string) => IBrowserNavigator;
    close: () => Promise<void>;
    disconnect: () => Promise<void>;
    selectAppointmentLocations: () => Promise<void>;
    isAppointmentAvailable: () => Promise<boolean | undefined>
}

export interface IGenreSelection {
    genreSelection: string;
}