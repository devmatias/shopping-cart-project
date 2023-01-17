export const fetchProduct = async (id) => {
  // seu código aqui
  if (!id) throw new Error('ID não informado');
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const data = await response.json();
  return data;
};

export const fetchProductsList = async (query) => {
  // seu código aqui
  if (!query) throw new Error('Termo de busca não informado');
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const data = await response.json();
  return data.results;
};
