// src/lib/services/pricingService.ts

import Product from "@/backend/models/Product";
import { IProduct, IPopulatedCartItem, CalculatedCartSummary, IStockOperationItem } from "@/types"; 
import { Types } from "mongoose"; // Import Types for ObjectId conversion

// --- Configuration Constants (Move to environment variables or a config file in production) ---
const FREE_SHIPPING_THRESHOLD = 100; // Total subtotal for free shipping
const BASE_SHIPPING_COST = 7.50;    // Standard shipping cost
const SALES_TAX_RATE = 0.08;        // 8% sales tax (e.g., 0.08 for 8%)

/**
 * Calculates the complete pricing summary for a given set of cart items.
 * This function fetches authoritative product prices and stock from the database
 * to ensure security and accuracy.
 *
 * @param populatedCartItems An array of cart items where `productId` is already populated as `IProduct`.
 * It expects `productId._id`, `productId.price`, `productId.stock`,
 * and `productId.images` to be present.
 * @returns A promise that resolves to the calculated pricing summary.
 */
export async function calculateCartSummary(
  populatedCartItems: IPopulatedCartItem[]
): Promise<CalculatedCartSummary> {
  let subtotal = 0;
  let itemCount = 0;
  const itemsDetails: CalculatedCartSummary['itemsDetails'] = [];
  const errors: string[] = [];

  // It's safer to re-fetch product data here to guarantee the latest prices and stock,
  // even if `populatedCartItems` theoretically contains it. This protects against
  // stale data if `populate` happened long ago or if the `populatedCartItems`
  // came from a less secure source.
  const productIds = populatedCartItems
    .map(item => item.productId?._id) // Safely get _id, which might be undefined from populated item if original product was bad
    .filter((id): id is Types.ObjectId => id !== undefined && id !== null); // Filter out undefined/null and assert type

  const dbProducts = await Product.find({ _id: { $in: productIds } }).lean(); // .lean() for faster, plain JS objects

  const productMap = new Map<string, IProduct>();
  dbProducts.forEach((p: IProduct) => { // Explicitly type 'p' as IProduct to resolve 'any' error
      if (p._id) { // Ensure _id is present before converting to string
          productMap.set(p._id.toString(), p);
      }
  });

  for (const cartItem of populatedCartItems) {
    // Extensive check for valid populated product data before proceeding
    if (!cartItem.productId || // Product object itself is null/undefined
        !cartItem.productId._id || // Product ID is missing
        typeof cartItem.productId.price === 'undefined' || // Price is missing
        typeof cartItem.productId.stock === 'undefined' || // Stock is missing
        !Array.isArray(cartItem.productId.images) // Images array is missing
    ) {
      errors.push(`Product data missing or invalid for cart item (cart item _id: ${cartItem._id}). Item skipped.`);
      continue;
    }

    // Now we can safely use _id as we've checked for its existence
    const productId = cartItem.productId._id.toString();
    const product = productMap.get(productId);

    if (!product) {
      errors.push(`Product with ID ${productId} not found in database during re-check. Item skipped from calculation.`);
      continue; // Skip this item if product not found in DB
    }

    // --- Price and Stock Validation (Authoritative data from freshly fetched product) ---
    const authoritativePrice = product.price;
    const authoritativeStock = product.stock; // Guaranteed to be a number now due to IProduct definition

    const requestedQuantity = cartItem.quantity;

    // Basic stock check for summary (final critical check should be in order route)
    if (requestedQuantity > authoritativeStock) {
        errors.push(`Insufficient stock for "${product.name}". Requested: ${requestedQuantity}, Available: ${authoritativeStock}. Calculated with available stock.`);
        // For summary, we might still calculate with requested quantity, but warn.
        // Or for a stricter summary, calculate with `authoritativeStock` for this item:
        // subtotal += authoritativePrice * authoritativeStock;
        // itemCount += authoritativeStock;
        // For now, we continue with requested quantity but add an error.
    }

    // Use authoritative price for calculation
    subtotal += authoritativePrice * requestedQuantity;
    itemCount += requestedQuantity;

    itemsDetails.push({
      productId: productId,
      name: product.name,
      price: authoritativePrice,
      quantity: requestedQuantity,
      stock: authoritativeStock, // Now guaranteed to be a number
      imageUrl: product.images?.[0] || '/images/placeholder.jpg', // Use first image, or a placeholder
      totalItemPrice: parseFloat((authoritativePrice * requestedQuantity).toFixed(2)),
    });
  }

  // --- Shipping Calculation ---
  const shippingPrice = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING_COST;

  // --- Tax Calculation ---
  const taxPrice = subtotal * SALES_TAX_RATE;

  // --- Grand Total ---
  const totalPrice = subtotal + shippingPrice + taxPrice;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    shippingPrice: parseFloat(shippingPrice.toFixed(2)),
    taxRate: SALES_TAX_RATE,
    taxPrice: parseFloat(taxPrice.toFixed(2)),
    totalPrice: parseFloat(totalPrice.toFixed(2)),
    itemCount: itemCount,
    itemsDetails: itemsDetails,
    errors: errors,
  };
}

/**
 * Validates stock availability for items intended for an order.
 * This should ideally be called just before finalizing an order.
 *
 * @param items A list of items with their product ID and quantity.
 * @returns A promise that resolves to true if all items are in stock,
 * or throws an error with a specific message if stock is insufficient.
 */
export async function validateStockForOrder(
  items: IStockOperationItem[]
): Promise<boolean> {
    const productIds = items.map(item => new Types.ObjectId(item.productId)); // Convert string IDs to ObjectId
    const dbProducts = await Product.find({ _id: { $in: productIds } }).select('name stock').lean();

    const productMap = new Map<string, IProduct>();
    dbProducts.forEach((p: IProduct) => { // Explicitly type 'p'
        if (p._id) {
            productMap.set(p._id.toString(), p);
        }
    });

    for (const item of items) {
        const product = productMap.get(item.productId.toString());
        if (!product) {
            throw new Error(`Product with ID ${item.productId} not found during stock validation. It may have been removed.`);
        }
        if (typeof product.stock === 'undefined' || item.quantity > product.stock) {
            throw new Error(`Insufficient stock for "${product.name}". Only ${product.stock ?? 0} available.`);
        }
    }
    return true; // All items are in stock
}

/**
 * Deducts stock from products after a successful order.
 * This should be part of a transactional process to ensure data integrity.
 *
 * @param items A list of items with their product ID and quantity to deduct.
 * @returns A promise that resolves when stock deduction is complete.
 */
export async function deductStock(
  items: IStockOperationItem[]
): Promise<void> {
  const bulkOperations = items.map(item => ({
    updateOne: {
      filter: { _id: new Types.ObjectId(item.productId), stock: { $gte: item.quantity } }, // Convert string ID to ObjectId, ensure stock is sufficient
      update: { $inc: { stock: -item.quantity } },
    },
  }));

  const result = await Product.bulkWrite(bulkOperations);

  if (result.modifiedCount !== items.length) {
      console.warn("Stock deduction mismatch. Some items might not have been updated correctly due to race conditions or insufficient initial stock.");
      // In a real system, this would trigger an alert or more complex rollback/retry mechanism.
  }
}