import { NextResponse } from "next/server";
import { db } from "@/services/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

function getIdFromSlug(slug: string) {

  const parts = slug.split("-p-")

  if (parts.length < 2) return null

  return `p-${parts[1]}`

}

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {

    const id = getIdFromSlug(params.slug);

    if (!id) {
      return NextResponse.json(null, { status: 404 });
    }

    const ref = doc(db, "products", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      console.log("❌ Product not found:", id);
      return NextResponse.json(null, { status: 404 });
    }

    console.log("✅ Product found:", snap.id);

    return NextResponse.json({
      id: snap.id,
      ...snap.data(),
    });

  } catch (error) {

    console.error("🔥 Firestore error:", error);

    return NextResponse.json(null, { status: 500 });

  }
}