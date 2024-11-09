import * as fs from "fs";

type OutputLine = Array<[string, number]>;

function getIndexOfBrackets(str: string): [number, number] {
  let start: number | undefined;
  let end: number | undefined;

  for (let i = str.length; i >= 0; i--) {
    if (start && end) {
      return [start, end];
    }

    if (str[i] === "{") start = i;
    else if (str[i] === "}") end = i;
  }

  if (!start || !end) {
    throw new Error("Could not find brackets");
  }

  return [start, end];
}

function getSubsetOfFileContent(fileContent: string[], lineNum: number) {
  const start = lineNum - 6 >= 0 ? lineNum - 6 : 0;
  const end = start === 0 ? lineNum : lineNum - 1;
  const subset = fileContent.splice(start, end);
  return subset;
}

function parseFlagNames(flagsStr: string) {
  const flags = flagsStr.split(",");
  return flags.filter((flagName) => flagName);
}

function getInputFileData() {
  return fs
    .readFileSync("references.txt", "utf-8")
    .split("\n")
    .filter((line) => line)
    .reduce((arr, current) => {
      const [path, lineNum] = current.split(":");

      if (path && lineNum) {
        arr.push([path, parseInt(lineNum)]);
      }

      return arr;
    }, [] as OutputLine);
}

const flags = new Map<string, number>();

try {
  const data = getInputFileData();

  data.forEach(([fileName, lineNum]) => {
    const content = fs.readFileSync(fileName, "utf-8");

    const fileContent = content.split("\n");
    const subset = getSubsetOfFileContent(fileContent, lineNum);

    // remvoe all whitespace
    const subsetStr = subset.join("").replace(/\s/g, "");

    const [openBracket, closeBracket] = getIndexOfBrackets(subsetStr);
    const flagNames = parseFlagNames(
      subsetStr.substring(openBracket + 1, closeBracket)
    );

    flagNames.forEach((flagName) => {
      const occurrences = flags.get(flagName) ?? 0;
      flags.set(flagName, occurrences + 1);
    });
  });

  const flagsStr = Array.from(flags.entries()).reduce(
    (flagsStr, [key, value]) => {
      flagsStr += `${key}=${value}\n`;
      return flagsStr;
    },
    ""
  );

  fs.writeFileSync("flags.txt", flagsStr);
} catch (err) {
  console.log("error: ", err);
}
