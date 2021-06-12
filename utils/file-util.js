let fs = require('fs');

/**
 * This function will read a file synchronously
 *
 * @param fileName The name of the file as a String
 * @returns {*} The file content will be returned as a String
 */
exports.readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
};

/**
 * This function will write to a file, when the content is given as a String
 *
 * @param jsonString The content to be written to a file as a String
 * @param fileName The name of the file as a String
 *
 * @returns A promise for writing to a file
 */
exports.writeToJSONFile = (jsonString, fileName) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, jsonString, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve('done');
            }
        });
    })
};

exports.createFolder = (directory) => {
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory, { recursive: true });
    }
}

exports.deleteFile = (file) => {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
}
