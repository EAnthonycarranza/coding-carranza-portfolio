import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { items, customerName, customerEmail, invoiceNumber, date, sendEmail } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const doc = new jsPDF();
    const margin = 20;
    let currentY = 20;

    // --- PDF CONTENT GENERATION ---

    // Header
    doc.setTextColor(99, 102, 241); // indigo-500
    doc.setFontSize(24);
    doc.text('Sweet Bytes Bakery', margin, currentY);
    
    currentY += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('Custom Cake & Catering Specialists', margin, currentY);
    
    // Invoice Label
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFontSize(20);
    doc.text('INVOICE', 190, 20, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Number: ${invoiceNumber}`, 190, 30, { align: 'right' });
    doc.text(`Date: ${date}`, 190, 35, { align: 'right' });

    // Bill To
    currentY += 30;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text('BILL TO:', margin, currentY);
    
    currentY += 8;
    doc.setFontSize(14);
    doc.text(customerName || 'Valued Customer', margin, currentY);
    
    currentY += 6;
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(customerEmail || 'N/A', margin, currentY);

    // Table Header
    currentY += 20;
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(margin, currentY, 190, currentY);
    
    currentY += 8;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.text('Item Description', margin, currentY);
    doc.text('Qty', 100, currentY, { align: 'center' });
    doc.text('Price', 140, currentY, { align: 'right' });
    doc.text('Total', 190, currentY, { align: 'right' });
    
    currentY += 4;
    doc.line(margin, currentY, 190, currentY);

    // Table Items
    currentY += 10;
    let subtotal = 0;
    doc.setTextColor(71, 85, 105); // slate-600

    items.forEach((item: any) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      doc.text(item.name, margin, currentY);
      doc.text(item.quantity.toString(), 100, currentY, { align: 'center' });
      doc.text(`$${item.price.toFixed(2)}`, 140, currentY, { align: 'right' });
      doc.text(`$${itemTotal.toFixed(2)}`, 190, currentY, { align: 'right' });

      currentY += 10;
    });

    // Totals
    currentY += 10;
    doc.line(120, currentY, 190, currentY);
    
    currentY += 10;
    doc.setTextColor(100, 116, 139);
    doc.text('Subtotal:', 140, currentY, { align: 'right' });
    doc.setTextColor(15, 23, 42);
    doc.text(`$${subtotal.toFixed(2)}`, 190, currentY, { align: 'right' });

    currentY += 8;
    const tax = subtotal * 0.08;
    doc.setTextColor(100, 116, 139);
    doc.text('Tax (8%):', 140, currentY, { align: 'right' });
    doc.setTextColor(15, 23, 42);
    doc.text(`$${tax.toFixed(2)}`, 190, currentY, { align: 'right' });

    currentY += 12;
    doc.setFontSize(14);
    doc.setTextColor(99, 102, 241);
    doc.text('TOTAL DUE:', 140, currentY, { align: 'right' });
    doc.text(`$${(subtotal + tax).toFixed(2)}`, 190, currentY, { align: 'right' });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Thank you for your business!', 105, 270, { align: 'center' });
    doc.text('Generated automatically via Coding Carranza Portfolio Engine', 105, 275, { align: 'center' });

    // Convert PDF to Buffer
    const pdfOutput = doc.output('arraybuffer');
    const pdfBuffer = Buffer.from(pdfOutput);

    // --- OPTIONAL EMAIL SENDING ---
    if (sendEmail && customerEmail) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Sweet Bytes Bakery" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: `Invoice ${invoiceNumber} from Sweet Bytes Bakery 🧁`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px;">
            <h1 style="color: #6366f1;">Sweet Bytes Bakery</h1>
            <p style="font-size: 16px; color: #1e293b;">Hi ${customerName},</p>
            <p style="font-size: 16px; color: #475569; line-height: 1.5;">
              Thank you for your order! Please find your official invoice <strong>${invoiceNumber}</strong> attached to this email as a PDF.
            </p>
            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">Order Total:</p>
              <p style="margin: 5px 0 0 0; color: #0f172a; font-size: 24px; font-weight: 800;">$${(subtotal + tax).toFixed(2)}</p>
            </div>
            <p style="font-size: 14px; color: #64748b;">If you have any questions, feel free to reply to this email.</p>
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 30px 0;"/>
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">Generated via Coding Carranza's Automated Invoice Engine.</p>
          </div>
        `,
        attachments: [
          {
            filename: `Invoice-${invoiceNumber}.pdf`,
            content: pdfBuffer
          }
        ]
      });

      return NextResponse.json({ success: true, message: 'Invoice sent to email' });
    }

    // Default: Return PDF for download
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${invoiceNumber}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error('PDF/Email Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}
