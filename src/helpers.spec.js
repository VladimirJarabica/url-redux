import R from 'ramda';

import { parseQuery, makeQuery } from './main';

describe('#urlHelper', () => {
  describe('#makeQuery', () => {
    it('should make empty query', () => {
      expect(makeQuery({})).toEqual('?');
    });
    it('should make simple query', () => {
      expect(makeQuery({ kek: 'bur' })).toEqual('?kek=bur');
    });
    it('should make query with multiple params', () => {
      expect(makeQuery({ kek: 'bur', lol: 1234 })).toEqual('?kek=bur&lol=1234');
    });
  });
  describe('#parseQuery', () => {
    it('should parse empty string', () => {
      expect(R.compose(R.length, R.keys, parseQuery)('')).toBe(0);
    });
    it('should parse simple query', () => {
      expect(parseQuery('kek=bur')).toEqual({ kek: 'bur' });
      expect(parseQuery('?kek=bur')).toEqual({ kek: 'bur' });
    });
    it('should parse query with multiple params', () => {
      expect(parseQuery('kek=bur&lol=1234')).toEqual({
        kek: 'bur',
        lol: '1234',
      });
      expect(parseQuery('?kek=bur&lol=1234')).toEqual({
        kek: 'bur',
        lol: '1234',
      });
    });
  });
  describe('#deterministic', () => {
    it('make => parse', () => {
      const input = { kek: 'bur', lol: '1234' };
      expect(R.compose(parseQuery, makeQuery)(input)).toEqual(input);
    });
    it('parse => make', () => {
      const input = '?kek=bur&lol=1234';
      expect(R.compose(makeQuery, parseQuery)(input)).toEqual(input);
    });
  });
});
