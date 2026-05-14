const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  /**
   * Send email notification to student when diploma is issued
   */
  async sendDiplomaIssuedNotification(studentEmail, studentName, diplomaTitle, verificationUrl) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"DiploChain" <noreply@diplochain.com>',
      to: studentEmail,
      subject: '🎉 Votre diplôme est disponible sur DiploChain',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #4A90E2;">Félicitations, ${studentName} !</h2>
          <p>Nous sommes heureux de vous annoncer que votre diplôme <strong>"${diplomaTitle}"</strong> a été émis avec succès sur la blockchain.</p>
          <p>Il est désormais infalsifiable et vérifiable mondialement par les employeurs.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4A90E2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Consulter mon diplôme</a>
          </div>
          <p style="color: #777; font-size: 12px;">Vous pouvez également partager ce lien directement avec vos futurs recruteurs.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 10px; color: #aaa; text-align: center;">© 2026 DiploChain Platform. La confiance numérique pour votre carrière.</p>
        </div>
      `
    };

    try {
      if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'votre_email@gmail.com') {
        console.warn('⚠️  Email credentials not configured. Skipping email.');
        return { success: true, simulated: true };
      }
      
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send notification for revocation
   */
  async sendDiplomaRevokedNotification(studentEmail, studentName, diplomaTitle, reason) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"DiploChain" <noreply@diplochain.com>',
      to: studentEmail,
      subject: '⚠️ Notification concernant votre diplôme',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #D0021B;">Information Importante</h2>
          <p>Bonjour ${studentName},</p>
          <p>Nous vous informons que le statut de votre diplôme <strong>"${diplomaTitle}"</strong> a été mis à jour sur la blockchain.</p>
          <p><strong>Statut actuel : Révoqué</strong></p>
          <p>Raison indiquée : ${reason}</p>
          <p>Si vous pensez qu'il s'agit d'une erreur, veuillez contacter votre institution émettrice.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 10px; color: #aaa; text-align: center;">© 2026 DiploChain Platform.</p>
        </div>
      `
    };

    try {
      if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'votre_email@gmail.com') {
        console.warn('⚠️  Email credentials not configured. Skipping email.');
        return { success: true, simulated: true };
      }
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error sending revocation email:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send simulated email with default password to student
   */
  async sendDefaultPasswordEmail(studentEmail, studentName, password) {
    console.log('====================================================');
    console.log(`📧 SIMULATED EMAIL SENT TO: ${studentEmail}`);
    console.log(`👤 STUDENT: ${studentName}`);
    console.log(`🔐 DEFAULT PASSWORD: ${password}`);
    console.log('====================================================');
    console.log('Message: Bonjour, voici votre mot de passe pour accéder à DiploChain. Veuillez le changer après votre première connexion.');
    
    return { success: true, simulated: true };
  }
}

module.exports = new EmailService();
