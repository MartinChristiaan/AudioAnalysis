
import { expect } from 'chai';
import 'mocha';
import { getOnsetFrequencyIndex } from '../../src/orchestra';
import { Onset } from '../../src/types/types';

describe('First test', 
  () => { 
    it('should return true', () => { 
      let onset = new Onset()
      onset.energy = 2
      onset.frequency = 11
      let numnotes = 4
      const Freq = getOnsetFrequencyIndex(onset,numnotes);
      expect(Freq).to.equal(numnotes); 
  }); 
});