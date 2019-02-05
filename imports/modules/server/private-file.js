import fs from 'fs';

export const privateFilePath = path => `assets/app/${path}`;

export const getPrivateFile = path => fs.readFileSync(`assets/app/${path}`, 'utf8');
