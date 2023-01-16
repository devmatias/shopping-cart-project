import './mocks/fetchSimulator';
import { fetchProduct } from '../helpers/fetchFunctions';
import product from './mocks/product';

// implemente seus testes aqui
describe('Teste a função fetchProduct', () => {
  it('a função fetchProduct é uma função?', () => {
    expect(typeof fetchProduct).toBe('function')
  });

  it('testar se o fetch da função fetchProduct foi chamado com o param `MLB1405519561`', async () => {
    await fetchProduct('MLB1405519561')
    expect(fetch).toHaveBeenCalled()
  });

  it('testar se o fetch da função fetchProduct foi chamado com o endpoint para `MLB1405519561`', async () => {
    await fetchProduct('MLB1405519561')
    expect(fetch).toHaveBeenCalledWith('https://api.mercadolibre.com/items/MLB1405519561')
  });

  it('testar se o retorno da função fetchProduct foi é igual ao mock product', async () => {
    const data = await fetchProduct('MLB1405519561')
    expect(data).toEqual(product)
  });

  it('a função fetchProduct sem argumentos retorna o erro `ID não informado`', async () => {
    await expect(fetchProduct()).rejects.toThrow(new Error('ID não informado'));
  });
});
