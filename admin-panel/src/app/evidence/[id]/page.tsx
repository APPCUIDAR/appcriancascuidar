'use client';

import { EvidenceTimeline } from "@/components/alerts/EvidenceTimeline";
import React from 'react';

export function generateStaticParams() {
    return [];
}

export default function EvidencePage({ params }: { params: Promise<{ id: string }> }) {
    // Em Next.js App Router, params é uma promise para as rotas dinâmicas
    const { id } = React.use(params);

    return (
        <div className="bg-black min-h-screen">
            <EvidenceTimeline caseId={id} />
        </div>
    );
}
