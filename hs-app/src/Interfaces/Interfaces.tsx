interface HSCards {
    id: string;
    dbfId: number;
    name: string;
    text?: string;
    flavor?: string;
    artist?: string;
    attack?: number;
    cardClass: string;
    collectible: boolean;
    spellSchool?: string;
    cost: number;
    elite?: boolean;
    faction?: string;
    health?: number;
    mechanics?: ('BATTLECRY' | 'CHARGE' | 'DEATHRATTLE' | 'DIVINE_SHIELD' | string)[];
    rarity: string;
    set: string;
    type: string;
    durability?: number;
    armor?: number;
}

interface Spinner {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    trackColor?: string;
}


export interface ContentBlock {
    id: string;
    type: 'text' | 'image' | 'heading' | 'quote' | 'code' | 'list';
    content: string;
    order: number;
}

export interface NewsFormData {
    title: string;
    description: string;
    content: string;
    contentBlocks?: ContentBlock[];
    image: string;
    author: string;
    tags?: string[];
}

export interface GuideFormData {
    title: string;
    description: string;
    content: string;
    contentBlocks?: ContentBlock[];
    image: string;
    author: string;
    tags?: string[];
    winrate?: number;
    className?: string;
}

export interface DeckFormData {
    title: string;
    image: string;
    code: string;
    winrate: number;
}

export interface NewsItem extends NewsFormData {
    id: string;
    createdAt: string;
    views: number;
    copyCode?: string;
    updatedAt?: string;
}

export interface GuideItem extends GuideFormData {
    id: string;
    createdAt: string;
    views: number;
    copyCode?: string;
    deckCode?: string;
    updatedAt?: string;
}

export interface DeckItem extends DeckFormData {
    id: string;
    createdAt: string;
}

export type { HSCards, Spinner };