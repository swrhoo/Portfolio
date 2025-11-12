
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface ProjectDetails {
    nome: string;
    categoria: string;
    cliente: string;
    tag: string;
    commissionatoDa?: string;
}

export async function generateDescription(details: ProjectDetails): Promise<string> {
    const { nome, categoria, cliente, tag, commissionatoDa } = details;
    
    const tagString = tag && tag.trim().length > 0 ? ` con i seguenti tag: ${tag}` : '';
    const clientString = cliente && cliente.toLowerCase() !== 'personal' ? ` per il cliente: ${cliente}` : ' come progetto personale';
    const referrerString = commissionatoDa ? `, commissionato da ${commissionatoDa}` : '';

    const prompt = `Sei un copywriter esperto specializzato nella creazione di descrizioni per portfolio di design grafico. 
    Il tuo stile è professionale, conciso e accattivante.
    Basandoti sui seguenti dati, scrivi una descrizione di 2-3 frasi per un progetto grafico.
    - Nome Progetto: "${nome}"
    - Categoria: "${categoria}"
    - Realizzato ${clientString}${referrerString}
    - Parole chiave${tagString}

    Concentrati sul valore e l'obiettivo del progetto. Evita frasi generiche.
    Restituisci solo il testo della descrizione, senza titoli o introduzioni.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const text = response.text.trim();
        if (!text) {
             throw new Error("API returned an empty description.");
        }
        return text;

    } catch (error) {
        console.error("Error generating description with Gemini:", error);
        throw new Error("Non è stato possibile generare una descrizione in questo momento.");
    }
}