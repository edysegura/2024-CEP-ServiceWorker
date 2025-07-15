export default class CEP {
  constructor(cep) {
    const cleanCEP = this.#removeMask(cep);

    if (!this.#isValid(cleanCEP)) {
      throw new Error('Invalid CEP format');
    }

    this.cep = cleanCEP;
  }

  #removeMask(cep) {
    return cep.replace(/\D/g, '');
  }

  #isValid(cep) {
    if (!cep) return false;

    // Must be exactly 8 digits after removing non-digits
    if (cep.length !== 8) return false;

    // Must contain only numbers
    if (!/^\d+$/.test(cep)) return false;

    // Cannot be all zeros
    if (/^0{8}$/.test(cep)) return false;

    return true;
  }

  toString() {
    return this.cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  valueOf() {
    return this.cep;
  }
}
