export function toCents(value: string | number): number {
  return Math.round(Number(value) * 100);
}

export function fromCents(value: number): string {
  return (value / 100).toFixed(2);
}

export function calculateEntryTotalCents(
  quantity: number,
  unitPrice: string | number,
  discountAmount: string | number = 0,
): number {
  const unitPriceCents = toCents(unitPrice);
  const discountCents = toCents(discountAmount);

  const totalCents = Math.round(quantity * unitPriceCents) - discountCents;

  if (totalCents < 0) {
    throw new Error('O desconto não pode ser maior que o valor do item.');
  }

  return totalCents;
}
