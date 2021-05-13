import {migrate} from "src/js/test/helpers/migrate"

test("migrating 202104291255_dropSpaces", async () => {
  const next = await migrate({state: "v0.24.0", to: "202104291255"})
  expect.assertions(1)

  // @ts-ignore
  for (const {state} of Object.values(next.windows)) {
    expect(state.spaces).toBe(undefined)
  }
})