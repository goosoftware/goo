import { convertKey } from "./convertPublicKey";

it("converts a string key", () => {
  expect(convertKey("G1xRB2q8J1RQBQLUuqMmVeTQXCQ6AUbK1j9QTdAkT416")).toEqual(
    "h7oCNunQur568k61tTpLkr4H3FN24YtkTnbDxeZD7S6"
  );
});
