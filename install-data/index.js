async function extractCEPsOnly() {
  const cepResource = new URL('./CEPs.txt', import.meta.url);
  const response = await fetch(cepResource);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const textData = await response.text();
  const lines = textData.split('\n');
  const extractCEP = (line) => line.split(';')[3];
  const cepList = lines.map(extractCEP);
  return cepList;
}

export async function fetchZipCodeData(zipCode) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
  // const response = await fetch(
  //   `https://brasilapi.com.br/api/cep/v1/${zipCode}`
  // );
  return response.json();
}

export function zipCodeMapper(zipCodeData) {
  return {
    zipCode: zipCodeData.cep.replace('-', ''),
    state: zipCodeData.uf || zipCodeData.state,
    location: zipCodeData.localidade || zipCodeData.city,
    publicPlace: zipCodeData.logradouro || zipCodeData.street,
    neighborhood: zipCodeData.bairro || zipCodeData.neighborhood,
    phoneCode: zipCodeData.ddd || '',
  };
}

async function getDB() {
  const { default: getZipCodeDatabase } = await import(
    '../helpers/database.js'
  );
  const db = await getZipCodeDatabase();
  return db;
}

export async function installData() {
  const cepList = await extractCEPsOnly();
  const promiseList = await Promise.allSettled(cepList.map(fetchZipCodeData));
  const onlyFulfilled = (result) => result.status === 'fulfilled';
  const onlyValues = (result) => result.value;
  const zipCodeListData = promiseList.filter(onlyFulfilled).map(onlyValues);
  const onlyDataWithCEP = (cepData) => !!cepData.cep;
  const zipCodeMappedList = zipCodeListData
    .filter(onlyDataWithCEP)
    .map(zipCodeMapper);
  const db = await getDB();
  return db.zipCode.bulkPut(zipCodeMappedList);
}

async function saveToLocalDB(zipCodeData) {
  const db = await getDB();
  db.zipCode.add(zipCodeData).then((result) => console.log('Added ', result));
}

export async function getFromNetwork(zipCode) {
  const zipCodeData = await fetchZipCodeData(zipCode);
  const zipCodeMapped = zipCodeMapper(zipCodeData);
  saveToLocalDB(zipCodeMapped);
  return zipCodeMapped;
}
