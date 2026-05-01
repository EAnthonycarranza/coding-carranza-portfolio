import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { jsPDF } from 'jspdf';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, email, name } = body;

    if (!email || !type) {
      return NextResponse.json({ error: 'Missing email or scenario type' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const ownerEmail = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;
    let subject = '';
    let html = '';
    let ownerHtml = null;

    // --- TEMPLATE GENERATION ---
    switch (type) {
      case '2fa':
        const code = Math.floor(100000 + Math.random() * 900000);
        subject = `${code} is your verification code`;
        html = `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 50px; hieght: 50px; background: #6366f1; border-radius: 12px; display: inline-block; padding: 10px;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
            </div>
            <h1 style="color: #0f172a; text-align: center; font-size: 24px;">Verification Code</h1>
            <p style="color: #64748b; text-align: center; font-size: 16px;">Enter this code to complete your login.</p>
            <div style="background: #f8fafc; border-radius: 16px; padding: 30px; text-align: center; margin: 30px 0;">
              <span style="font-family: monospace; font-size: 42px; font-weight: 800; color: #6366f1; letter-spacing: 8px;">${code}</span>
            </div>
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
          </div>
        `;
        break;

      case 'password-reset':
        subject = 'Reset your password';
        html = `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px;">
            <h1 style="color: #0f172a; font-size: 24px; margin-bottom: 20px;">Password Reset Request</h1>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hi ${name || 'there'}, we received a request to reset your password. Click the button below to choose a new one.</p>
            <div style="text-align: center; margin: 40px 0;">
              <a href="#" style="background: #0f172a; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #64748b; font-size: 14px;">If the button doesn't work, copy and paste this link:</p>
            <p style="color: #6366f1; font-size: 12px; word-break: break-all;">https://codingcarranza.com/auth/reset?token=asdf1234ghjk5678</p>
          </div>
        `;
        break;

      case 'order':
        const orderId = 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();
        subject = `Order Confirmation: ${orderId}`;
        html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; background: white;">
            <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px;">
              <h1 style="color: #0f172a; font-size: 22px; margin: 0;">Order Confirmed</h1>
              <p style="color: #64748b; margin: 5px 0 0 0;">Thank you for your purchase, ${name}!</p>
            </div>
            <div style="margin-bottom: 30px;">
              <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Order Number</p>
                <p style="margin: 5px 0 0 0; color: #0f172a; font-weight: 700;">${orderId}</p>
              </div>
              <table width="100%" style="border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 15px 0; color: #475569;">Premium Web Hosting (1 Year)</td>
                  <td align="right" style="padding: 15px 0; color: #0f172a; font-weight: 600;">$149.00</td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; color: #475569; font-weight: 700;">Total</td>
                  <td align="right" style="padding: 15px 0; color: #6366f1; font-weight: 800; font-size: 18px;">$149.00</td>
                </tr>
              </table>
            </div>
            <div style="text-align: center;">
              <a href="#" style="background: #6366f1; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; display: inline-block;">Track Package</a>
            </div>
          </div>
        `;
        break;

      case 'invoice':
        const invId = 'SB-2024-0892';
        const invAmount = '642.60';
        subject = `Invoice ${invId} for your Sweet Bytes Bakery order 🍰`;
        html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; background: #ffffff;">
            <div style="margin-bottom: 30px;">
              <h1 style="color: #0f172a; font-size: 24px; margin: 0;">Sweet Bytes Bakery</h1>
              <p style="color: #64748b; margin: 5px 0 0 0;">Hi ${name}, your invoice is ready for payment.</p>
            </div>
            
            <div style="background: #f8fafc; border-radius: 16px; padding: 30px; margin-bottom: 30px; border: 1px solid #f1f5f9;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <span style="color: #64748b; font-size: 14px;">Invoice Number:</span>
                <span style="color: #0f172a; font-weight: 700;">${invId}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <span style="color: #64748b; font-size: 14px;">Amount Due:</span>
                <span style="color: #6366f1; font-weight: 800; font-size: 20px;">$${invAmount}</span>
              </div>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
              <p style="font-size: 12px; color: #94a3b8; text-align: center;">Clicking the button below will take you to our secure checkout portal.</p>
            </div>

            <div style="text-align: center;">
              <a href="http://localhost:3000/demo/payment?amount=${invAmount}&invoice=${invId}&name=${encodeURIComponent(name || '')}" 
                 style="background: #0f172a; color: white; padding: 18px 40px; border-radius: 14px; text-decoration: none; font-weight: 700; display: inline-block; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                 Pay Invoice Securely
              </a>
            </div>
          </div>
        `;
        break;

      case 'receipt':
        const rcptItems = body.items || [];
        const rcptTotal = body.total || '0.00';
        const rcptProvider = body.provider || 'Stripe';
        const rcptInvoiceId = body.invoiceId || 'SB-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const rcptDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        const itemRows = rcptItems.map((item: any) => `
          <tr>
            <td style="padding: 12px 0; color: #475569; border-bottom: 1px solid #f1f5f9;">${item.name}</td>
            <td style="padding: 12px 0; color: #475569; border-bottom: 1px solid #f1f5f9; text-align: center;">${item.qty}</td>
            <td style="padding: 12px 0; color: #0f172a; font-weight: 600; border-bottom: 1px solid #f1f5f9; text-align: right;">$${item.price.toFixed(2)}</td>
          </tr>
        `).join('');

        subject = `Payment Confirmed — Receipt #${rcptInvoiceId} ✅`;
        html = `
          <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; background: #ffffff;">
            <div style="height: 6px; background: linear-gradient(90deg, #10b981 0%, #6366f1 100%);"></div>
            <div style="padding: 40px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px;">
                <div>
                  <h1 style="color: #0f172a; font-size: 22px; margin: 0 0 4px 0; font-weight: 800;">SWEET BYTES BAKERY</h1>
                  <p style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Payment Receipt</p>
                </div>
                <div style="background: #ecfdf5; color: #059669; padding: 6px 16px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                  ✓ PAID
                </div>
              </div>

              <div style="background: #f8fafc; border-radius: 16px; padding: 20px; margin-bottom: 30px; border: 1px solid #f1f5f9;">
                <table width="100%" style="border-collapse: collapse; font-size: 13px;">
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-weight: 600;">Receipt #</td>
                    <td style="padding: 6px 0; color: #0f172a; font-weight: 700; text-align: right;">${rcptInvoiceId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-weight: 600;">Date</td>
                    <td style="padding: 6px 0; color: #0f172a; font-weight: 700; text-align: right;">${rcptDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-weight: 600;">Paid via</td>
                    <td style="padding: 6px 0; color: #0f172a; font-weight: 700; text-align: right;">${rcptProvider}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-weight: 600;">Customer</td>
                    <td style="padding: 6px 0; color: #0f172a; font-weight: 700; text-align: right;">${name || 'Valued Customer'}</td>
                  </tr>
                </table>
              </div>

              <table width="100%" style="border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding: 10px 0; color: #94a3b8; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0;">Item</th>
                    <th style="text-align: center; padding: 10px 0; color: #94a3b8; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0;">Qty</th>
                    <th style="text-align: right; padding: 10px 0; color: #94a3b8; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>

              <div style="border-top: 2px dashed #e2e8f0; padding-top: 20px; text-align: right;">
                <span style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Total Paid</span>
                <div style="color: #0f172a; font-size: 36px; font-weight: 900; margin-top: 4px;">$${rcptTotal}</div>
              </div>

              <div style="margin-top: 30px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; text-align: center;">
                <p style="color: #166534; font-size: 13px; margin: 0; font-weight: 600;">This receipt confirms your payment has been processed successfully. No further action is needed.</p>
              </div>

              <p style="margin-top: 30px; color: #cbd5e1; font-size: 11px; text-align: center;">Sweet Bytes Bakery · Powered by Coding Carranza · codingcarranza.com</p>
            </div>
          </div>
        `;
        break;

      case 'quote':
      default:
        const { occasion, flavor, size, notes } = body;
        subject = 'We received your cake request! 🎂';
        html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0;">
            <div style="height: 8px; background: linear-gradient(90deg, #ec4899 0%, #a855f7 50%, #6366f1 100%);"></div>
            <div style="padding: 40px;">
              <h1 style="color: #0f172a; font-size: 28px; font-weight: 800; margin: 0;">Sweet Bytes Bakery</h1>
              <p style="color: #334155; font-size: 18px; font-weight: 600; margin: 24px 0 16px 0;">Hi ${name},</p>
              <p style="color: #475569; font-size: 16px; line-height: 24px;">Our master bakers are reviewing your ${occasion} cake request. We'll be in touch with a quote shortly!</p>
              <div style="background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px; margin: 30px 0;">
                <h3 style="color: #0f172a; margin: 0 0 16px 0;">Request Summary</h3>
                <p style="margin: 0 0 8px 0;"><strong>Occasion:</strong> ${occasion}</p>
                <p style="margin: 0 0 8px 0;"><strong>Flavor:</strong> ${flavor}</p>
                <p style="margin: 0 0 8px 0;"><strong>Size:</strong> ${size}</p>
                <p style="margin: 0;"><strong>Notes:</strong> ${notes || 'None'}</p>
              </div>
              <div style="text-align: center;">
                <a href="mailto:${process.env.EMAIL_USER}" style="background-color: #6366f1; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; display: inline-block;">Reply to Sweet Bytes</a>
              </div>
            </div>
          </div>
        `;
        ownerHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: white; border-radius: 24px; padding: 40px;">
            <div style="display: inline-block; background: #ef4444; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; margin-bottom: 20px;">NEW LEAD</div>
            <h2>New Quote Request from ${name}</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Occasion:</strong> ${occasion}</p>
            <p><strong>Notes:</strong> ${notes || 'N/A'}</p>
            <a href="mailto:${email}" style="display: block; text-align: center; background: #38bdf8; color: #0f172a; padding: 16px; border-radius: 12px; font-weight: 700; text-decoration: none; margin-top: 30px;">Reply to Customer</a>
          </div>
        `;
        break;
    }

    // Build attachments array
    let attachments: any[] = [];

    // Generate PDF for receipt type
    if (type === 'receipt') {
      const rcptItemsForPdf = body.items || [];
      const rcptTotalForPdf = body.total || '0.00';
      const rcptProviderForPdf = body.provider || 'Stripe';
      const rcptInvIdForPdf = body.invoiceId || 'SB-RECEIPT';

      const doc = new jsPDF();
      const margin = 20;
      let y = 20;

      // Header
      doc.setTextColor(99, 102, 241);
      doc.setFontSize(24);
      doc.text('Sweet Bytes Bakery', margin, y);
      y += 10;
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text('Custom Cake & Catering Specialists', margin, y);

      // PAID stamp
      doc.setTextColor(16, 185, 129);
      doc.setFontSize(28);
      doc.text('PAID', 190, 25, { align: 'right' });
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Receipt #${rcptInvIdForPdf}`, 190, 35, { align: 'right' });
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 190, 41, { align: 'right' });
      doc.text(`Via: ${rcptProviderForPdf}`, 190, 47, { align: 'right' });

      // Bill To
      y += 25;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.text('BILL TO:', margin, y);
      y += 8;
      doc.setFontSize(14);
      doc.text(name || 'Valued Customer', margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(email, margin, y);

      // Table
      y += 20;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, 190, y);
      y += 8;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.text('Item', margin, y);
      doc.text('Qty', 120, y, { align: 'center' });
      doc.text('Price', 160, y, { align: 'right' });
      doc.text('Total', 190, y, { align: 'right' });
      y += 4;
      doc.line(margin, y, 190, y);
      y += 10;

      let pdfSubtotal = 0;
      doc.setTextColor(71, 85, 105);
      rcptItemsForPdf.forEach((item: any) => {
        const lineTotal = item.price * item.qty;
        pdfSubtotal += lineTotal;
        doc.text(item.name, margin, y);
        doc.text(item.qty.toString(), 120, y, { align: 'center' });
        doc.text(`$${item.price.toFixed(2)}`, 160, y, { align: 'right' });
        doc.text(`$${lineTotal.toFixed(2)}`, 190, y, { align: 'right' });
        y += 10;
      });

      y += 10;
      doc.line(120, y, 190, y);
      y += 12;
      doc.setTextColor(16, 185, 129);
      doc.setFontSize(16);
      doc.text('TOTAL PAID:', 160, y, { align: 'right' });
      doc.text(`$${rcptTotalForPdf}`, 190, y, { align: 'right' });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Thank you for your business!', 105, 265, { align: 'center' });
      doc.text('Generated via Coding Carranza Automated Invoice Engine', 105, 270, { align: 'center' });

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      attachments = [{ filename: `Receipt-${rcptInvIdForPdf}.pdf`, content: pdfBuffer }];
    }

    const tasks = [
      transporter.sendMail({
        from: `"Coding Carranza Showcase" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html,
        attachments,
      })
    ];

    if (ownerHtml) {
      tasks.push(
        transporter.sendMail({
          from: `"Lead Alert" <${process.env.EMAIL_USER}>`,
          to: ownerEmail,
          subject: `Action Required: New Lead (${name})`,
          html: ownerHtml,
        })
      );
    }

    await Promise.all(tasks);

    return NextResponse.json({
      success: true,
      type,
      recipient: email,
      owner_notified: !!ownerHtml,
      html: html, // Return HTML for preview
      code: type === '2fa' ? subject.split(' ')[0] : null // Return code for verification demo
    });

  } catch (error: any) {
    console.error('Email API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send' }, { status: 500 });
  }
}
