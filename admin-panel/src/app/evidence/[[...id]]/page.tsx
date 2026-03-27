import React from 'react';
import EvidenceClient from './EvidenceClient';

// [[...id]] permite capturar qualquer subcaminho ou nenhum (.../evidence/123 ou .../evidence)
export function generateStaticParams() {
    return [{ id: [] }]; // Gera a página base para a rota opcional
}

export default async function EvidencePage({ params }: { params: Promise<{ id?: string[] }> }) {
    const { id: ids } = await params;
    // Pega o primeiro segmento da URL como o ID da evidência
    const rawId = ids && ids.length > 0 ? ids[0] : 'placeholder';

    return <EvidenceClient id={rawId} />;
}
