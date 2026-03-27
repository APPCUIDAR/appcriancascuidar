'use client';

import { EvidenceTimeline } from "@/components/alerts/EvidenceTimeline";
import React from 'react';

export default function EvidenceClient({ id }: { id: string }) {
    return (
        <div className="bg-black min-h-screen">
            <EvidenceTimeline caseId={id} />
        </div>
    );
}
