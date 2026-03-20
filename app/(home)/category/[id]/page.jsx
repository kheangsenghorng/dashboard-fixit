"use client";

import { useParams } from "next/navigation";
import { decodeId } from "../../../utils/hashids";

export default function CategoryPage() {
  const params = useParams();

  const encodedId = params.id;
  const categoryId = decodeId(encodedId);

  if (!categoryId) {
    return <div>Invalid category</div>;
  }

  return (
    <div>
      <h1>Category Page</h1>
      <p>Encoded ID: {encodedId}</p>
      {/* <p>Decoded ID: {categoryId}</p> */}
    </div>
  );
}
