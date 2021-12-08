
export interface Language {
    name: string;
    published_at: string;
    statically_typed: boolean;
    paradigm: string;
}

export const languageType: Record<string, "S" | "BOOL"> = {
    name: "S",
    published_at: "S",
    statically_typed: "BOOL",
    paradigm: "S"
}
