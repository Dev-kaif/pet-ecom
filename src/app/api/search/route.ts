// src/app/api/search/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/backend/lib/mongodb'; // Your database connection utility
import ProductModel from '@/backend/models/Product'; // Your Product Mongoose model
import PetModel from '@/backend/models/Pet';       // Your Pet Mongoose model

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = 5; 

    if (!query || query.trim() === '') {
      return NextResponse.json({ products: [], pets: [] }, { status: 200 });
    }

    const searchRegex = new RegExp(query.trim(), 'i'); 

    // Search for products
    const products = await ProductModel.find({
      $or: [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
      ],
    }).limit(limit);

    // Search for pets
    const pets = await PetModel.find({
      $or: [
        { name: { $regex: searchRegex } },
        { breed: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ],
    }).limit(limit);

    return NextResponse.json({ products, pets }, { status: 200 });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { message: 'Error performing search', error: (error as Error).message },
      { status: 500 }
    );
  }
}