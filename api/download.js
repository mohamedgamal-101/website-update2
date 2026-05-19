// api/download.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { productId, name, phone, email } = req.body;

  // خريطة الروابط: تم وضع رابط الفولدر الخاص بك هنا بنجاح!
  const productsLinks = {
    'manual-v1': {
      title: 'كتيب الدليل العملي للمهارات الحياتية',
      url: 'https://drive.google.com/drive/folders/1D-AVId2-VpMm-omMJXDHyILall1T8ARb?usp=sharing'
    }
  };

  const selectedProduct = productsLinks[productId];

  if (!selectedProduct) {
    return res.status(400).json({ message: 'Product not found' });
  }

  // إرسال الإيميل التلقائي عبر خدمة Resend
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}` // المفتاح ده هنضيفه في فيرسيل بأمان في الخطوة الجاية
      },
      body: JSON.stringify({
        from: 'Mohamed Gamal <onboarding@resend.dev>', 
        to: email,
        subject: `🎁 كتابك جاهز للتحميل: ${selectedProduct.title}`,
        html: `
          <div dir="rtl" style="font-family: sans-serif; padding: 20px; color: #11161d; text-align: right;">
            <h2>أهلاً يا ${name}،</h2>
            <p>سعيد جداً باهتمامك وشغفك بالتعلم وتطوير مهاراتك.</p>
            <p>بناءً على طلبك، إليك رابط التحميل المباشر لـ <strong>${selectedProduct.title}</strong>:</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${selectedProduct.url}" style="background-color: #18bdbc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">اضغط هنا لتحميل الكتيب (PDF)</a>
            </div>
            <p>لو عندك أي استفسار أو حابب تشاركني رأيك بعد القراءة، تقدر ترد على الإيميل ده مباشرة.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
            <p style="font-size: 12px; color: #94a3b8;">هذا الإيميل أُرسل تلقائياً من الموقع الرسمي للمهندس محمد جمال.</p>
          </div>
        `
      })
    });

    if (response.ok) {
      console.log(`Lead Saved: ${name} - ${phone} - ${email}`);
      return res.status(200).json({ message: 'Success' });
    } else {
      const errData = await response.json();
      return res.status(500).json({ error: errData });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}