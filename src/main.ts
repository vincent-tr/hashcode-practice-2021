const [inputFilePath] = Deno.args;
const input = await Deno.readTextFile(inputFilePath);
console.log(input);
