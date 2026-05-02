# 📡 Blockchain DiploChain — API Documentation

**Intégration blockchain pour l’API backend**

---

## Objectif

Décrire les endpoints backend qui interagissent avec les contrats blockchain.

## Endpoints principaux

### POST /diplomas/:id/issue

- Action : émettre le diplôme sur la blockchain
- Backend : appelle `issueDiploma` sur le contrat `DiplomaIssuer`

### GET /diplomas/:id/blockchain-status

- Action : vérifier le statut on-chain
- Backend : interroge le contrat et retourne l’état

### POST /verify

- Action : vérifier un diplôme via hash
- Backend : appelle `DiplomaVerifier` ou recherche on-chain

## Contrats et adresses

- `CONTRACT_ISSUER_ADDRESS`
- `CONTRACT_VERIFIER_ADDRESS`
- `WEB3_PROVIDER`

## Format des transactions

### `issueDiploma`

```json
{
  "studentAddress": "0x...",
  "diplomaHash": "0x...",
  "metadata": "..."
}
```

### `verifyDiploma`

```json
{
  "diplomaHash": "0x..."
}
```

## Événements

- `DiplomaIssued(address indexed issuer, bytes32 indexed diplomaHash)`
- `DiplomaVerified(address indexed verifier, bytes32 indexed diplomaHash, bool valid)`

## Flux backend

1. Le backend reçoit `POST /diplomas/:id/issue`
2. Il construit la transaction pour `DiplomaIssuer`
3. Il signe avec la clé privée du deployer
4. Il envoie la transaction à `WEB3_PROVIDER`
5. Il attend la confirmation

## Erreurs courantes

- `INSUFFICIENT_FUNDS`
- `REVERT`
- `NETWORK_ERROR`
- `UNAUTHORIZED`

---

**Blockchain API ready**
