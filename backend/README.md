# Recuperação de senha

**RF**

- O usuário deve poder recuperar sua senha informando seu email.
- O usuário deve receber um email com instruções de recuperação de senha.
- O usuário deve poder resetar sua senha.

**RNF**

- Utilizar Mailtrap para testar envios em ambiente dev.
- Utilizar Amazon SES para envio em produção.
- O envio de emails deve acontecer em sugundo plano (background jobs).

**RN**

- O link será enviado por email para resetar a senha, valido por 2h.
- O usuário precisa confirmar sua nova senha ao resetar a antiga.
