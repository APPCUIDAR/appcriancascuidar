import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export async function generateJudicialDossie(caseData: any) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header - Digital Forensic Badge
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Dossiê de Proteção Judicial | App Cuidar', 20, 25);
    doc.setFontSize(10);
    doc.text(`ID do Caso: ${caseData.id}`, 20, 32);

    // Case Overview
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('1. Informações de Monitoramento', 20, 55);
    doc.setFontSize(11);
    doc.text(`Data do Alerta: ${caseData.date}`, 20, 65);
    doc.text(`Tempo de Escuta Ativa: ${caseData.duration}`, 20, 72);
    doc.text(`Georreferenciamento: São Paulo, SP (Raio: ${caseData.accuracy})`, 20, 79);

    // Evidence Chain of Custody (SHA-256)
    doc.setFontSize(16);
    doc.text('2. Cadeia de Custódia (Integridade Criptográfica)', 20, 95);
    doc.setFontSize(10);
    caseData.chunks.forEach((chunk: any, index: number) => {
        const yPos = 105 + (index * 15);
        doc.text(`Chunk #${index + 1}: ${chunk.timestamp} | Lat: ${chunk.lat}, Lng: ${chunk.lng}`, 20, yPos);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`SHA-256 Hash: ${chunk.hash}`, 20, yPos + 4);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
    });

    // Verification QR Code
    doc.setFontSize(16);
    doc.text('3. Link de Acesso Originário (Vídeo/Áudio)', 20, 180);
    const qrData = await QRCode.toDataURL(caseData.proofUrl);
    doc.addImage(qrData, 'PNG', 20, 185, 40, 40);
    doc.setFontSize(9);
    doc.text('Leia este QR Code para visualizar os arquivos brutos diretamente no servidor de prova legada.', 65, 205);

    // Footer / Certification
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Documento gerado automaticamente pelo Sistema Antigravity de Proteção Infantil v2.', 20, 280);
    doc.text(`Verificação Atômica: ${new Date().toISOString()}`, 20, 285);

    // Save PDF
    doc.save(`DOSSIE_JUDICIAL_${caseData.id}.pdf`);
}
