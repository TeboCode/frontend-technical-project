import type { LoanProduct, LoanProductId, LoanPurpose } from "./types";

export function findProductForPurpose(products: LoanProduct[], purpose: LoanPurpose) {
  return products.find((product) => product.purposes.includes(purpose));
}

export function productForPurpose(products: LoanProduct[], purpose: LoanPurpose) {
  const product = findProductForPurpose(products, purpose);
  if (!product) throw new Error(`No loan product supports purpose "${purpose}"`);
  return product;
}

export function productById(products: LoanProduct[], id: LoanProductId) {
  const product = products.find((candidate) => candidate.id === id);
  if (!product) throw new Error(`Unknown loan product "${id}"`);
  return product;
}
