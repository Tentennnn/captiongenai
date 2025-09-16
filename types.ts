export enum Platform {
    Facebook = 'Facebook'
}

export enum Style {
    Engaging = 'ទាក់ទាញ',
    Interesting = 'គួរឱ្យចាប់អារម្មណ៍',
    Professional = 'វិជ្ជាជីវៈ',
    Funny = 'កំប្លែង',
    Inspirational = 'លើកទឹកចិត្ត'
}

export enum Audience {
    General = 'ទូទៅ',
    Teenagers = 'យុវវ័យ',
    YoungAdults = 'មនុស្សពេញវ័យ',
    Parents = 'ឪពុកម្តាយ',
    Professionals = 'អ្នកជំនាញ'
}

export enum Length {
    Short = 'ខ្លី',
    Medium = 'មធ្យម',
    Long = 'វែង'
}

export interface FormState {
    platform: Platform;
    productName: string;
    style: Style;
    audience: Audience;
    length: Length;
    generateHashtags: boolean;
}

export interface GenerationResult {
    caption: string;
    hashtags: string[];
}

// FIX: Define and export the UserProfile interface to be used in UserContext.
export interface UserProfile {
    id: string;
    username: string;
    email: string;
    plan: 'free' | 'pro';
    generationsToday: number;
    lastGenerationDate: string;
    licenseKey: string | null;
    proExpiresAt: number | null;
}