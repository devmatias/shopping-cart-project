export async function fetchFirstCEPAPI(cep) {
  const response = await fetch(`https://cep.awesomeapi.com.br/json/${cep}`);
  const data = await response.json();
  return data;
}

export async function fetchSecondCEPAPI(cep) {
  const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
  const data = await response.json();
  return data;
}

export const getAddress = async (cep) => {
  // seu código aqui
  if (!cep) throw new Error('Cep não informado');
  try {
    const data = await Promise.any([
      fetchFirstCEPAPI(cep),
      fetchSecondCEPAPI(cep),
    ]);
    return data;
  } catch (error) {
    return { code: 'invalid' };
  }
};

export const searchCep = async () => {
  // seu código aqui
  const cepInputValue = document.querySelector('.cep-input');
  const adressElement = document.querySelector('.cart__address');
  try {
    const data = await getAddress(cepInputValue.value);
    if (data.code === 'invalid' || data.type === 'service_error') {
      throw Error('CEP não encontrado');
    }
    adressElement.innerHTML = `${data.address || data.street} \
- ${data.district || data.neighborhood} - ${data.city} - ${data.state}`;
  } catch (error) {
    adressElement.innerHTML = error.message;
  }
};
