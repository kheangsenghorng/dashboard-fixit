import Hashids from "hashids";

const hashids = new Hashids(
  process.env.NEXT_PUBLIC_HASHIDS_SECRET,
  Number(process.env.NEXT_PUBLIC_HASHIDS_LENGTH)
);

export const encodeId = (id) => hashids.encode(id);

export const decodeId = (hash) => {
  const decoded = hashids.decode(hash);
  return decoded.length ? decoded[0] : null;
};
