import * as fs from 'fs';

// Function to check if a file exists, and create it if it doesn't
function createJsonFile(filePath: string, defaultContent: string = '{}'): void {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, defaultContent, 'utf8');
  }   
}

// Function to read and update JSON
export function updateJsonFile(filePath: string, key: string, value: any): void {
  // Read the JSON file
  createJsonFile(filePath);
  const dataBuffer = fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(dataBuffer);

  jsonData[key] = value;

  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
}

// read and return the JSON file
export function readJsonFile(filePath: string): any {
  const dataBuffer = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(dataBuffer);
}


