# Compasso LABS - POC de um Voice Assistant para a GOL

![](https://img.shields.io/badge/contributors-2-green) ![](https://img.shields.io/badge/BotFramework-4.5.1-blue) ![](https://img.shields.io/badge/npm-6.4.1-blue) ![](https://img.shields.io/badge/node-v10.15.3-blue) ![](https://img.shields.io/badge/actions--on--google-2.12.0-blue) ![](https://img.shields.io/badge/issues-0-yellow)

**Table of Contents**

[TOC]

### Informações

- POC para a companhia aérea GOL, com as funções de fazer check-in e consultar status de voos;
- Desenvolvimento no Bot Framework em NodeJS;
- Utiliza o [LUIS](https://www.luis.ai/) como motor de NLP;
- Canal: Google assistant, por meio de [Actions on Google](https://github.com/actions-on-google/actions-on-google-nodejs) em Node.js como middleware;
- Nesta versão, os dados de check-in estão mockados e os status de voos são consultados via web scraping do site [FlightView](https://www.flightview.com/)

### Executando a aplicação

- Executar `npm install` para instalar as dependências
- Executar `npm start` para rodar o serviço

### Ambientes

- Recurso do bot: **golVA-DSV**
- Recurso do middleware: **GolMW**

### Utilizando no Google Actions (Beta)

- Invocação: _"Falar com meu voo GOL"_

### LUIS

#### Intenções

| Intenção         | Descrição                              |
| ---------------- | -------------------------------------- |
| Afirmação        | Identifica afirmações do usuário       |
| Ajuda            | Oferece ajuda                          |
| Checkin          | Inicia o diálogo de check-in           |
| Consultar_status | Inicia o diálogo de consulta de voos   |
| Excecao          | Frases indesejadas (ex: xingamentos)   |
| Negacao          | Identifica afirmações do usuário       |
| None             | Quando nenhuma intenção é identificada |
| Sair             | Sai da conversa ou de algum diálogo    |
| Saudacao         | Identifica uma saudação do usuário     |

#### Entidades

| Entidade    | Descrição                                     | Tipo     |
| ----------- | --------------------------------------------- | -------- |
| aeroporto   | nomes de aeroportos utilizados pela companhia | List     |
| código      | códigos de voos da companhia                  | Regex    |
| datetimeV2  | Data                                          | Prebuilt |
| localizador | Código de reserva de um voo                   | Regex    |
| lugar       | Nomes de lugares com aeroportos               | List     |

### To do

- Utilização das API's reais da GOL;
- Construção e validação da Política de Privacidade do Google Actions para o deploy;
- Configurações de SSML.
