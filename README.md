# Recuperação de senha

**RF**

- O usuario deve poder recuperar sua senha informando o seu email
- O usuario deve receber o email com instruçoes de recuperação de senha
- O usuario deve poder resetar a sua senha

**RNF**

- Utilizar Mailtrap para testar envio de email em desenvolvimento
- Utilizar o Amazon SES para envios em produção
- O envio de emails deve acontecer em segundo plano

**RN**

- O link enviado por email para resetar a senha, deve expirar em 2h
- O usuario precisa confirmar a nova senha ao resetar sua senha

# Atualização do perfil

**RF**

- O usuario deve poder atualizar seu perfil(nome, email, senha)

**RN**

- O usuario não pode alterar seu email para um ja utilizado
- Para atualizar a sua senha, o usuario deve informar a senha
- Para atualizar a senha, o usuario precisa confirmar a nova senha

# Painel do prestador

**RF**

- O prestador deve poder listar seus agendamentos de um dia especifico
- O prestador deve receber uma notificação sempre que houver um novo agendamento
- O prestador deve poder visualizar as notificaçoes não lidas

**RNF**

- Os agendamentos do prestador devem ser armazenados em cache
- As notificaçoes do prestador devem ser armazenadas no mongodb
- As notificaçoes devem ser enviadas em tempo-real utilizando Socket.io

**RN**

- A notificação deve ter um status de lida ou não lida para que o prestador possa ter um controle de agendamentos

# Agendamento de serviçes

**RF**

- O usuario deve listar todos os prestadores de serviçoes cadastrados
- O usuario deve poder listar os dias de um mes com pelo menos um horario disponivel de um prestador
- O usuario deve poder listar horarios disponiveis de um prestador
- O usuario deve poder realizar um novo agendamendo com um prestador

**RNF**

- A listagem de prestadores deve ser armazenada em cache

**RN**

- Todo agendamento deve durar 1h exatamente
- Os agendamentos devem estar disponiveis entre 8 e 18h(ultimo as 17h)
- O usuario nao pode agendar em um horario ja ocupado
- O usuario não pode agendar em um horario que ja passou
- O usuario não pode agendar serviçoes consigo mesmo
