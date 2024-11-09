"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function getIndexOfBrackets(str) {
    var start;
    var end;
    for (var i = str.length; i >= 0; i--) {
        if (start && end) {
            return [start, end];
        }
        if (str[i] === "{")
            start = i;
        else if (str[i] === "}")
            end = i;
    }
    if (!start || !end) {
        throw new Error("Could not find brackets");
    }
    return [start, end];
}
function getSubsetOfFileContent(fileContent, lineNum) {
    var start = lineNum - 6 >= 0 ? lineNum - 6 : 0;
    var end = start === 0 ? lineNum : lineNum - 1;
    var subset = fileContent.splice(start, end);
    return subset;
}
function parseFlagNames(flagsStr) {
    var flags = flagsStr.split(",");
    return flags.filter(function (flagName) { return flagName; });
}
function getInputFileData() {
    return fs
        .readFileSync("references.txt", "utf-8")
        .split("\n")
        .filter(function (line) { return line; })
        .reduce(function (arr, current) {
        var _a = current.split(":"), path = _a[0], lineNum = _a[1];
        if (path && lineNum) {
            arr.push([path, parseInt(lineNum)]);
        }
        return arr;
    }, []);
}
var flags = new Map();
try {
    var data = getInputFileData();
    data.forEach(function (_a) {
        var fileName = _a[0], lineNum = _a[1];
        var content = fs.readFileSync(fileName, "utf-8");
        var fileContent = content.split("\n");
        var subset = getSubsetOfFileContent(fileContent, lineNum);
        // remvoe all whitespace
        var subsetStr = subset.join("").replace(/\s/g, "");
        var _b = getIndexOfBrackets(subsetStr), openBracket = _b[0], closeBracket = _b[1];
        var flagNames = parseFlagNames(subsetStr.substring(openBracket + 1, closeBracket));
        flagNames.forEach(function (flagName) {
            var _a;
            var occurrences = (_a = flags.get(flagName)) !== null && _a !== void 0 ? _a : 0;
            flags.set(flagName, occurrences + 1);
        });
    });
    var flagsStr = Array.from(flags.entries()).reduce(function (flagsStr, _a) {
        var key = _a[0], value = _a[1];
        flagsStr += "".concat(key, "=").concat(value, "\n");
        return flagsStr;
    }, "");
    fs.writeFileSync("flags.txt", flagsStr);
}
catch (err) {
    console.log("error: ", err);
}
