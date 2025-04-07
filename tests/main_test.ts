import { assert, assertEquals, assertThrows } from "@std/assert";
import { Capabilities, description } from "../main.ts";
import * as ExampleCapabilities from "./capabilities.ts";

Deno.test("description pulls together the right values", () => {
	assertEquals(
		description({ "hi": 37, "yep": 29 }),
		"hi: 37; yep: 29",
	);
});

Deno.test("types", () => {
	for (
		const [_, deviceCapabilities] of Object.entries(
			ExampleCapabilities.validCapabilities,
		)
	) {
		assert(deviceCapabilities satisfies Capabilities);
	}

	for (
		const [_, deviceCapabilities] of Object.entries(
			ExampleCapabilities.invalidCapabilities,
		)
	) {
		// @ts-expect-error
		assertThrows(deviceCapabilities satisfies Capabilities);
	}
});
