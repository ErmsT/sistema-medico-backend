## Sistema Médico Backend

Este é o backend para o sistema médico de vínculo entre médicos e pacientes, desenvolvido em Node.js com MongoDB. A API permite o registro e autenticação de usuários (médicos e pacientes), além de funcionalidades para vincular e desvincular pacientes a médicos.

## Tecnologias Utilizadas

Node.js: Plataforma para execução do JavaScript no servidor.
Express: Framework para criação do servidor e das rotas da API.
MongoDB: Banco de dados NoSQL utilizado para armazenar os dados de usuários, médicos e pacientes.
Mongoose: ODM (Object Data Modeling) para modelar os dados do MongoDB.
JWT (JSON Web Tokens): Para autenticação e autorização dos usuários.
dotenv: Gerenciamento de variáveis de ambiente.
bcryptjs: Biblioteca para hash de senhas.

Configuração
Pré-requisitos
Node.js instalado
MongoDB local ou MongoDB Atlas (na nuvem)
Instalação
Clone o repositório:


git clone <URL_DO_REPOSITORIO>
Instale as dependências:


npm install
Configure o arquivo .env com as variáveis de ambiente:

env

DB_URL=mongodb+srv://<usuario>:<senha>@<cluster-url>/<nome-do-banco>?retryWrites=true&w=majority
JWT_SECRET=sua-chave-secreta
PORT=5000
Inicie o servidor no modo de desenvolvimento:


npm run dev

Ou no modo de produção:

npm start


## Endpoints da API

## Autenticação

## Registro de Usuário

URL: /api/auth/register
Método: POST
Descrição: Registra um novo usuário (médico ou paciente).
Body:

{
  "name": "Nome do usuário",
  "email": "email@example.com",
  "password": "senha123",
  "role": "doctor", // ou "patient"
  "specialty": "Cardiologia" // Apenas para médicos
}

Resposta:

201: Usuário registrado com sucesso.
400: E-mail já cadastrado ou falta de dados.

## Login
URL: /api/auth/login
Método: POST
Descrição: Realiza o login de um usuário e retorna um token JWT.
Body:

{
  "email": "email@example.com",
  "password": "senha123"
}
Resposta:
200: Retorna um token JWT.
400: Credenciais inválidas.

## Médicos

## Obter Lista de Médicos

URL: /api/doctors
Método: GET
Headers:
Authorization: Bearer <token_jwt>
Descrição: Retorna uma lista de médicos disponíveis.

Resposta:

200: Lista de médicos.
401: Não autorizado (token JWT inválido ou ausente).

## Editar Médico

URL: /api/doctors/edit
Método: PUT
Headers:
Authorization: Bearer <token_jwt>
Descrição: Edita os dados de um médico autenticado.
Body:
{
  "name": "Novo Nome",
  "specialty": "Nova Especialidade",
  "password": "novaSenha123"
}

Respostas:
200: Dados atualizados com sucesso.
404: Médico não encontrado.
500: Erro ao atualizar médico.

## Vincular Paciente a Médico

URL: /api/doctors/link
Método: POST
Headers:
Authorization: Bearer <token_jwt> (médico)
Body:

{
  "doctorId": "<ID_do_medico>",
  "patientId": "<ID_do_paciente>"
}

Resposta:

200: Paciente vinculado com sucesso.
400: Limite de pacientes atingido ou paciente já vinculado a outro médico.
401: Não autorizado.

## Desvincular Paciente de Médico

URL: /api/doctors/unlink
Método: POST
Headers:
Authorization: Bearer <token_jwt> (médico)
Body:

{
  "doctorId": "<ID_do_medico>",
  "patientId": "<ID_do_paciente>"
}

Resposta:
200: Paciente desvinculado com sucesso.
400: Paciente não vinculado ao médico especificado.
401: Não autorizado.

## Pacientes

## Obter Lista de Pacientes Disponíveis

URL: /api/patients
Método: GET
Headers:
Authorization: Bearer <token_jwt> (paciente)
Descrição: Retorna uma lista de pacientes disponíveis para vínculo.

Resposta:
200: Lista de pacientes.
401: Não autorizado.

## Registrar Paciente

URL: /api/patients/register
Método: POST
Body:

{
  "name": "Nome do paciente",
  "password": "senha123"
}

Resposta:
201: Paciente registrado com sucesso.
500: Erro ao registrar paciente.

## Editar Paciente

URL: /api/patients/edit
Método: PUT
Headers:
Authorization: Bearer <token_jwt>
Descrição: Edita os dados de um paciente autenticado.
Body:
{
  "name": "Novo Nome",
  "password": "novaSenha123"
}

Respostas:
200: Dados atualizados com sucesso.
404: Paciente não encontrado.
500: Erro ao editar paciente.

## Vincular Paciente a Médico

URL: /api/patients/link
Método: POST
Headers:
Authorization: Bearer <token_jwt>
Body:
{
  "doctorId": "<ID_do_medico>"
}

Respostas:
200: Vínculo realizado com sucesso.
400: Paciente já vinculado a outro médico.
404: Médico não encontrado.


Middleware de Autenticação e Autorização
authMiddleware: Verifica se o token JWT é válido e anexa o usuário autenticado à requisição.
doctorMiddleware: Verifica se o usuário autenticado é um médico antes de permitir o acesso às rotas de médico.
patientMiddleware: Verifica se o usuário autenticado é um paciente antes de permitir o acesso às rotas de paciente.

Segurança
Autenticação JWT: Todas as rotas protegidas exigem um token JWT no cabeçalho Authorization.
Criptografia de Senhas: As senhas são armazenadas no banco de dados com hash usando bcryptjs.
Variáveis de Ambiente: As credenciais sensíveis (como DB_URL e JWT_SECRET) são armazenadas em variáveis de ambiente, protegendo-as de exposições no código-fonte.
Licença
MIT License.