const BASE = 'https://api.olhovivo.sptrans.com.br/v2.1';

async function get(path) {
  const res = await fetch(BASE + path, { credentials: 'include' });
  return res.json();
}

export async function login() {
  const token = process.env.EXPO_PUBLIC_SPTRANS_TOKEN;
  const res = await fetch(`${BASE}/Login/Autenticar?token=${token}`, {
    method: 'POST',
    credentials: 'include',
  });
  return res.json(); // true
}

export const buscarLinhas = (termo) => get(`/Linha/Buscar?termosBusca=${encodeURIComponent(termo)}`);
export const paradasDaLinha = (cl) => get(`/Parada/BuscarParadasPorLinha?codigoLinha=${cl}`);
export const previsao = (cp, cl) => get(`/Previsao?codigoParada=${cp}&codigoLinha=${cl}`);
export const posicaoDaLinha = (cl) => get(`/Posicao/Linha?codigoLinha=${cl}`);