import './mocks/fetchSimulator';
import { fetchProductsList } from '../helpers/fetchFunctions';
import computadorSearch from './mocks/search';

// implemente seus testes aqui
describe('Teste a função fetchProductsList', () => {
  it('fetchProductsList é uma função', () => {
    expect(typeof fetchProductsList).toBe('function')
  });

  it('fetch é chamado ao executar fetchProductsList', async () => {
    await fetchProductsList('computador')
    expect(fetch).toHaveBeenCalled()
  });

  it('fetch é chamado com o endpoint correto ao executar fetchProductsList', async () => {
    await fetchProductsList('computador')
    expect(fetch).toHaveBeenCalledWith('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  });

  it('o retorno da função fetchProductList com o argumento `computador` me entrega uma estrutura igual ao mock computadorSearch', async () => {
    const fetchComputador = await fetchProductsList('computador');
    expect(fetchComputador).toEqual(computadorSearch)
  });

  it('a função fetchProductList sem argumentos retorna o erro `Termo de busca não informado`', async () => {
    await expect(fetchProductsList()).rejects.toThrow(new Error('Termo de busca não informado')); 
  });
  // it('...', () => {
  // });
});
