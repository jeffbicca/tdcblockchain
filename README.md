# tdcblockchain - Exemplo de uso do Convector Suite

Este projeto foi criado automaticamente com o <a href="https://github.com/worldsibu/convector-cli" target="_blank">Convector CLI</a>.

Por padrão, novos projetos Convector incluem o <a href="https://github.com/worldsibu/hurley">Hurley</a> para gerenciar o ambiente de desenvolvimento sem dificuldades. Então não é necessário se preocupar em configurar uma rede do Fabric e sofrer com dificuldades em instalar, instanciar e atualizar os chaincodes!

Os fontes e a execução deste projeto foram apresentados no The Developers Conference (TDC) 2019 - Porto Alegre - Trilha blockchain em 30 de novembro de 2019.

---

## Para começar

```sh
# Instalar o hurley globalmente
npm i -g @worldsibu/hurley

# Instalar as dependências a partir do diretório root do projeto
npm i

# Criar uma nova rede blockchain de desenvolvimento (também a partir do diretório root)
npm run env:restart

# Instalar o smart contract
npm run cc:start -- conference

# Executar uma chamada de teste para criar um registro no ledger.
# Atentar que de vez em quando a primeira chamada pode falhar por timeout! Mas é só executar novamente que tudo vai ir bem! :)
hurl invoke conference participant_register '{ "id": "1", "name": "ALICE", "tracks": [{ "name": "blockchain", "status": "A" }] }' -o blockchain -C chconf -u client
```

---

## Sobre

Este projeto visa demonstrar algumas *features* disponíveis no [Convector Suite](https://covalentx.com/convector/) e no que ele pode facilitar no ciclo de desenvolvimento de *smart contracts (chaincodes)* para o [Hyperledger Fabric](https://www.hyperledger.org/projects/fabric).

O domínio escolhido para exemplo é de uma *conference*.
Uma *conference* tem ***Participant***s e cada *Participant* participa de várias ***Track***s. São propostas as seguintes transações na blockchain:

- Registrar um *Participant*
- Registrar um *Participant* como "speaker"
- Encontrar um *Participant*
- Encontrar um *Participant* "speaker"
- Listar *Participant*s "speaker"
- Capturar o histórico de transações efetuadas em um *Participant*

Cada *Track* é representada como se fosse uma *organization* na rede. Foram propostas as seguintes *organizations*: **blockchain**, **microservices** e **stadium**.

*Participant*s "speaker" são registrados em uma *private collection* referente a cada *Track* que vai palestrar. O nome da *private collection* está convencionado com o mesmo nome da *organization*.
Então, por exemplo, na *organization* **blockchain**, existe uma *private collection* chamada **blockchain**. Isto pode ser visto consultando a `function get track()` em `participant.controller.ts` e em `collections_config.json`.

A demonstração visa focar nos seguintes pontos:
- **Configuração da rede** a partir de um arquivo JSON (`network.config.json`);

- Criação de **model** (`conference-cc/src/participant.model.ts`) e **controller** (`conference-cc/src/participant.controller.ts`) no chaincode para determinar e facilitar o desenvolvimento de transações que vão estar à disposição na blockchain;

- Criação e utilização de [**private data collections**](https://hyperledger-fabric.readthedocs.io/en/release-1.4/private-data/private-data.html) (`collections_config.json`);

- **Acesso aos métodos "nativos" do Hyperledger Fabric SDK** com o uso do `stub`;

- **Acesso a identidade do usuário** com o uso do `identity`;
 
- Criação e execução de **testes de unidade** (`conference-cc/tests/participant.spec.ts`) para auxiliar no design e nos testes do chaincode **sem precisar subir uma rede Fabric**;

- **Manutenção da rede blockchain de desenvolvimento** com o Hurley;

- **Geração de API** a partir do chaincode desenvolvido (`api.json` + [convector-rest-api](https://github.com/worldsibu/convector-rest-api));

- **Escuta de eventos** com o `FabricControllerAdapter` e `ClientFactory` (`conference-event/src/convector/fabric-controllers.service.ts` e `conference-event/src/listener/listener.service.ts`).

---

## Exemplos de transações

Registro de um participante

`hurl invoke conference participant_register '{ "id": "1", "name": "ALICE", "tracks": [{ "name": "blockchain", "status": "A" }] }' -o blockchain -C chconf -u client`

Registro de um palestrante

`hurl invoke conference participant_registerAsSpeaker '{ "id": "1", "name": "BOB", "tracks": [{ "name": "blockchain", "status": "A" }]  }' -o blockchain -C chconf -u client`

Histórico de um participante

`hurl invoke conference participant_history '1' -o blockchain -C chconf -u client`

Consulta de um participante

`hurl invoke conference participant_find '1' -o blockchain -C chconf -u client`

Consulta de um palestrante

`hurl invoke conference participant_findSpeaker '1' -o blockchain -C chconf -u client`

Lista de palestrantes

`hurl invoke conference participant_findSpeakers -o blockchain -C chconf -u client`

---

## Eventos

Para realizar a escuta dos eventos, após subir a rede com o Hurley, execute:

`npx lerna run start --scope conference-event --stream`

Este comando sobe um servidor Express rodando na porta 3000 e que irá ficar escutando pelo evento `newSpeaker`, disparado pela blockchain na transação `registerAsSpeaker`.

---

## Testes de unidade

Para rodar os testes de unidade, basta executar:

`npm run test`

---

## Notas importantes

> A rede montada pelo Hurley **jamais** deve ser levada a produção *as is*! Ela até pode ser utilizada como base. Porém, uma rede de produção **precisa ser projetada**! Isso inclui, por exemplo, definir uma  topologia, configurar credenciais, proteger o ledger por senha e configurar as CAs.

> A rede gerada pelo Hurley fica disponível por padrão no caminho `~/hyperledger-fabric-network`. Nesta pasta ficam a topologia e os materiais criptográficos para cada *organization*.

---

## Referências

* <a href="https://docs.covalentx.com/convector" target="_blank">Convector documentation</a>
* <a href="https://github.com/worldsibu" target="_blank">Convector projects</a>
