import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const smtpHost = this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com');
    const smtpPort = this.configService.get<number>('SMTP_PORT', 587);
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (!smtpUser || !smtpPass) {
      this.logger.warn('⚠️  SMTP credentials not configured. Email service will log to console only.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    this.logger.log(`✅ Email service configured with ${smtpHost}:${smtpPort}`);
  }

  async sendTemporaryPassword(email: string, password: string, username: string): Promise<void> {
    const subject = '🎮 Tu contraseña temporal - Gaming Achievements Platform';
    
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contraseña Temporal - Gaming Achievements</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden; max-width: 100%;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 30px; text-align: center;">
                            <div style="background: rgba(255,255,255,0.1); border-radius: 50%; width: 100px; height: 100px; margin: 0 auto 20px; line-height: 100px;">
                                <span style="font-size: 50px;">🎮</span>
                            </div>
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">Gaming Achievements</h1>
                            <p style="color: rgba(255,255,255,0.95); margin: 10px 0 0 0; font-size: 16px; font-weight: 500;">🏆 Sistema de Logros y Recompensas 🏆</p>
                        </td>
                    </tr>
                    
                    <!-- Welcome Badge -->
                    <tr>
                        <td style="padding: 0;">
                            <div style="background: linear-gradient(90deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%); padding: 8px 0; text-align: center;">
                                <span style="color: #333; font-weight: 700; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">✨ Nueva Cuenta Creada ✨</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #333333; margin: 0 0 10px 0; font-size: 26px; font-weight: 700;">
                                ¡Bienvenido, <span style="color: #667eea;">${username}</span>! 🎉
                            </h2>
                            <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 2px; margin-bottom: 25px;"></div>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 1.7; margin: 0 0 25px 0;">
                                🚀 Tu cuenta ha sido creada exitosamente y estás a un paso de comenzar tu aventura gaming. Utiliza la contraseña temporal a continuación para tu primer acceso:
                            </p>
                            
                            <!-- Password Box -->
                            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 3px solid #667eea; border-radius: 12px; padding: 25px; text-align: center; margin: 35px 0; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);">
                                <div style="display: inline-block; background: #ffffff; border-radius: 8px; padding: 4px 12px; margin-bottom: 12px;">
                                    <span style="color: #667eea; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">🔐 Contraseña Temporal</span>
                                </div>
                                <div style="color: #333333; font-size: 36px; font-weight: 800; letter-spacing: 5px; font-family: 'Courier New', Consolas, monospace; padding: 10px;">
                                    ${password}
                                </div>
                                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #667eea;">
                                    <span style="color: #999; font-size: 12px;">👆 Haz clic para seleccionar</span>
                                </div>
                            </div>
                            
                            <!-- Security Alert -->
                            <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%); border-left: 5px solid #ffc107; padding: 18px 20px; margin: 30px 0; border-radius: 8px;">
                                <p style="color: #856404; margin: 0; font-size: 15px; font-weight: 600; line-height: 1.5;">
                                    ⚠️ <strong>Seguridad Importante:</strong> Esta contraseña es temporal y <u>debes cambiarla</u> en tu primer inicio de sesión por una contraseña personal segura.
                                </p>
                            </div>
                            
                            <!-- Steps -->
                            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border: 2px solid #e9ecef;">
                                <h3 style="color: #333333; margin: 0 0 20px 0; font-size: 20px; font-weight: 700;">
                                    📝 Pasos para comenzar tu aventura:
                                </h3>
                                
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">
                                            <div style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; width: 30px; height: 30px; border-radius: 50%; text-align: center; line-height: 30px; font-weight: 700; font-size: 14px; margin-right: 15px;">1</div>
                                            <span style="color: #666666; font-size: 15px;">
                                                Accede a la plataforma <strong style="color: #667eea;">Gaming Achievements</strong>
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">
                                            <div style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; width: 30px; height: 30px; border-radius: 50%; text-align: center; line-height: 30px; font-weight: 700; font-size: 14px; margin-right: 15px;">2</div>
                                            <span style="color: #666666; font-size: 15px;">
                                                Ingresa tu correo: <strong style="color: #333; background: #f8f9fa; padding: 2px 8px; border-radius: 4px;">${email}</strong>
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">
                                            <div style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; width: 30px; height: 30px; border-radius: 50%; text-align: center; line-height: 30px; font-weight: 700; font-size: 14px; margin-right: 15px;">3</div>
                                            <span style="color: #666666; font-size: 15px;">
                                                Usa la <strong style="color: #667eea;">contraseña temporal</strong> mostrada arriba 🔑
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0 0;">
                                            <div style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; width: 30px; height: 30px; border-radius: 50%; text-align: center; line-height: 30px; font-weight: 700; font-size: 14px; margin-right: 15px;">4</div>
                                            <span style="color: #666666; font-size: 15px;">
                                                Crea una <strong style="color: #667eea;">contraseña segura</strong> cuando se te solicite ✨
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- Security Tips -->
                            <div style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border: 2px solid #28a745;">
                                <h3 style="color: #155724; margin: 0 0 15px 0; font-size: 18px; font-weight: 700;">
                                    🛡️ Tips de Seguridad Pro
                                </h3>
                                <div style="color: #155724; font-size: 14px; line-height: 1.8;">
                                    ✓ Usa una contraseña <strong>única y compleja</strong> (mínimo 8 caracteres)<br>
                                    ✓ Combina <strong>mayúsculas, minúsculas, números</strong> y símbolos especiales<br>
                                    ✓ <strong>Nunca compartas</strong> tu contraseña con terceros<br>
                                    ✓ Considera usar un <strong>gestor de contraseñas</strong> 🔐
                                </div>
                            </div>
                            
                            <!-- CTA Button -->
                            <div style="text-align: center; margin: 35px 0 20px;">
                                <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: 700; box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);">
                                    🚀 ¡Comienza tu Aventura Gaming!
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); padding: 30px; text-align: center;">
                            <div style="text-align: center; margin-bottom: 15px;">
                                <span style="font-size: 32px;">🎮</span>
                            </div>
                            <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 10px 0;">
                                Este es un correo automático generado por el sistema.<br>
                                Por favor, <strong>no respondas</strong> a este mensaje.
                            </p>
                            <div style="border-top: 1px solid rgba(255,255,255,0.2); margin: 20px 0; padding-top: 20px;">
                                <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0;">
                                    © 2024-2026 <strong style="color: rgba(255,255,255,0.9);">Gaming Achievements Platform</strong><br>
                                    Todos los derechos reservados 🏆
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    const text = `
Hola ${username},

Tu cuenta ha sido creada exitosamente en Gaming Achievements Platform.

Tu contraseña temporal es: ${password}

Por seguridad, deberás cambiar esta contraseña al iniciar sesión por primera vez.

Próximos pasos:
1. Accede a la plataforma Gaming Achievements
2. Ingresa tu correo: ${email}
3. Usa la contraseña temporal mostrada arriba
4. Crea una contraseña segura cuando se te solicite

Tips de seguridad:
- Usa una contraseña única y compleja (mínimo 8 caracteres)
- Combina mayúsculas, minúsculas, números y símbolos especiales
- Nunca compartas tu contraseña con terceros
- Considera usar un gestor de contraseñas

Si no creaste esta cuenta, por favor ignora este correo.

Gaming Achievements Platform © 2024-2026
    `.trim();

    if (!this.transporter) {
      this.logger.log('='.repeat(60));
      this.logger.log('📧 CORREO DE REGISTRO (MODO DESARROLLO)');
      this.logger.log('='.repeat(60));
      this.logger.log(`Para: ${email}`);
      this.logger.log(`Asunto: ${subject}`);
      this.logger.log('');
      this.logger.log(`Hola ${username},`);
      this.logger.log('');
      this.logger.log('Tu cuenta ha sido creada exitosamente.');
      this.logger.log(`Tu contraseña temporal es: ${password}`);
      this.logger.log('');
      this.logger.log('Por seguridad, deberás cambiar esta contraseña');
      this.logger.log('al iniciar sesión por primera vez.');
      this.logger.log('');
      this.logger.log('¡Gracias por unirte!');
      this.logger.log('='.repeat(60));
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"Gaming Achievements" <${this.configService.get<string>('SMTP_USER')}>`,
        to: email,
        subject: subject,
        text: text,
        html: html,
      });

      this.logger.log(`✅ Email enviado exitosamente a ${email} (MessageId: ${info.messageId})`);
    } catch (error: any) {
      this.logger.error(`❌ Error enviando email a ${email}:`, error?.message || error);
      throw new Error(`No se pudo enviar el correo electrónico: ${error?.message || 'Error desconocido'}`);
    }
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      this.logger.warn('⚠️  Transporter not configured, skipping verification');
      return false;
    }

    try {
      await this.transporter.verify();
      this.logger.log('✅ Conexión SMTP verificada correctamente');
      return true;
    } catch (error: any) {
      this.logger.error('❌ Error verificando conexión SMTP:', error?.message || error);
      return false;
    }
  }
}
