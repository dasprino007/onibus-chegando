# Meu Ônibus Está Chegando

App mobile em React Native (Expo) que ajuda o cidadão a saber quando o ônibus chega em São Paulo, usando a API Olho Vivo da SPTrans, o GPS e notificações do celular.

Área de desafio: Citizen Intelligence & Predictive Analytics.

## Como funciona

1. O usuário digita uma linha ou destino (ex.: `8000` ou `Lapa`). O app mostra sugestões (autocomplete).
2. Ao tocar em **OK**, o app abre a primeira sugestão.
3. O app pede permissão de GPS e mostra um mapa com a posição do usuário e as paradas da linha mais próximas.
4. O usuário escolhe uma parada (pelo marcador no mapa ou pela lista com seleção).
5. O mapa dá zoom na parada e mostra quantos minutos faltam para o ônibus chegar. A previsão atualiza a cada 30 segundos.
6. Quando faltam 5 minutos ou menos, o celular vibra e envia uma notificação: **"Seu ônibus está chegando!"**

## Como executar

### Requisitos
- Node.js instalado
- App **Expo Go** no celular (Play Store ou App Store)
- Token da API Olho Vivo (crie uma conta em https://www.sptrans.com.br/desenvolvedores/ e gere o token em "Meus Aplicativos")

### Passo a passo

```bash
# 1. Instale as dependências
npm install

# 2. Crie o .env a partir do exemplo
cp .env.example .env

# 3. Edite o .env e coloque o seu token
# EXPO_PUBLIC_SPTRANS_TOKEN=seu_token_aqui

# 4. Inicie o app
npx expo start -c
```

5. Leia o QR Code com o Expo Go (Android) ou com a câmera (iPhone).
6. Celular e computador devem estar na mesma rede Wi-Fi. Se não der, use:

```bash
npx expo start --tunnel
```

### Observações
- Rode no **celular**, não no navegador. No navegador a API bloqueia por CORS e o mapa não funciona.
- O aviso sobre *push notifications* no Expo Go pode ser ignorado: o app usa notificações **locais**.
- Depois de criar ou alterar o `.env`, reinicie com `npx expo start -c`.

## Créditos

Dados fornecidos pela **SPTrans** através da API Olho Vivo.