import * as esbuild from "https://deno.land/x/esbuild@v0.25.2/mod.js";

async function build() {
	const result = await esbuild.build({
		entryPoints: ["./main.ts"],
		outfile: "./dist/main.js",
		bundle: true,
		minify: true,
		platform: "browser",
		format: "iife",
		sourcemap: true,
	});

	console.log("Bundling complete:", result);
	esbuild.stop();
}

build();
