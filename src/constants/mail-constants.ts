export class MailConstants {
    static readonly SubjectWelcomeMail = "Bienvenido a Automécanica Centro de Servicio";
    static readonly SubjectVerificationMail = "Verificación de correo electrónico";
    static readonly SubjectMultiFactorAuthMail = "Código de verificación de dos factores";
    static readonly SubjectRecoverPasswordMail = "Recuperación de contraseña";

    static readonly EndpointVerifyEmail = "verify-email";
    static readonly EndpointVerifyPhone = "verify-phone";
    static readonly EndpointMultiFactor = "multi-factor";
}